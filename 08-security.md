# 8. Security

## What is in place

| Area | Implementation |
|------|----------------|
| Password storage | bcrypt hashes (10 rounds). Plain passwords are never stored. |
| Password exposure | `password` is excluded from queries by default (`select: false`) |
| Sessions | Stateless JWT, signed with `JWT_SECRET`, expiry from `JWT_EXPIRES_IN` |
| Authorization | `protect` plus `authorize(roles)` enforced on the server for every protected route |
| Privilege escalation | Public registration hard-codes `role: 'guest'` |
| Ownership checks | Guests can only edit or cancel their own bookings |
| Price integrity | `totalPrice` always computed on the server |
| Data minimisation | Availability endpoints and socket events expose dates only, never guest identity |
| HTTP headers | `helmet` defaults |
| CORS | Limited to the single origin in `CLIENT_URL` |
| Invalid input | Mongoose validation, plus a central error handler that returns clean messages |
| Error wording | Login returns the same message whether the email or the password is wrong |

## Before going to production

1. **Set a long random `JWT_SECRET`.** Never keep the example value.
2. **Remove or change the demo accounts** (`admin123`, `staff123`, `guest123`). Do not run `npm run seed` against production data, because it deletes all users and rooms.
3. **Use HTTPS** for both the client and the API.
4. **Set `CLIENT_URL`** to your real frontend URL.
5. **Keep `.env` out of git.** `.gitignore` already excludes it.
6. **Add rate limiting** on `/api/auth/*` (for example `express-rate-limit`) to slow brute-force attempts.
7. **Restrict database access** with a MongoDB user and network rules.

## Known security trade-offs

- The JWT is stored in `localStorage`. This is simple, but any cross-site scripting bug could read it. React escapes output by default, which lowers the risk. HttpOnly cookies are a stronger alternative.
- There are no refresh tokens or logout-everywhere. A token stays valid until it expires.
- `PUT /api/rooms/:id` and `POST /api/rooms` pass the request body straight to Mongoose. Only admins can call them, but a field whitelist would be safer.
- Socket connections are not authenticated. This is acceptable because only room ids and "something changed" signals are sent.
- The double-booking race guard works without database transactions. It is reliable for normal traffic, but a unique constraint or a transaction would be the strictest option.
