const express = require('express');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const { protect, authorize } = require('../middleware/auth');
const { findConflicts, getBookedRanges } = require('../utils/availability');

const router = express.Router();

// GET /api/rooms?type=&minPrice=&maxPrice=&guests=&checkIn=&checkOut=&page=&limit=
router.get('/', async (req, res, next) => {
  try {
    const { type, minPrice, maxPrice, guests, checkIn, checkOut, page = 1, limit = 12 } = req.query;
    const query = { status: { $ne: 'maintenance' } };

    if (type) query.type = type;
    if (guests) query.capacity = { $gte: Number(guests) };
    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }

    // Exclude rooms that already have an active booking overlapping the dates
    if (checkIn && checkOut) {
      const busy = await Booking.find({
        status: { $in: ['pending', 'confirmed', 'checked-in'] },
        checkIn: { $lt: new Date(checkOut) },
        checkOut: { $gt: new Date(checkIn) },
      }).select('room');
      query._id = { $nin: busy.map((b) => b.room) };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [rooms, total] = await Promise.all([
      Room.find(query).sort({ pricePerNight: 1 }).skip(skip).limit(Number(limit)),
      Room.countDocuments(query),
    ]);
    res.json({ rooms, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) { next(err); }
});

// GET /api/rooms/:id/availability?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD  (public)
// Without dates it only returns the upcoming booked ranges.
router.get('/:id/availability', async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).select('status');
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const bookedRanges = await getBookedRanges(room._id);
    const { checkIn, checkOut } = req.query;
    if (!checkIn || !checkOut) return res.json({ roomId: room._id, bookedRanges });

    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    if (isNaN(inDate) || isNaN(outDate) || outDate <= inDate) {
      return res.status(400).json({ message: 'Check-out must be after check-in' });
    }

    if (room.status === 'maintenance') {
      return res.json({ roomId: room._id, available: false, reason: 'maintenance', conflicts: [], bookedRanges });
    }
    const conflicts = await findConflicts(room._id, inDate, outDate);
    res.json({
      roomId: room._id,
      available: conflicts.length === 0,
      reason: conflicts.length ? 'booked' : null,
      conflicts,
      bookedRanges,
    });
  } catch (err) { next(err); }
});

// GET /api/rooms/:id
router.get('/:id', async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) { next(err); }
});

// POST /api/rooms  (admin)
router.post('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    res.status(201).json(await Room.create(req.body));
  } catch (err) { next(err); }
});

// PUT /api/rooms/:id  (admin)
router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) { next(err); }
});

// DELETE /api/rooms/:id  (admin)
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ message: 'Room deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
