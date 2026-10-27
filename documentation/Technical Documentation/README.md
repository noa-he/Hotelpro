# HotelPro Documentation

HotelPro is a full-stack hotel management web application. Guests search for rooms and book them, front-desk staff confirm bookings and handle check-in and check-out, and admins manage the room inventory. Room availability updates live across browsers.

## Contents

| Document | What it covers |
|----------|----------------|
| [01-overview.md](01-overview.md) | Purpose, features, tech stack, project structure |
| [02-setup.md](02-setup.md) | Installing and running the project locally |
| [03-architecture.md](03-architecture.md) | How the client, server, database and sockets fit together |
| [04-database.md](04-database.md) | Data models, fields and relationships |
| [05-api-reference.md](05-api-reference.md) | Every REST endpoint with parameters, roles and errors |
| [06-realtime.md](06-realtime.md) | Socket.IO events and the live availability flow |
| [07-user-guide.md](07-user-guide.md) | Walkthrough for guests, staff and admins |
| [08-security.md](08-security.md) | Authentication, authorization and security notes |
| [09-theme-and-ui.md](09-theme-and-ui.md) | Colour theme, style classes and how to customise them |
| [10-deployment.md](10-deployment.md) | Deploying to Vercel and a Node host, environment variables, checklist |
| [11-limitations-and-roadmap.md](11-limitations-and-roadmap.md) | Known gaps and suggested next steps |

## Quick start

```bash
# Terminal 1: backend
cd server
cp .env.example .env
npm install
npm run seed
npm run dev

# Terminal 2: frontend
cd client
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:5173 and sign in with a demo account (see [02-setup.md](02-setup.md#demo-accounts)).
