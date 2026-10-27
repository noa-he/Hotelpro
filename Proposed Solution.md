# Proposed Solution

**Project:** HotelPro: Hotel Management Web Application
**Phase:** Project Design

| S.No | Parameter | Description |
|------|-----------|-------------|
| 1 | **Problem statement (problem to be solved)** | Hotels that manage bookings by phone, paper or spreadsheets face double bookings, slow service and no live view of room availability. Guests cannot self-serve. |
| 2 | **Idea / solution description** | A full-stack web application where guests search rooms by dates, guests, type and price, see live availability, and book. Staff confirm bookings and handle check-in and check-out from a dashboard. Admins manage rooms. Access is controlled by roles. |
| 3 | **Novelty / uniqueness** | Live availability pushed to every viewer over WebSockets · A two-layer double-booking defence (overlap check plus race guard) · Server-calculated pricing · Privacy-friendly availability data (dates only, no guest details) · A single lightweight system for guests, staff and admins |
| 4 | **Social impact / customer satisfaction** | Guests get transparency and control and spend less time on the phone. Staff make fewer errors and save time. Small hotels get tools usually reserved for large chains. |
| 5 | **Business model (revenue model)** | Subscription per property · One-time setup and customisation fee · Optional paid add-ons such as payment integration, notifications and reporting · Support plans |
| 6 | **Scalability of the solution** | Stateless REST API, so more instances can be added behind a load balancer · Indexed queries for availability · Separate frontend that deploys to a CDN · Multi-property support and a Socket.IO adapter are the next scaling steps |

## Key features at a glance

- Room search with filters
- Live availability with conflict dates
- Booking with automatic total price
- Guest, staff and admin roles
- Staff dashboard with confirm, check-in, check-out and cancel
- Real-time updates
- Responsive, colour-themed interface

## Out of scope in this version

Online payments, notifications, room photo display, reports and an admin room-management screen. See the [roadmap](../Technical%20Documentation/11-limitations-and-roadmap.md).
