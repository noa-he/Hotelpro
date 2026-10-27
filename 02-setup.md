# 2. Setup

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB running locally, or a MongoDB Atlas connection string

## 1. Get the code

```bash
git clone https://github.com/noa-he/Hotelpro.git
cd Hotelpro
```

## 2. Backend

```bash
cd server
cp .env.example .env
npm install
```

Edit `.env`:

| Variable | Default in `.env.example` | Description |
|----------|---------------------------|-------------|
| `PORT` | `5000` | Port the API listens on |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/hotelpro` | MongoDB connection string |
| `JWT_SECRET` | `replace_with_a_long_random_string` | Secret used to sign tokens. **Change this.** |
| `JWT_EXPIRES_IN` | `7d` | Token lifetime |
| `CLIENT_URL` | `http://localhost:5173` | Allowed browser origin for CORS and Socket.IO |

Generate a strong secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Load demo data, then start the server:

```bash
npm run seed    # creates demo users and rooms (clears existing users and rooms)
npm run dev     # nodemon, restarts on changes
```

The API is now at http://localhost:5000/api. Check it with `GET /api/health`, which returns `{ "ok": true }`.

### Server scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `npm start` | `node server.js` | Production start |
| `npm run dev` | `nodemon server.js` | Development with auto-restart |
| `npm run seed` | `node seed.js` | Reset and load demo data |

## 3. Frontend

Open a second terminal:

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:5000/api` | Base URL of the API. The Socket.IO client derives its URL from this by removing the trailing `/api`. |

Open http://localhost:5173.

### Client scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build into `client/dist` |
| `npm run preview` | Serve the production build locally |

> The client has no `start` script. Use `npm run dev`.

## Demo accounts

Created by `npm run seed`:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hotelpro.com | admin123 |
| Staff | staff@hotelpro.com | staff123 |
| Guest | guest@hotelpro.com | guest123 |

The seed also creates 12 rooms: three each of single, double, deluxe and suite.

| Type | Sleeps | Price per night (₹) | Room numbers |
|------|--------|---------------------|--------------|
| single | 1 | 1,800 | 101, 102, 103 |
| double | 2 | 2,800 | 201, 202, 203 |
| deluxe | 3 | 4,200 | 301, 302, 303 |
| suite | 4 | 7,500 | 401, 402, 403 |

**Never use these demo passwords in a real deployment.**

## Troubleshooting

| Problem | Likely cause and fix |
|---------|----------------------|
| `MongoDB connection failed` on start | MongoDB is not running or `MONGO_URI` is wrong |
| Browser shows a CORS error | `CLIENT_URL` in `server/.env` does not match the URL the browser uses (including port) |
| Login works but every request returns 401 | `JWT_SECRET` changed after tokens were issued. Sign in again. |
| Live updates do not appear | `VITE_API_URL` points to the wrong host, so the socket connects elsewhere |
| Changes to `.env` have no effect | Restart the server (Vite also needs a restart for `.env` changes) |
