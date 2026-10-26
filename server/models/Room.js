const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true, trim: true },
    type: { type: String, enum: ['single', 'double', 'deluxe', 'suite'], required: true },
    pricePerNight: { type: Number, required: true, min: 0 },
    capacity: { type: Number, required: true, min: 1 },
    amenities: [String],
    images: [String],
    description: String,
    status: { type: String, enum: ['available', 'occupied', 'maintenance'], default: 'available' },
  },
  { timestamps: true }
);

roomSchema.index({ type: 1, pricePerNight: 1 });

module.exports = mongoose.model('Room', roomSchema);
