# SRS Frontend

Frontend for the [Automated Customer Support Resolution System](https://github.com/Yad4o/SRS) (SRS) — an AI-powered support ticket classifier and auto-responder.

Live: deployed on Vercel, pointed at the SRS backend on Render.

---

## ⚡ Try it — no login required

The backend has a free, public, no-auth endpoint (`POST /resolve`), and this frontend exposes it as a page:

**`/try`** — type a message, get an instant AI classification and (when confident) a ready-to-use answer. Nothing is saved, no account needed. This is the primary call-to-action on the landing page.

Everything else — ticket history, the agent queue, admin dashboards — sits behind login for teams that want that layer. See [Routes](#-routes) below.

---

## 🛠️ Stack

- **React 19** + **TypeScript**
- **Vite 7** — dev server & build
- **Tailwind CSS 4** + shadcn/ui (Radix primitives)
- **wouter** — routing
- **TanStack Query** — server state / data fetching
- **axios** — API client
- **recharts** — admin dashboard charts

## 📦 Getting Started

```bash
git clone https://github.com/Yad4o/srs-frontend.git
cd srs-frontend/client
npm install
```

Copy the env example and point it at a running SRS backend:

```bash
cp ../.env.example .env
# .env
VITE_API_BASE_URL=http://localhost:8000   # or your deployed backend URL
```

Run the dev server:

```bash
npm run dev
```

## 📜 Scripts

Run from `client/`:

| Script | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build:pages` | Static production build (`vite build` only) — what CI/Vercel use |
| `npm run build` | Static build **plus** bundles `server/index.ts` with esbuild, for the optional Node server |
| `npm run start` | Run the built Node server (`node dist/index.js`) |
| `npm run preview` | Preview a production build locally |
| `npm run check` | Type-check with `tsc --noEmit` |
| `npm run format` | Format the codebase with Prettier |

## 🗺️ Routes

**Public** (no login):
- `/` — Landing page
- `/try` — free, no-login AI resolve widget
- `/login`, `/register`, `/forgot-password`

**Requires an account** (agent/admin dashboard):
- `/dashboard` — overview
- `/tickets`, `/tickets/new`, `/tickets/:id` — ticket history & submission
- `/queue` — agent assignment queue
- `/admin`, `/admin/tickets`, `/admin/escalations`, `/admin/users` — admin views
- `/settings`

## 🚀 Deployment

Deployed on **Vercel** (`vercel.json` rewrites all routes to `index.html` for client-side routing). Set `VITE_API_BASE_URL` as a Vercel environment variable pointing at your backend deployment.

## 🔗 Related

- Backend / API: [Yad4o/SRS](https://github.com/Yad4o/SRS) — see its README for the `POST /resolve` API quickstart (curl/JS/Python) if you want to integrate the AI service directly instead of using this UI.
