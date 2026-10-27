# Project Planning

**Project:** HotelPro: Hotel Management Web Application
**Phase:** Project Planning

> Story points are the team's relative effort estimates. Sprint dates are left for you to fill in with your real calendar.

## Product backlog and sprint schedule

| Sprint | Functional requirement | User story | Story points | Priority | Status |
|--------|------------------------|-----------|--------------|----------|--------|
| Sprint-1 | Registration (FR-1) | USN-1 Register an account | 2 | High | Completed |
| Sprint-1 | Authentication (FR-2, FR-3) | USN-2 Sign in and out, role-based access | 3 | High | Completed |
| Sprint-1 | Room search (FR-4) | USN-3 Search rooms with filters | 5 | High | Completed |
| Sprint-2 | Availability (FR-5) | USN-4 See if a room is free for my dates | 5 | High | Completed |
| Sprint-2 | Create booking (FR-6, FR-7) | USN-5 Book a room with server-side price and double-booking guard | 8 | High | Completed |
| Sprint-2 | Room management API (FR-13) | USN-11 Admin creates, edits, deletes rooms | 3 | Medium | Completed |
| Sprint-3 | View and cancel (FR-8, FR-9) | USN-6 View and cancel my bookings | 5 | High | Completed |
| Sprint-3 | Live updates (FR-14) | USN-7 Availability updates without refresh | 5 | Medium | Completed |
| Sprint-3 | Staff dashboard (FR-10, FR-11, FR-12) | USN-8, 9, 10 View all bookings, confirm, check in and out | 8 | High | Completed |
| Sprint-4 | UI theme | USN-12 Responsive, colourful interface | 3 | Medium | Completed |
| Sprint-4 | Deployment | Deploy frontend to Vercel, add SPA rewrite | 2 | Medium | Completed |
| Sprint-4 | Documentation | Technical and phase-wise documentation | 3 | Medium | Completed |
| Backlog | Admin room screen | USN-13 Manage rooms from the UI | 5 | Medium | Planned |
| Backlog | Payments | USN-14 Pay online | 13 | High | Planned |

## Sprint planning summary

| Sprint | Total story points | Duration | Start date | End date (planned) | Points completed | Release date |
|--------|--------------------|----------|------------|--------------------|------------------|--------------|
| Sprint-1 | 10 | [x] days | [date] | [date] | 10 | [date] |
| Sprint-2 | 16 | [x] days | [date] | [date] | 16 | [date] |
| Sprint-3 | 18 | [x] days | [date] | [date] | 18 | [date] |
| Sprint-4 | 8 | [x] days | [date] | [date] | 8 | [date] |

## Velocity

Average velocity = total points completed ÷ number of sprints = 52 ÷ 4 = **13 story points per sprint**.

## Burndown overview

| After sprint | Points remaining (of 52 planned) |
|--------------|----------------------------------|
| Start | 52 |
| Sprint-1 | 42 |
| Sprint-2 | 26 |
| Sprint-3 | 8 |
| Sprint-4 | 0 |

## Milestones

| Milestone | Deliverable |
|-----------|-------------|
| M1: Foundation | Accounts, roles, room search |
| M2: Booking core | Availability, booking, double-booking protection |
| M3: Operations | Staff dashboard, live updates |
| M4: Release | Theme, deployment, documentation |

## Risks and mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Two guests book the same room at once | Double booking | Overlap check plus race guard with deterministic winner |
| Stale availability on screen | Failed booking attempts | WebSocket updates plus a server check at submit time |
| Weak secrets or demo passwords reach production | Security breach | Security checklist, `.env` kept out of git |
| Scope creep (payments, reports) | Delay | Moved to backlog and tracked in the roadmap |
