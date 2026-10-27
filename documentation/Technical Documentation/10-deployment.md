# 10. Deployment

The project's live frontend is at https://hotelpro-chi.vercel.app (Vercel). This page describes the pieces that matter for deploying HotelPro.

## Frontend on Vercel

**Single-page app routing.** HotelPro uses React Router, so paths like `/dashboard` or `/book/123` exist only in the browser. If a user refreshes on one of them, the host must serve `index.html` instead of returning 404. `client/vercel.json` handles that:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Project settings**

| Setting | Value |
|---------|-------|
| Root directory | `client` |
| Framework preset | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment variable | `VITE_API_URL` = your deployed API URL ending in `/api` |

`VITE_API_URL` is baked in at **build time**. After changing it, redeploy the frontend.

## Backend

The backend is a long-running Node process and also hosts the WebSocket server. Choose a host that keeps a process alive (a VM, or a platform such as Render, Railway or Fly.io). Serverless functions do not suit Socket.IO.

**Environment variables to set**

| Variable | Production value |
|----------|------------------|
| `PORT` | Usually provided by the host |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random string |
| `JWT_EXPIRES_IN` | e.g. `7d` |
| `CLIENT_URL` | `https://hotelpro-chi.vercel.app` (exact origin, no trailing slash) |

**Start command:** `npm start` (from the `server` directory).

## Deployment checklist

- [ ] MongoDB Atlas cluster created, database user set up, host's IP allowed
- [ ] Backend deployed with all environment variables
- [ ] `GET https://<api-host>/api/health` returns `{ "ok": true }`
- [ ] Admin and staff accounts created, **demo passwords not used**
- [ ] Rooms added (seed once on a fresh database only, or create via the API)
- [ ] Frontend deployed with `VITE_API_URL` pointing at the backend
- [ ] `CLIENT_URL` on the backend matches the frontend's exact URL
- [ ] Sign in, book a room, and confirm in a second browser that live updates work
- [ ] Refresh on `/dashboard` to confirm the SPA rewrite works

## Common deployment problems

| Symptom | Cause |
|---------|-------|
| 404 after refreshing a page | `vercel.json` missing or not in the `client` folder |
| CORS errors in the browser | `CLIENT_URL` does not exactly match the frontend origin |
| Frontend still calls `localhost` | `VITE_API_URL` was not set at build time |
| Live updates never arrive | Backend hosted on a platform that does not support persistent WebSocket connections |
| Mixed-content errors | Frontend is HTTPS but API URL is HTTP |
