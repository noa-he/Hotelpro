# Define the Problem Statements

**Project:** HotelPro: Hotel Management Web Application
**Phase:** Ideation

## Customer problem statements

Each statement follows the template: *I am … / I'm trying to … / but … / because … / which makes me feel …*

| ID | I am | I'm trying to | But | Because | Which makes me feel |
|----|------|---------------|-----|---------|---------------------|
| PS-1 | A traveller planning a stay | Find a room for my dates and book it quickly | I cannot tell which rooms are actually free without phoning the hotel | The hotel has no online view of availability | Frustrated and unsure whether my booking is safe |
| PS-2 | A guest with a booking | Change dates or cancel my reservation | I have to call during office hours and wait for someone to update a register | Bookings live on paper or in a spreadsheet | Powerless and anxious about fees or mistakes |
| PS-3 | A front-desk staff member | Confirm bookings and check guests in and out | I have to search through registers to find who is arriving and which rooms are free | There is no single list of bookings with their status | Rushed and worried about making errors |
| PS-4 | A hotel manager or admin | Keep room inventory accurate and avoid double bookings | Two staff members can promise the same room to different guests | Availability is checked by hand and not in real time | Stressed and concerned about lost revenue and unhappy guests |

## Problem statement summary

> Hotels that rely on manual booking records suffer from **double bookings, slow service and poor visibility**. Guests cannot self-serve, and staff cannot see the true state of every room at a glance.

## Pain points addressed by HotelPro

| Pain point | HotelPro response |
|------------|-------------------|
| Guests cannot see availability | Public room search by dates with live "available / not available" feedback |
| Double bookings | Overlap check on every booking plus a race-condition guard |
| Manual price errors | Price is always calculated by the server |
| Slow edits and cancellations | Guests cancel from their own dashboard |
| No view of daily operations | Staff dashboard with status filters and counts |
| Anyone can change anything | Role-based access: guest, staff, admin |
| Stale screens | Live updates over WebSockets when a room is booked or cancelled |
