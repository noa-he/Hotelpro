# Solution Requirements

**Project:** HotelPro: Hotel Management Web Application
**Phase:** Requirement Analysis

## Functional requirements

| FR No. | Requirement | Sub-requirements | Priority |
|--------|-------------|------------------|----------|
| FR-1 | User registration | Register with name, email, password (min 6 chars), optional phone · Duplicate email rejected · Public sign-up creates guests only | High |
| FR-2 | User authentication | Sign in with email and password · Token-based session (JWT) · Sign out · Redirect to sign-in for protected pages | High |
| FR-3 | Role-based access | Guest, staff and admin roles · Server blocks actions the role is not allowed to perform | High |
| FR-4 | Browse and search rooms | Filter by dates, guests, room type and max price · Hide rooms in maintenance · Exclude rooms already booked for the dates | High |
| FR-5 | Check availability | Per-room check for chosen dates · Show conflicting date ranges · Show all upcoming booked ranges | High |
| FR-6 | Create booking | Dates and guest count validated · Capacity enforced · Total price calculated by server · Status starts as pending | High |
| FR-7 | Prevent double booking | Overlap detection · Race-condition guard when two guests book simultaneously | High |
| FR-8 | View bookings | Guests see their own bookings · Staff and admins see all bookings with guest details | High |
| FR-9 | Modify or cancel booking | Owner, staff or admin can cancel · Dates and guests can be changed with re-validation and price recalculation | Medium |
| FR-10 | Confirm booking | Staff and admins confirm pending bookings | High |
| FR-11 | Check-in and check-out | Only confirmed bookings can be checked in · Only checked-in guests can be checked out · Room status updates automatically | High |
| FR-12 | Staff dashboard | Status counts · Total booked value · Filter by status | Medium |
| FR-13 | Room management | Admin creates, updates and deletes rooms · Set room to maintenance | Medium |
| FR-14 | Live updates | Availability on the booking page and the room list refresh automatically when a booking changes | Medium |

## Non-functional requirements

| NFR No. | Requirement | Description |
|---------|-------------|-------------|
| NFR-1 | Usability | Responsive Bootstrap interface that works on phones and desktops · Clear error messages · Loading indicators · Accessible labels and live regions for status messages |
| NFR-2 | Security | Passwords hashed with bcrypt · JWT authentication · Server-side authorization on every protected route · Helmet security headers · CORS limited to the client origin |
| NFR-3 | Data integrity | Server-calculated prices · Schema validation · Unique emails and room numbers · No overlapping active bookings for a room |
| NFR-4 | Reliability | Central error handler returns clean JSON errors · Server exits with a clear message if the database is unreachable |
| NFR-5 | Performance | Database indexes on room type and price, and on room and dates for overlap checks · Paginated room API · Debounced availability requests (350 ms) |
| NFR-6 | Real-time behaviour | Updates reach connected clients through WebSockets with polling fallback · Socket messages carry no personal data |
| NFR-7 | Maintainability | Separate client and server · Routes, models, middleware and utilities in their own modules · Environment-based configuration |
| NFR-8 | Portability | Runs on any platform with Node.js and MongoDB · Frontend deployable to static hosting |
| NFR-9 | Scalability | Stateless API (JWT) so multiple instances can run · Socket.IO would need a shared adapter for multi-instance scaling |

## Constraints and assumptions

- One hotel per deployment.
- Prices are in Indian rupees (₹).
- Payments are not handled in the current version.
- Staff and admin accounts are created by an administrator (seed script or database), not through public sign-up.
