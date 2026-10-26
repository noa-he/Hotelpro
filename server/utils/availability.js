const Booking = require('../models/Booking');

// Bookings that block a room. Cancelled and checked-out bookings do not.
const ACTIVE = ['pending', 'confirmed', 'checked-in'];

const overlapQuery = (roomId, checkIn, checkOut) => ({
  room: roomId,
  status: { $in: ACTIVE },
  checkIn: { $lt: new Date(checkOut) },   // existing starts before the new stay ends
  checkOut: { $gt: new Date(checkIn) },   // existing ends after the new stay starts
});

// Existing bookings that clash with the requested dates (dates only, no guest details)
async function findConflicts(roomId, checkIn, checkOut, ignoreId) {
  const query = overlapQuery(roomId, checkIn, checkOut);
  if (ignoreId) query._id = { $ne: ignoreId };
  return Booking.find(query).select('checkIn checkOut -_id').sort('checkIn');
}

async function isRoomFree(roomId, checkIn, checkOut, ignoreId) {
  const query = overlapQuery(roomId, checkIn, checkOut);
  if (ignoreId) query._id = { $ne: ignoreId };
  return !(await Booking.exists(query));
}

// Upcoming blocked date ranges for a room, so the UI can show what is taken
async function getBookedRanges(roomId) {
  return Booking.find({ room: roomId, status: { $in: ACTIVE }, checkOut: { $gt: new Date() } })
    .select('checkIn checkOut -_id')
    .sort('checkIn');
}

module.exports = { ACTIVE, overlapQuery, findConflicts, isRoomFree, getBookedRanges };
