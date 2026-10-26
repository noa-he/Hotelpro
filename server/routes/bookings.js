const express = require('express');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { protect, authorize } = require('../middleware/auth');
const { ACTIVE, overlapQuery, isRoomFree } = require('../utils/availability');
const { emitAvailability } = require('../socket');

const router = express.Router();
router.use(protect); // every booking route needs a valid JWT

const nightsBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);

// POST /api/bookings
router.post('/', async (req, res, next) => {
  try {
    const { room: roomId, checkIn, checkOut, guests } = req.body;
    if (!roomId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({ message: 'room, checkIn, checkOut and guests are required' });
    }
    const nights = nightsBetween(checkIn, checkOut);
    if (!(nights > 0)) return res.status(400).json({ message: 'Check-out must be after check-in' });

    const room = await Room.findById(roomId);
    if (!room || room.status === 'maintenance') {
      return res.status(404).json({ message: 'Room not available' });
    }
    if (guests > room.capacity) {
      return res.status(400).json({ message: `This room sleeps ${room.capacity} guests at most` });
    }
    if (!(await isRoomFree(roomId, checkIn, checkOut))) {
      return res.status(409).json({ message: 'Room is already booked for those dates' });
    }

    const booking = await Booking.create({
      user: req.user._id,
      room: roomId,
      checkIn,
      checkOut,
      guests,
      totalPrice: nights * room.pricePerNight, // computed on the server, never trusted from the client
    });

    // Race guard: if another request grabbed the same dates at the same moment,
    // the booking with the lower _id wins and this one is rolled back.
    const rival = await Booking.exists({ ...overlapQuery(roomId, checkIn, checkOut), _id: { $lt: booking._id } });
    if (rival) {
      await booking.deleteOne();
      return res.status(409).json({ message: 'Someone just booked this room for those dates' });
    }

    emitAvailability(roomId); // live update for everyone watching this room
    res.status(201).json(booking);
  } catch (err) { next(err); }
});

// GET /api/bookings/my
router.get('/my', async (req, res, next) => {
  try {
    res.json(await Booking.find({ user: req.user._id }).populate('room').sort('-createdAt'));
  } catch (err) { next(err); }
});

// GET /api/bookings  (staff, admin)
router.get('/', authorize('staff', 'admin'), async (req, res, next) => {
  try {
    const query = req.query.status ? { status: req.query.status } : {};
    res.json(
      await Booking.find(query).populate('room').populate('user', 'name email phone').sort('-createdAt')
    );
  } catch (err) { next(err); }
});

// PUT /api/bookings/:id  (owner, staff, admin): cancel, confirm (staff), or change dates/guests
router.put('/:id', async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('room');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const isOwner = String(booking.user) === String(req.user._id);
    if (!isOwner && req.user.role === 'guest') return res.status(403).json({ message: 'Forbidden' });
    if (['checked-in', 'checked-out', 'cancelled'].includes(booking.status)) {
      return res.status(400).json({ message: `Booking is already ${booking.status}` });
    }

    const { status, checkIn, checkOut, guests } = req.body;

    if (status === 'cancelled') {
      booking.status = 'cancelled';
      if (booking.paymentStatus === 'paid') booking.paymentStatus = 'refunded';
    } else if (status === 'confirmed' && req.user.role !== 'guest') {
      booking.status = 'confirmed';
    }

    if (checkIn || checkOut || guests) {
      const newIn = checkIn || booking.checkIn;
      const newOut = checkOut || booking.checkOut;
      const nights = nightsBetween(newIn, newOut);
      if (!(nights > 0)) return res.status(400).json({ message: 'Check-out must be after check-in' });
      if (guests && guests > booking.room.capacity) {
        return res.status(400).json({ message: `This room sleeps ${booking.room.capacity} guests at most` });
      }
      if (!(await isRoomFree(booking.room._id, newIn, newOut, booking._id))) {
        return res.status(409).json({ message: 'Room is already booked for those dates' });
      }
      booking.checkIn = newIn;
      booking.checkOut = newOut;
      if (guests) booking.guests = guests;
      booking.totalPrice = nights * booking.room.pricePerNight;
    }

    await booking.save();
    emitAvailability(booking.room._id); // dates changed or booking cancelled
    res.json(booking);
  } catch (err) { next(err); }
});

// PUT /api/bookings/:id/checkin  (staff, admin)
router.put('/:id/checkin', authorize('staff', 'admin'), async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status !== 'confirmed') {
      return res.status(400).json({ message: 'Only confirmed bookings can be checked in' });
    }
    booking.status = 'checked-in';
    await booking.save();
    await Room.findByIdAndUpdate(booking.room, { status: 'occupied' });
    res.json(booking);
  } catch (err) { next(err); }
});

// PUT /api/bookings/:id/checkout  (staff, admin)
router.put('/:id/checkout', authorize('staff', 'admin'), async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status !== 'checked-in') {
      return res.status(400).json({ message: 'Guest is not checked in' });
    }
    booking.status = 'checked-out';
    await booking.save();
    await Room.findByIdAndUpdate(booking.room, { status: 'available' });
    res.json(booking);
  } catch (err) { next(err); }
});

module.exports = router;
