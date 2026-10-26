// Run once: npm run seed   (creates demo users and rooms; clears existing ones)
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Room = require('./models/Room');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User.deleteMany({}), Room.deleteMany({})]);
  await User.create([
    { name: 'Admin', email: 'admin@hotelpro.com', password: 'admin123', role: 'admin' },
    { name: 'Front Desk', email: 'staff@hotelpro.com', password: 'staff123', role: 'staff' },
    { name: 'Demo Guest', email: 'guest@hotelpro.com', password: 'guest123', role: 'guest' },
  ]);
  const types = [
    ['single', 1, 1800, ['WiFi', 'AC', 'TV']],
    ['double', 2, 2800, ['WiFi', 'AC', 'TV', 'Breakfast']],
    ['deluxe', 3, 4200, ['WiFi', 'AC', 'TV', 'Breakfast', 'Mini bar']],
    ['suite', 4, 7500, ['WiFi', 'AC', 'TV', 'Breakfast', 'Mini bar', 'Bathtub', 'Lounge']],
  ];
  const rooms = [];
  types.forEach(([type, capacity, pricePerNight, amenities], i) => {
    for (let n = 1; n <= 3; n++) {
      rooms.push({
        roomNumber: `${i + 1}0${n}`, type, capacity, pricePerNight, amenities,
        description: `A comfortable ${type} room with everything you need for a relaxed stay.`,
      });
    }
  });
  await Room.insertMany(rooms);
  console.log('Seeded: 3 users, 12 rooms');
  process.exit(0);
})();
