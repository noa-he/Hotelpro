# Brainstorm & Idea Prioritization

**Project:** HotelPro: Hotel Management Web Application
**Phase:** Ideation

## Step 1: Define the problem

Small and mid-sized hotels often manage bookings with phone calls, paper registers and spreadsheets. This causes double bookings, slow check-ins, and guests who cannot see which rooms are free. **How might we let guests book rooms online with confidence, while giving staff one place to run the day?**

## Step 2: Brainstorm ideas

Every idea the team could think of, without filtering:

| Area | Ideas |
|------|-------|
| Guest booking | Search by dates, guests, type and price · Instant availability check · Show which dates are already taken · Booking confirmation · Edit or cancel a booking |
| Accounts | Sign-up and sign-in · Roles for guest, staff and admin · Password reset by email · Social login |
| Front desk | Dashboard of all bookings · Confirm, check in and check out buttons · Filter by status · Daily arrivals list |
| Admin | Add, edit and delete rooms · Put a room into maintenance · Revenue reports · Staff management |
| Trust and safety | Prevent double booking · Server-calculated prices · Secure password storage |
| Experience | Live availability updates · Mobile-friendly layout · Colour-coded room types · Room photo gallery |
| Payments and comms | Online payment · Refunds · Email or SMS confirmations · Loyalty points |
| Growth | Multi-hotel support · Reviews and ratings · Dynamic pricing · Channel-manager integration |

## Step 3: Group the ideas

1. **Booking engine:** search, availability, booking, edit and cancel
2. **Access control:** accounts and roles
3. **Operations:** staff dashboard and the check-in and check-out flow
4. **Inventory:** room management
5. **Reliability:** double-booking protection and live updates
6. **Engagement and revenue:** payments, notifications, reviews, pricing

## Step 4: Prioritise

Each idea is scored for **Impact** (value to guests and hotel) and **Effort** (build cost) on a Low / Medium / High scale.

| Idea | Impact | Effort | Decision |
|------|--------|--------|----------|
| Room search with filters | High | Low | **Build now** |
| Availability check with overlap detection | High | Medium | **Build now** |
| Booking create, edit and cancel | High | Medium | **Build now** |
| Roles: guest, staff, admin | High | Medium | **Build now** |
| Staff dashboard with check-in and check-out | High | Medium | **Build now** |
| Double-booking protection | High | Medium | **Build now** |
| Live availability updates (WebSockets) | Medium | Medium | **Build now** |
| Colour-themed responsive UI | Medium | Low | **Build now** |
| Admin room-management screen | Medium | Medium | Next release |
| Online payments | High | High | Next release |
| Email and SMS notifications | Medium | Medium | Next release |
| Room photo gallery | Medium | Medium | Next release |
| Reports and analytics | Medium | High | Later |
| Reviews and ratings | Low | Medium | Later |
| Multi-hotel support, dynamic pricing | Medium | High | Later |

### Priority matrix

|  | **Low effort** | **Medium effort** | **High effort** |
|--|----------------|-------------------|-----------------|
| **High impact** | Room search | Booking, availability, roles, dashboard, double-booking guard | Online payments |
| **Medium impact** | Colour theme | Live updates, admin screen, notifications, photos | Reports, dynamic pricing |
| **Low impact** | | Reviews | |

## Outcome

The first release (MVP) delivers everything marked **Build now**. It forms a complete booking life cycle from search to check-out. Items in **Next release** and **Later** are tracked in [11-limitations-and-roadmap](../Technical%20Documentation/11-limitations-and-roadmap.md).
