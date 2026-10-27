# Solution Architecture

**Project:** HotelPro: Hotel Management Web Application
**Phase:** Project Design

## Goals

- Bridge the business problem (double bookings, no live availability) and the technical solution.
- Describe structure, components, data flow and deployment.
- Provide a reference for developers, testers and evaluators.

## Architecture diagram

```mermaid
flowchart TB
    subgraph Client["Client: React SPA (Vercel)"]
        UI[Pages: Rooms, Booking, Dashboard, Login]
        CTX[AuthContext + ProtectedRoute]
        HOOK[useAvailability hook]
        AX[Axios service]
        SC[Socket.IO client]
        UI --> CTX
        UI --> HOOK
        HOOK --> AX
        HOOK --> SC
    end

    subgraph Server["Server: Node.js + Express"]
        MW[helmet, cors, JSON, morgan]
        AUTH[auth middleware: protect / authorize]
        R1[/api/auth/]
        R2[/api/rooms/]
        R3[/api/bookings/]
        UT[availability utilities]
        IO[Socket.IO server]
        MW --> AUTH
        AUTH --> R1
        AUTH --> R2
        AUTH --> R3
        R2 --> UT
        R3 --> UT
        R3 --> IO
    end

    DB[(MongoDB<br/>Users, Rooms, Bookings)]

    AX -- "HTTPS / JSON + JWT" --> MW
    SC -- "WebSocket" --> IO
    R1 --> DB
    R2 --> DB
    R3 --> DB
    UT --> DB
```

## Layers and responsibilities

| Layer | Responsibility | Key files |
|-------|----------------|-----------|
| Presentation | Pages, forms, routing, theme | `client/src/components`, `theme.css` |
| Client state and services | Login state, API calls, sockets, availability logic | `AuthContext.jsx`, `services/`, `hooks/useAvailability.js` |
| API | Routing, validation, business rules, error handling | `server/routes`, `server/server.js` |
| Security | JWT verification, role checks | `server/middleware/auth.js` |
| Domain logic | Overlap detection and availability | `server/utils/availability.js` |
| Real time | Rooms and watchers, availability events | `server/socket.js` |
| Data | Schemas, indexes, hashing hooks | `server/models` |

## Key flow: booking a room

```mermaid
sequenceDiagram
    participant G as Guest browser
    participant API as Express API
    participant DB as MongoDB
    participant IO as Socket.IO
    participant O as Other viewers
    G->>API: GET /rooms/:id/availability?dates
    API->>DB: Find overlapping active bookings
    API-->>G: available true/false + booked ranges
    G->>API: POST /bookings (JWT)
    API->>DB: Check room, capacity, overlap
    API->>DB: Create booking (price from server)
    API->>DB: Race guard: older overlapping booking?
    API->>IO: emitAvailability(roomId)
    IO-->>O: availability:changed
    API-->>G: 201 booking (pending)
```

## Deployment view

| Part | Where | Notes |
|------|-------|-------|
| Frontend (static build) | Vercel | `vercel.json` rewrites all paths to `index.html` for client-side routing |
| Backend (Node process) | Any host that keeps a process running | Must support WebSockets |
| Database | MongoDB Atlas or self-hosted MongoDB | Connection string in `MONGO_URI` |
| Configuration | Environment variables | `JWT_SECRET`, `CLIENT_URL`, `VITE_API_URL` and others |

## Design decisions

| Decision | Reason |
|----------|--------|
| Stateless JWT instead of server sessions | Simple and scalable |
| Server calculates price | Prevents tampering |
| Sockets send ids only | Avoids leaking guest data |
| Availability computed from date overlap, not from a stored flag | Always correct even when bookings change or cancel |
| Mongoose indexes on `{room, checkIn, checkOut}` | Fast overlap queries |

More detail: [Technical Documentation](../Technical%20Documentation/README.md).
