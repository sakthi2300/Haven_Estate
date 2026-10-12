# Haven Estate

Real estate website built with React, Vite, and a Node.js API. Listings and enquiries are stored in a local JSON file.

## Run locally

Install Node.js, then from the project folder:

```bash
npm install
copy .env.example .env   # Windows
# cp .env.example .env   # macOS / Linux
npm run dev
```

Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `SESSION_SECRET` in `.env`. Open [http://localhost:5173](http://localhost:5173). Vite serves the frontend and API together. The API creates `.data/haven-estate.json` on first request and saves listings and enquiries there. Back up the file to preserve local data.

## Run with Docker

Install Docker Desktop or Docker Engine with the Compose plugin. Copy `.env.example` to `.env` and set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and a long random `SESSION_SECRET`. Then run:

```bash
docker compose up --build -d
```

Open [http://localhost:3000](http://localhost:3000). Docker Compose runs the built frontend and Node API together and stores data in a named volume, which survives container restarts and rebuilds.

```bash
docker compose down      # stop the app; keep saved data
docker compose down -v   # stop the app and delete saved data
```

## Environment variables

| Name | Purpose |
| --- | --- |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin password |
| `SESSION_SECRET` | Signs the HttpOnly session cookie |
| `VITE_API_URL` | Optional API origin for a separately hosted frontend; leave empty for local and Docker use |
| `CORS_ALLOWED_ORIGINS` | Comma-separated frontend origins for cross-origin API requests |
| `CROSS_SITE_COOKIES` | Set to `true` only when frontend and API are on different sites |

## Deployment

Run the Docker container on a machine that stays available. The JSON file store needs persistent disk storage; serverless platforms such as Vercel do not provide durable local file storage.

Admin: `/admin/login`, then `/admin`. Sessions use an HttpOnly cookie and are checked on protected API calls.

## API

- `GET /api/properties` — pagination and filters (`q`, `type`, `listingType`, `maxPrice`, `sort`)
- `GET /api/properties/:id`
- `POST /api/enquiries`
- Admin session routes: `/api/auth/login`, `/api/auth/me`, `/api/auth/logout`
- Admin listing routes: `POST /api/properties`, `PUT` and `DELETE /api/properties/:id`, and `GET /api/properties?summary=1`
