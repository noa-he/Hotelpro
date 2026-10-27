# Performance and Functional Testing

**Project:** HotelPro: Hotel Management Web Application
**Phase:** Performance Testing

> The test cases and expected results below come from the application's code. The **Actual result** and **Status** columns are left for you to fill in after you run each test. Do not submit them as "Pass" until you have executed them.

## 1. Objectives

- Confirm every core feature behaves as specified.
- Confirm double-booking protection holds under simultaneous requests.
- Measure API response time and throughput for the most used endpoints.
- Confirm the interface loads quickly and works on mobile.

## 2. Test environment

| Item | Value |
|------|-------|
| Backend | Node.js 18+, Express, `npm run dev` or `npm start` |
| Database | MongoDB (local or Atlas), seeded with `npm run seed` |
| Frontend | Vite dev server or production build |
| Browser | Latest Chrome |
| Tools | Browser DevTools, Postman or curl, autocannon or k6, Lighthouse |
| Test accounts | `guest@hotelpro.com`, `staff@hotelpro.com`, `admin@hotelpro.com` (see [setup](../Technical%20Documentation/02-setup.md#demo-accounts)) |

## 3. Functional test cases

| TC ID | Feature | Steps | Expected result | Actual result | Status |
|-------|---------|-------|-----------------|---------------|--------|
| TC-01 | Register | Submit valid name, email, password | Account created, user signed in as guest | | |
| TC-02 | Register: duplicate email | Register with an existing email | Error "Email already registered" | | |
| TC-03 | Register: short password | Use a 5-character password | Error "Password must be at least 6 characters" | | |
| TC-04 | Login: valid | Sign in as `guest@hotelpro.com` | Signed in, token stored, navbar shows name | | |
| TC-05 | Login: invalid | Wrong password | Error "Invalid email or password" | | |
| TC-06 | Protected route | Open `/dashboard` while signed out | Redirect to `/login` | | |
| TC-07 | Room search: filters | Filter by type "suite" | Only suites listed | | |
| TC-08 | Room search: dates | Search dates that overlap an existing booking | That room is not listed | | |
| TC-09 | Room search: price | Max price 3000 | Only rooms at or below ₹3,000 | | |
| TC-10 | Date validation | Check-out earlier than check-in | Error message, no search | | |
| TC-11 | Availability banner | Choose free dates on booking page | "Available for these dates" | | |
| TC-12 | Availability banner: conflict | Choose booked dates | "Not available" with clashing dates listed | | |
| TC-13 | Create booking | Book a free room for 3 nights | Booking created as pending, total = 3 × price | | |
| TC-14 | Capacity | Book with more guests than capacity | Error "This room sleeps N guests at most" | | |
| TC-15 | Double booking | Book a room for dates already taken | HTTP 409 "Room is already booked" | | |
| TC-16 | Back-to-back stay | Book check-in on another booking's check-out date | Booking allowed | | |
| TC-17 | Price tampering | Send `totalPrice` in the POST body | Value ignored, server price used | | |
| TC-18 | My bookings | Open dashboard as guest | Only own bookings shown | | |
| TC-19 | Cancel | Cancel a pending booking | Status cancelled, dates become free again | | |
| TC-20 | Guest permissions | As guest, call `GET /api/bookings` | HTTP 403 | | |
| TC-21 | Guest cannot edit others | Guest A edits Guest B's booking | HTTP 403 | | |
| TC-22 | Confirm | Staff confirms a pending booking | Status confirmed | | |
| TC-23 | Check-in rule | Staff checks in a pending booking | HTTP 400 "Only confirmed bookings can be checked in" | | |
| TC-24 | Check-in | Staff checks in a confirmed booking | Status checked-in, room occupied | | |
| TC-25 | Check-out | Staff checks out | Status checked-out, room available | | |
| TC-26 | Edit finished booking | Cancel a checked-out booking | HTTP 400 "Booking is already checked-out" | | |
| TC-27 | Admin rooms | Admin creates, updates, deletes a room via API | Changes saved | | |
| TC-28 | Room admin permission | Staff calls `POST /api/rooms` | HTTP 403 | | |
| TC-29 | Maintenance | Set a room to maintenance | Hidden from search, cannot be booked | | |
| TC-30 | Live update | Two browsers on the same room, book in one | Second browser's banner updates without refresh | | |
| TC-31 | Invalid id | `GET /api/rooms/abc` | HTTP 400 "Invalid id" | | |
| TC-32 | Expired token | Use an expired or altered token | HTTP 401 | | |
| TC-33 | Responsive layout | Open at 375 px width | Navbar collapses, no horizontal scroll | | |

## 4. Concurrency test (double booking)

**Goal:** prove that two simultaneous requests for the same room and dates produce one booking.

1. Choose a free room and dates.
2. Fire two or more identical `POST /api/bookings` requests at the same moment (for example with a script or `Promise.all`).
3. **Expected:** exactly one `201`, the others `409`. Only one booking exists in the database for that room and dates.

| Attempts | Expected successes | Actual successes | Result |
|----------|--------------------|------------------|--------|
| 2 | 1 | | |
| 10 | 1 | | |

## 5. Performance (API load) test plan

Run against a seeded database. Replace `TOKEN` and `ROOM_ID`.

```bash
# Room search (public)
npx autocannon -c 20 -d 20 http://localhost:5000/api/rooms

# Availability check (public)
npx autocannon -c 20 -d 20 "http://localhost:5000/api/rooms/ROOM_ID/availability?checkIn=2026-12-01&checkOut=2026-12-04"

# My bookings (authenticated)
npx autocannon -c 20 -d 20 -H "Authorization=Bearer TOKEN" http://localhost:5000/api/bookings/my
```

| Endpoint | Concurrency | Duration | Avg latency (ms) | p95 latency (ms) | Requests/sec | Errors |
|----------|-------------|----------|------------------|------------------|--------------|--------|
| `GET /api/rooms` | 20 | 20 s | | | | |
| `GET /api/rooms/:id/availability` | 20 | 20 s | | | | |
| `GET /api/bookings/my` | 20 | 20 s | | | | |
| `GET /api/bookings` (staff) | 20 | 20 s | | | | |
| `POST /api/auth/login` | 5 | 20 s | | | | |

Suggested targets (adjust to your needs): average under 200 ms, p95 under 500 ms, error rate 0%.

Note: login is intentionally slower because bcrypt hashing is CPU-heavy by design.

## 6. Frontend performance

| Check | How | Result |
|-------|-----|--------|
| Lighthouse Performance score | Chrome DevTools, mobile mode, on the production build | |
| Lighthouse Accessibility score | Same run | |
| First Contentful Paint | Lighthouse report | |
| Largest Contentful Paint | Lighthouse report | |
| Bundle size | `npm run build` output | |

## 7. Design features that support performance

| Feature | Benefit |
|---------|---------|
| Index on `{room, checkIn, checkOut}` | Fast overlap checks |
| Index on `{type, pricePerNight}` | Fast filtered room lists |
| Pagination in the rooms API | Bounded response size |
| 350 ms debounce on availability checks | Fewer API calls while typing dates |
| Latest-request guard in `useAvailability` | Avoids wasted renders from stale responses |
| Socket events carry only ids | Tiny messages, clients fetch what they need |

## 8. Observations and conclusion

Fill in after testing: number of tests passed, slowest endpoint, any defects found, fixes applied, and overall conclusion.

| Metric | Value |
|--------|-------|
| Functional tests executed | / 33 |
| Passed | |
| Failed | |
| Defects fixed | |
