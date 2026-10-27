# 11. Limitations and Roadmap

This page lists what HotelPro does not do yet, based on the current code. It is meant to be honest documentation for graders, teammates and future contributors.

## Known limitations

**Features**
- No screen for admins to add, edit or delete rooms. These actions exist only in the API.
- Guests cannot change their booking dates from the UI. The API supports it (`PUT /api/bookings/:id`), but the dashboard only offers cancel.
- `paymentStatus` exists, but no payment flow does. Bookings stay `unpaid`, and the `paid` and `refunded` states are never reached in practice.
- Room `images` are stored but not displayed.
- No password reset, email verification or email notifications.
- The room list does not paginate in the UI. The API supports `page` and `limit` (default 12 per page), so a hotel with more than 12 rooms would not see them all.

**Validation**
- The server does not reject check-in dates in the past. Only the browser's date picker limits that.
- Changing the dates of a confirmed booking keeps it confirmed.
- Deleting a room leaves its bookings behind, and the dashboard shows "Removed".
- Dates are treated as UTC midnight, so hotels in other time zones may see off-by-one display issues near midnight.

**Quality**
- No automated tests.
- No rate limiting on login or register.
- The race guard against double booking is best-effort without transactions (see [03-architecture.md](03-architecture.md#double-booking-protection)).

## Suggested roadmap

| Priority | Item |
|----------|------|
| High | Admin room management page (create, edit, maintenance toggle, delete) |
| High | Reject past dates on the server |
| High | Rate limiting on auth routes |
| Medium | Edit dates and guests from the dashboard |
| Medium | Payment integration (for example Razorpay or Stripe) that moves `paymentStatus` to `paid` |
| Medium | Room photo upload and gallery |
| Medium | Pagination controls on the room list |
| Medium | Automated tests (Jest and Supertest for the API, React Testing Library for components) |
| Low | Email confirmation and reminders |
| Low | Reports: occupancy rate and revenue by month |
| Low | Admin user management screen (promote guests to staff) |
| Low | Move the JWT to an HttpOnly cookie |
