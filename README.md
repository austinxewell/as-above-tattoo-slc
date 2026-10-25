# As Above Tattoo SLC

A full-stack website and staff portal for **As Above Tattoo**, a tattoo studio in Salt Lake City. Clients use the public site to browse artists and their work, read pricing and aftercare guidance, and send booking requests. Staff use a private portal to work through those requests, manage artist profiles and portfolios, and edit site content without touching code.

The project was built with the shop owner and reviewed with them along the way, so the features come from how a real studio runs.

**Live site:** [https://asabovetattooslc.com](https://asabovetattooslc.com)

![Home Page](https://i.postimg.cc/Xvtkcbx0/Image-10-25-26-at-8-42-AM.png)
![Portfolio Page](https://i.postimg.cc/tgszxT3t/Image-10-25-26-at-8-44-AM.png)
![Artist Page](https://i.postimg.cc/rpD9rm1Z/Image-10-25-26-at-8-44-AM-(1).png)
![After Care page](https://i.postimg.cc/NjJ4FTHT/Image-10-25-26-at-8-45-AM.png
![Booking Page](https://i.postimg.cc/htyrvxdT/Image-10-25-26-at-8-46-AM.png)
![Admin Dashboard](https://i.postimg.cc/NjfDQb5t/Image-10-25-26-at-8-47-AM.png)
![Admin Booking](https://i.postimg.cc/13CHX6qD/Image-10-25-26-at-8-47-AM-(1).png)
![Admin Booking Request](https://i.postimg.cc/7Y4XWq4h/Image-10-25-26-at-8-53-AM.png)
![Admin Booking Scheduling](https://i.postimg.cc/zXNpcqNB/Image-10-25-26-at-8-53-AM-(1).png)
![Admin Scheduled Booking](https://i.postimg.cc/KvbQHmbc/Image-10-25-26-at-8-54-AM.png)
![Admin Artists](https://i.postimg.cc/T3791mDw/Image-10-25-26-at-8-47-AM-(2).png)
![Admin Artist Details](https://i.postimg.cc/bwNgqLdR/Image-10-25-26-at-8-48-AM.png)
![Admin Portfolio](https://i.postimg.cc/g2SDjR61/Image-10-25-26-at-8-48-AM-(1).png)
![Admin Portfolio - Add Piece](https://i.postimg.cc/zGX7qpV8/Image-10-25-26-at-8-48-AM-(2).png)
![Admin Site Content - Settings](https://i.postimg.cc/MpK5ztXd/Image-10-25-26-at-8-48-AM-(3).png)
![Admin Site Content - About](https://i.postimg.cc/nc1T8NVH/Image-10-25-26-at-8-49-AM.png)
![Admin Staff](https://i.postimg.cc/15KMxbRK/Image-10-25-26-at-8-49-AM-(1).png)
![Admin Staff - Add Staff](https://i.postimg.cc/qMGQfWBK/Image-10-25-26-at-8-49-AM-(2).png)
![!Admin Report An Issue](https://i.postimg.cc/kXCwp7CD/Image-10-25-26-at-8-54-AM-(1).png)

---

## Highlights

- **CMS-driven content.** About, pricing, booking, aftercare, shop hours, and contact details are stored in MongoDB and edited from the portal, so the shop can update its own site.
- **Booking pipeline.** Public requests go into a status workflow (`new → contacted → scheduled / declined`) with assignment, archiving, bulk actions, a notes and activity timeline, session scheduling, and "Add to calendar" (Google Calendar / `.ics`).
- **Role-based portal.** Separate admin and artist experiences, with permission checks enforced on the server, not only hidden in the UI.
- **Publishing standards.** Admins set what an artist profile needs before it can go live (photo, bio, number of specialties, number of portfolio pieces, and so on). Artists see a checklist of what's left.
- **Direct-to-CDN image uploads.** The server signs short-lived upload tokens so images go straight from the browser to ImageKit and are served resized on the fly.
- **Transactional email.** Booking notifications, staff invites, password resets, and issue reports are sent through Resend and built with React Email.
- **Installable staff portal.** The portal ships a web app manifest so staff can add it to their home screen.

---

## Tech Stack

| Layer          | Technology                                                                     |
| -------------- | ------------------------------------------------------------------------------ |
| **Frontend**   | React 19, React Router v8 (framework mode, SPA), TypeScript, Vite              |
| **Styling**    | Tailwind CSS v4, shadcn/ui on Base UI, Lucide icons, light/dark themes         |
| **API**        | Node.js 24, Express 5, GraphQL Yoga, GraphQL                                   |
| **Database**   | MongoDB with Mongoose                                                          |
| **Auth**       | Cookie sessions with hashed tokens, Argon2 password hashing                    |
| **Services**   | ImageKit (image storage and CDN), Resend + React Email (email)                 |
| **Hosting**    | Netlify (client), Railway (API)                                                |
| **Tooling**    | ESLint, Prettier, GitHub Actions CI                                            |

---

## Features

### Public Site

| Page                | Description                                                                         |
| ------------------- | ----------------------------------------------------------------------------------- |
| **Home**            | Hero, about preview, featured artists and work, studio process, visit info          |
| **Artists**         | Published artist roster, with a profile page per artist (bio, specialties, booking details) |
| **Portfolio**       | Gallery of all work with keyword search, artist and style filters, and pagination   |
| **Booking**         | Request form with artist selection. When requests are off, it points clients to each artist's Instagram instead |
| **Pricing**         | Shop pricing content managed from the portal                                         |
| **Aftercare**       | Healing timeline and care instructions                                               |
| **Shop / Careers**  | Placeholder pages for upcoming features                                              |

### Staff Portal: Admin

- **Dashboard:** stats, booking pipeline, recent requests, artist booking status, site status
- **Bookings:** filter, search, bulk update, assign, archive, delete, add notes and sessions, create bookings by hand for requests that came in through Instagram, Facebook, or elsewhere
- **Artists:** edit any artist profile, set the public display order, publish or unpublish
- **Portfolio:** upload, tag, and feature pieces across all artists
- **Site Content:** edit About, Pricing, Booking, Aftercare, shop details and hours, turn booking requests on or off, set publishing standards
- **Staff:** invite admins and artists by email; removing an artist walks through handing off their open requests first

### Staff Portal: Artist

- Personal dashboard with a profile-completion checklist
- Inbox of requests assigned to them or open to anyone
- Profile editor with a live preview
- Portfolio management for their own work

---

## Architecture

```
as-above-tattoo-slc/
├── client/                 # React Router SPA (deployed to Netlify)
│   ├── app/
│   │   ├── routes/         # Public pages, auth, and /portal (admin + artist)
│   │   ├── layouts/        # Site, portal, admin, and artist layouts
│   │   ├── components/     # Feature-grouped UI components + shadcn/ui primitives
│   │   └── lib/            # GraphQL client, queries, and shared helpers
│   └── public/
├── server/                 # GraphQL API (deployed to Railway)
│   └── src/
│       ├── graphql/        # One module per domain: type-defs, resolvers, validation
│       ├── models/         # Mongoose schemas
│       ├── auth/           # Sessions, guards, invites, password resets
│       ├── email/          # React Email templates + Resend sender
│       ├── images/         # ImageKit integration
│       ├── security/       # Rate limiting, Netlify proxy verification
│       └── seed/           # Local seed data
├── netlify.toml            # Client build + signed API proxy
└── .github/workflows/      # CI: lint and build for client and server
```

### How the pieces connect

```
Browser ──► Netlify (static SPA)
              │
              └── /graphql ──(signed proxy)──► Railway (Express + GraphQL Yoga) ──► MongoDB
                                                      │
                                                      ├──► ImageKit (signed uploads, deletes)
                                                      └──► Resend (email)
```

- The client always calls `/graphql` on its own origin. Locally, Vite proxies it to `localhost:4000`. In production, Netlify proxies it to Railway, so the session cookie is first-party and CORS isn't needed.
- The GraphQL schema is split by domain (`about`, `artist`, `booking`, `piece`, `pricing`, `user`, and so on). Each module has its own type definitions, resolvers, and input validation, and `schema.ts` combines them.

---

## Security

- **Sessions:** login creates a random 256-bit token. Only its SHA-256 hash is stored in MongoDB, and sessions expire after 7 days.
- **Passwords:** hashed with Argon2. Reset links expire after 30 minutes, invite links after 7 days, and each can be used once.
- **Authorization:** `requireUser` / `requireRole` guards run in resolvers. Artists can only see and change their own profile, portfolio, and assigned requests.
- **CSRF:** GraphQL Yoga's CSRF prevention plugin requires a custom header on every request.
- **Origin lock:** in production, the API only accepts requests that carry a valid Netlify proxy signature (a JWT checked with `jose`), so the Railway URL can't be called directly.
- **Abuse protection:** login, password reset, booking requests, and issue reports are rate limited by client IP. The public booking form also has a honeypot field.
- **Seed safety:** the seed script won't run against a non-local database unless you pass `--allow-remote`.

---

## Getting Started

### Prerequisites

- Node.js 24+
- A MongoDB instance (local or Atlas)
- Optional: ImageKit and Resend accounts for image uploads and email

### 1. Clone and install

```bash
git clone https://github.com/austinxewell/as-above-tattoo-slc.git
cd as-above-tattoo-slc

cd server && npm install
cd ../client && npm install
```

### 2. Configure the server

Copy `server/.env.example` to `server/.env` and fill in the values:

| Variable                    | Purpose                                                            |
| --------------------------- | ------------------------------------------------------------------ |
| `PORT`                      | API port (default `4000`)                                          |
| `CLIENT_URL`                | Client origin, used in email links (e.g. `http://localhost:5173`)  |
| `MONGO_URL`                 | MongoDB connection string                                          |
| `RESEND_API_KEY`            | Resend API key for sending email                                   |
| `EMAIL_FROM`                | Sender address for outgoing email                                  |
| `EMAIL_ASSET_URL`           | Base URL for images used in email templates                        |
| `ISSUE_REPORT_EMAIL`        | Where portal issue reports are sent                                |
| `BOOKING_REQUESTS_ENABLED`  | Initial on/off state for public booking requests                   |
| `SEED_USER_PASSWORD`        | Password given to seeded staff accounts                            |
| `IMAGEKIT_URL_ENDPOINT`     | ImageKit URL endpoint                                              |
| `IMAGEKIT_PUBLIC_KEY`       | ImageKit public key                                                |
| `IMAGEKIT_PRIVATE_KEY`      | ImageKit private key (server only)                                 |
| `NETLIFY_SIGNATURE_SECRET`  | Production only: the secret Netlify uses to sign proxied requests. Leave it unset locally. |

### 3. Seed and run

```bash
# Terminal 1: API
cd server
npm run seed        # seed a local database (or: npm run seed artists pieces)
npm run dev         # http://localhost:4000/graphql

# Terminal 2: client
cd client
npm run dev         # http://localhost:5173
```

Sign in at `/login` with a seeded staff account and the `SEED_USER_PASSWORD` you set.

---

## Scripts

| Command                | Client | Server | Description                         |
| ---------------------- | :----: | :----: | ----------------------------------- |
| `npm run dev`          |   ✓    |   ✓    | Start the dev server                |
| `npm run build`        |   ✓    |   ✓    | Production build                    |
| `npm run start`        |   ✓    |   ✓    | Run the production build            |
| `npm run typecheck`    |   ✓    |   ✓    | TypeScript type check               |
| `npm run lint`         |   ✓    |   ✓    | ESLint                              |
| `npm run format`       |   ✓    |   ✓    | Format with Prettier                |
| `npm run seed`         |        |   ✓    | Seed a local MongoDB database       |

---

## Deployment

- **Client → Netlify.** Configured in `netlify.toml`: builds from `client/`, publishes `build/client`, adds an SPA fallback, and proxies `/graphql` to the API with a signed header. Netlify skips the build when nothing in `client/` changed.
- **API → Railway.** Builds with `npm run build` and starts with `npm start`. A `/health` endpoint is available for uptime checks.
- **CI → GitHub Actions.** Every push and pull request to `dev` or `main` installs, lints, and builds both the client and the server.

---

## Author

**Austin Ewell**: [GitHub](https://github.com/austinxewell)

Built for As Above Tattoo, Salt Lake City, Utah.
