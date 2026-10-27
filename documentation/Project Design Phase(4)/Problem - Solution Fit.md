# Problem-Solution Fit

**Project:** HotelPro: Hotel Management Web Application
**Phase:** Project Design

## Purpose

Show that the solution fits a real problem for real users, and understand what influences their behaviour.

## Fit canvas

| Block | Content |
|-------|---------|
| **1. Customer segments** | Independent hotels and guest houses · Their front-desk staff and managers · Guests who book directly |
| **2. Jobs to be done and problems** | Guests: find a free room and book it with confidence · Staff: run arrivals and departures · Managers: avoid double bookings and keep inventory correct |
| **3. Triggers to act** | A double booking or lost reservation · Guests asking for online booking · Growth that outpaces paper registers |
| **4. Emotions before** | Anxious, rushed, frustrated, distrustful of manual records |
| **5. Emotions after** | Confident, in control, relieved |
| **6. Available solutions** | Phone and walk-in bookings · Spreadsheets · Expensive enterprise or third-party platforms with commission |
| **7. Behaviour and customer constraints** | Limited budget · Low technical skill · Need something simple that works on a phone |
| **8. Channels of behaviour (online)** | Search on the web, book on a phone, check status in the account area |
| **9. Channels of behaviour (offline)** | Phone calls, front-desk conversations, paper registers |
| **10. Your solution** | A web app with live availability, double-booking protection, role-based dashboards and one-click check-in and check-out |

## Fit analysis

| Problem | Solution feature | Fit |
|---------|------------------|-----|
| Cannot see availability | Live availability banner and booked-dates list | Strong |
| Double bookings | Overlap detection and race guard | Strong |
| Manual staff workload | Dashboard with status buttons | Strong |
| Price mistakes | Server-calculated totals | Strong |
| Need to phone to change booking | Self-service cancellation | Good (date changes available through API) |
| Online payment expectation | Not built yet | Gap, planned |

## Validation ideas

- Run a short pilot with one small hotel and compare booking errors before and after.
- Time how long a staff member needs to check a guest in, using the register versus the dashboard.
- Collect guest feedback on how quickly they could find and book a room.
