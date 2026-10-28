const { Server } = require('socket.io');

let io = null;

// Call once with the HTTP server
exports.init = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
  origin: (origin, cb) => {
    const allowed = (process.env.CLIENT_URL || 'http://localhost:5173')
      .split(',')
      .map((s) => s.replace(/[^\x21-\x7E]/g, '').replace(/\/+$/, ''))
      .filter(Boolean);
    cb(null, !origin || allowed.includes(origin));
  },
 },
  });

  io.on('connection', (socket) => {
    // A client viewing a room's booking form joins that room's channel
    socket.on('room:watch', (roomId) => socket.join(`room:${roomId}`));
    socket.on('room:unwatch', (roomId) => socket.leave(`room:${roomId}`));
  });
  return io;
};

// Tell watchers of one room, and anyone on the room list, that availability changed.
// Only ids are sent; clients re-fetch, so no booking data leaks over the socket.
exports.emitAvailability = (roomId) => {
  if (!io) return;
  io.to(`room:${roomId}`).emit('availability:changed', { roomId: String(roomId) });
  io.emit('rooms:changed');
};
