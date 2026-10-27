# 7. User Guide

## For guests

### Create an account
1. Click **Create account** in the top bar.
2. Enter your name, email, password (at least 6 characters) and optional phone number.
3. You are signed in automatically.

### Find a room
1. On the home page, pick **check-in** and **check-out** dates, or leave both empty to see every room.
2. Optionally set the number of guests, a room type, and a maximum price.
3. Click **Search rooms**. Only rooms that are free for all of your nights are shown.

Each card shows the room number, type, capacity, a few amenities and the price per night.

### Book a room
1. Click **Book this room**. Your dates and guest count carry over. (You will be asked to sign in first if you are signed out.)
2. Choose or adjust dates. A banner tells you instantly whether the room is **available**, or lists the dates that clash. The **Already booked** list shows every upcoming blocked range.
3. The total price is calculated from the number of nights.
4. Click book. The booking starts as **pending** until the hotel confirms it.

If someone else books the room first, the banner updates automatically and you will be told the room is no longer available.

### Manage your bookings
Open **My bookings**. You can filter by status and cancel a booking while it is **pending** or **confirmed**.

## For staff

Sign in and open **Dashboard**.

- The top cards show counts of pending, confirmed and checked-in bookings, and the total booked value (cancelled bookings are excluded).
- Filter the table by status.
- Each row shows the guest's name and email, the room, dates, guests, total and status.

**Daily workflow**

| Booking status | Button | Result |
|----------------|--------|--------|
| Pending | **Confirm** | Becomes confirmed |
| Confirmed | **Check in** | Guest checked in, room marked occupied |
| Checked in | **Check out** | Guest checked out, room becomes available |
| Pending or confirmed | **Cancel** | Booking cancelled (asks for confirmation) |

A booking can only be checked in after it has been confirmed.

## For admins

Admins have the staff dashboard plus room management through the API (create, update, delete rooms). There is no room management screen yet, so use a tool such as curl or Postman. See [05-api-reference.md](05-api-reference.md#rooms).

Put a room into maintenance by updating its status:

```bash
curl -X PUT http://localhost:5000/api/rooms/ROOM_ID \
  -H "Authorization: Bearer ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d '{"status":"maintenance"}'
```

Rooms in maintenance disappear from search and cannot be booked.

## Creating staff and admin accounts

Public registration always creates **guest** accounts. Staff and admin accounts come from the seed script, or by changing a user's `role` directly in MongoDB:

```js
db.users.updateOne({ email: "someone@example.com" }, { $set: { role: "staff" } })
```
