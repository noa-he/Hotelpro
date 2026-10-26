require('dotenv').config();
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Global middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/bookings', require('./routes/bookings'));

// 404 + error handler
app.use((req, res) => res.status(404).json({ message: `Not found: ${req.originalUrl}` }));
app.use((err, req, res, next) => {
  let status = 500;
  let message = err.message || 'Server error';
  if (err.name === 'ValidationError') status = 400;
  if (err.name === 'CastError') { status = 400; message = 'Invalid id'; }
  if (err.code === 11000) { status = 400; message = 'Duplicate value: ' + Object.keys(err.keyValue).join(', '); }
  res.status(status).json({ message });
});

// Connect to MongoDB, then start listening
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    const server = http.createServer(app);
    require('./socket').init(server);
    server.listen(PORT, () => console.log(`HotelPro API + live updates running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
