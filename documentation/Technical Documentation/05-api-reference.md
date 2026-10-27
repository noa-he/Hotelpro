# 5. API Reference

Base URL (local): `http://localhost:5000/api`

All request and response bodies are JSON. Errors always look like:

```json
{ "message": "Human readable explanation" }
```

## Authentication

Protected endpoints need a JWT in the header:

```
Authorization: Bearer <token>
```

Tokens come from `/auth/register` and `/auth/login` and expire after `JWT_EXPIRES_IN` (default 7 days).

## Roles

| Role | Can do |
|------|--------|
| `guest` | Browse rooms, book, view, edit and cancel **own** bookings |
| `staff` | Everything a guest can, plus list all bookings, confirm, check in, check out, and edit or cancel any booking |
| `admin` | Everything staff can, plus create, update and delete rooms |

## Common status codes

| Code | Meaning |
|------|---------|
| 200 / 201 | Success / created |
| 400 | Validation problem or invalid id |
| 401 | Missing, invalid or expired token, or wrong credentials |
| 403 | Signed in but not allowed |
| 404 | Resource not found |
| 409 | Booking conflict (dates already taken) |
| 500 | Server error |

---

## Health

### `GET /api/health`
Public. Returns `{ "ok": true }`.

---

## Auth

### `POST /api/auth/register`
Public. Creates a **guest** account (the role cannot be chosen by the caller).

| Body field | Required | Notes |
|------------|----------|-------|
| `name` | yes | |
| `email` | yes | Must not already exist |
| `password` | yes | At least 6 characters |
| `phone` | no | |

**201 response**

```json
{ "_id": "665f...", "name": "Asha", "email": "asha@example.com", "role": "guest", "token": "eyJ..." }
```

Errors: 400 for missing fields, short password, or `Email already registered`.

### `POST /api/auth/login`
Public.

| Body field | Required |
|------------|----------|
| `email` | yes |
| `password` | yes |

Returns the same shape as register. Errors: 400 for missing fields, 401 `Invalid email or password`.

### `GET /api/auth/me`
Requires a token. Returns the current user document (without the password).

---

## Rooms

### `GET /api/rooms`
Public. Lists rooms, cheapest first. Rooms under maintenance are excluded.

| Query param | Description |
|-------------|-------------|
| `type` | `single`, `double`, `deluxe` or `suite` |
| `guests` | Minimum capacity |
| `minPrice`, `maxPrice` | Price per night range |
| `checkIn`, `checkOut` | Only rooms with **no** active booking overlapping these dates (send both) |
| `page` | Default 1 |
| `limit` | Default 12 |

**Response**

```json
{ "rooms": [ { "_id": "...", "roomNumber": "101", "type": "single", "pricePerNight": 1800, "capacity": 1, "amenities": ["WiFi","AC","TV"], "status": "available" } ],
  "total": 12, "page": 1, "pages": 1 }
```

> The web client does not send `page` or `limit`, so it shows the first 12 rooms. See [limitations](11-limitations-and-roadmap.md).

### `GET /api/rooms/:id`
Public. Returns one room. 404 if not found.

### `GET /api/rooms/:id/availability`
Public. Without dates, returns upcoming booked ranges. With both dates, also reports whether the stay is possible.

| Query param | Format |
|-------------|--------|
| `checkIn` | `YYYY-MM-DD` |
| `checkOut` | `YYYY-MM-DD`, must be after check-in |

**Response (with dates)**

```json
{
  "roomId": "665f...",
  "available": false,
  "reason": "booked",
  "conflicts":    [ { "checkIn": "2026-11-02T00:00:00.000Z", "checkOut": "2026-11-05T00:00:00.000Z" } ],
  "bookedRanges": [ { "checkIn": "2026-11-02T00:00:00.000Z", "checkOut": "2026-11-05T00:00:00.000Z" } ]
}
```

`reason` is `"booked"`, `"maintenance"`, or `null` when available. Only date ranges are returned, never guest details. Errors: 400 for invalid dates, 404 for unknown room.

### `POST /api/rooms`  (admin)
Creates a room. Body fields match the [Room model](04-database.md#room). Returns 201 with the new room.

### `PUT /api/rooms/:id`  (admin)
Updates a room with the fields sent. Validators run. 404 if not found.

### `DELETE /api/rooms/:id`  (admin)
Deletes a room. Returns `{ "message": "Room deleted" }`. Existing bookings are not removed.

---

## Bookings

All booking routes require a token.

### `POST /api/bookings`
Creates a booking with status `pending`.

| Body field | Required | Notes |
|------------|----------|-------|
| `room` | yes | Room id |
| `checkIn` | yes | Date |
| `checkOut` | yes | Must be after `checkIn` |
| `guests` | yes | Must not exceed the room's capacity |

`totalPrice` is calculated by the server. Any price sent by the client is ignored.

Errors: 400 (missing fields, bad dates, too many guests), 404 (`Room not available` for unknown or maintenance rooms), **409** (`Room is already booked for those dates`, or `Someone just booked this room for those dates` when the race guard triggers).

### `GET /api/bookings/my`
Returns the signed-in user's bookings with room details, newest first.

### `GET /api/bookings`  (staff, admin)
Returns all bookings with room details and user `name`, `email`, `phone`, newest first. Optional filter: `?status=pending`.

### `PUT /api/bookings/:id`
Cancel, confirm, or change a booking.

**Who:** the booking's owner, staff or admin. Other guests get 403.
**When:** not allowed once the booking is `checked-in`, `checked-out` or `cancelled` (400).

| Body field | Effect |
|------------|--------|
| `status: "cancelled"` | Cancels. A `paid` booking becomes `refunded`. |
| `status: "confirmed"` | Confirms. **Staff/admin only.** Ignored for guests. |
| `checkIn`, `checkOut`, `guests` | Changes the stay. Availability is re-checked (ignoring this booking itself) and `totalPrice` is recalculated. |

Errors: 400 (bad dates, too many guests), 403, 404, 409 (new dates unavailable).

### `PUT /api/bookings/:id/checkin`  (staff, admin)
Only for `confirmed` bookings (otherwise 400). Sets status to `checked-in` and the room to `occupied`.

### `PUT /api/bookings/:id/checkout`  (staff, admin)
Only for `checked-in` bookings (otherwise 400). Sets status to `checked-out` and the room to `available`.

---

## Endpoint summary

| Method | Path | Access |
|--------|------|--------|
| GET | `/api/health` | Public |
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Signed in |
| GET | `/api/rooms` | Public |
| GET | `/api/rooms/:id` | Public |
| GET | `/api/rooms/:id/availability` | Public |
| POST | `/api/rooms` | Admin |
| PUT | `/api/rooms/:id` | Admin |
| DELETE | `/api/rooms/:id` | Admin |
| POST | `/api/bookings` | Signed in |
| GET | `/api/bookings/my` | Signed in |
| GET | `/api/bookings` | Staff, admin |
| PUT | `/api/bookings/:id` | Owner, staff, admin |
| PUT | `/api/bookings/:id/checkin` | Staff, admin |
| PUT | `/api/bookings/:id/checkout` | Staff, admin |

## Example: curl

```bash
# Sign in
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"guest@hotelpro.com","password":"guest123"}'

# Book a room (replace TOKEN and ROOM_ID)
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" \
  -d '{"room":"ROOM_ID","checkIn":"2026-12-01","checkOut":"2026-12-04","guests":2}'
```
