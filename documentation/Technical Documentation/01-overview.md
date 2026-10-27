# 1. Overview

## Purpose

HotelPro replaces paper registers and spreadsheets for a small or mid-sized hotel. It covers the full booking life cycle: searching rooms, booking, confirmation, check-in, check-out and cancellation.

## Features

**Guests**
- Register and sign in
- Search rooms by dates, number of guests, room type and maximum price
- See live availability while choosing dates, including which date ranges are already taken
- Book a room, view their bookings, change dates or guest count, and cancel

**Staff (front desk)**
- Dashboard of all bookings with counts per status and total booked value
- Filter bookings by status
- Confirm pending bookings, check guests in and out, cancel bookings

**Admins**
- Everything staff can do
- Create, update and delete rooms through the API

**System**
- Double-booking prevention: an overlap check plus a race-condition guard
- Server-side price calculation (the client never sets the price)
- Live updates over WebSockets, so two people looking at the same room see changes immediately
- Role-based access control (guest, staff, admin)
- Colourful responsive UI: gradient navbar and hero, room cards coloured by room type

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, React Router 6, Axios, Bootstrap 5 |
| Backend | Node.js, Express 4 |
| Database | MongoDB with Mongoose 8 |
| Auth | JSON Web Tokens (`jsonwebtoken`), passwords hashed with `bcryptjs` |
| Real time | Socket.IO 4 (server and client) |
| Hardening | `helmet`, `cors`, `morgan` request logging |

## Project structure

```
HotelPro/
├── client/                     React frontend
│   ├── index.html
│   ├── vite.config.js
│   ├── vercel.json             SPA rewrite for Vercel
│   ├── .env.example            VITE_API_URL
│   └── src/
│       ├── main.jsx            App entry, router and auth provider
│       ├── App.jsx             Route table
│       ├── theme.css           Colour theme (loads after Bootstrap)
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── RoomList.jsx    Search and room cards
│       │   ├── BookingForm.jsx Live availability and booking
│       │   ├── Dashboard.jsx   Guest "My bookings" and staff dashboard
│       │   └── ProtectedRoute.jsx
│       ├── context/AuthContext.jsx   Login state and token storage
│       ├── hooks/useAvailability.js  Debounced check + live socket updates
│       └── services/
│           ├── api.js          Axios instance with JWT interceptor
│           └── socket.js       Shared Socket.IO client
└── server/                     Express backend
    ├── server.js               App setup, routes, error handler, DB connect
    ├── socket.js               Socket.IO server and emit helper
    ├── seed.js                 Demo users and rooms
    ├── .env.example
    ├── middleware/auth.js      protect (JWT) and authorize (roles)
    ├── models/                 User.js, Room.js, Booking.js
    ├── routes/                 auth.js, rooms.js, bookings.js
    └── utils/availability.js   Overlap query and availability helpers
```

## Client routes

| Path | Component | Access |
|------|-----------|--------|
| `/` | RoomList | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/book/:roomId` | BookingForm | Signed-in users |
| `/dashboard` | Dashboard | Signed-in users (content depends on role) |
| anything else | Redirects to `/` | n/a |
