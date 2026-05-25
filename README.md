# SDRF Helping Hands

SDRF Helping Hands is a disaster-response coordination web app for incident tracking, volunteer dispatch, verification, and operational updates. The repo is split into a backend API and a React web frontend so the system can run locally as a full website.

## How The Project Works

The backend is the source of truth. It exposes REST APIs for authentication, tasks, alerts, incidents, volunteers, resources, verification, sync, and watchdog heartbeats. The frontend signs in with the demo account, calls those APIs, renders the task board and incident map, uploads media, and stores offline actions locally until they are flushed back to the server.

Recent UI updates include a detailed-address field for incidents, an agency dropdown on the task board, and department dropdowns for adding volunteers and resources.

### Runtime Flow
1. `backend/` starts the Express server, loads the SQLite schema, seeds demo data, and enables the alert/watchdog monitors.
2. `frontend/` starts the Vite development server and renders the operational dashboard.
3. The frontend talks to the backend over HTTP using the API base URL in `frontend/.env`.
4. The backend persists data in SQLite for the MVP and is structured so PostgreSQL can be swapped in later.

## Repository Structure

- `backend/` Node.js + Express REST API, database schema, services, controllers, tests, and uploads
- `frontend/` React + Vite web app with Material UI, map view, login, task board, media upload, and offline queue support
- `docs/` Supporting architecture notes and workflow docs
- `docker-compose.yml` Local container orchestration for both services
- `Dockerfile.backend` Backend container build
- `frontend/Dockerfile` Frontend container build

## Technical Stack

### Backend
- Node.js
- Express
- SQLite via `better-sqlite3`
- JWT authentication via `jsonwebtoken`
- `bcryptjs` for password hashing
- `multer` for file uploads
- `morgan` and `winston` for logging
- `node-cron` for scheduled background checks
- `pg` included for PostgreSQL migration readiness
- Jest and Supertest for API tests

### Frontend
- React 18
- Vite
- Material UI
- Emotion styling engine
- Axios for API calls
- React Router
- Leaflet and React-Leaflet for the incident map

### Dev And Delivery
- Docker and Docker Compose
- `.env` based configuration
- Local file uploads served by the backend

## Key Features

- Task board with status changes
- Geofenced alerts and escalation flow
- Offline queue and sync flush endpoint
- Incident media uploads with SHA-256 integrity metadata
- Incident reports can be created with either coordinates or a detailed address
- Incident verification workflow
- Volunteer and resource management with department selection and capability tags
- Macro updates bulletin board
- Watchdog heartbeat tracking at `/ping`

## Quick Start

### Backend
```powershell
cd C:\Users\hp\Suraksha-Sarthi\backend
npm install
copy .env.example .env
npm run dev
```

### Frontend
```powershell
cd C:\Users\hp\Suraksha-Sarthi\frontend
npm install
copy .env.example .env
npm run dev
```

Open the frontend at `http://localhost:5173` and use the demo credentials below.

If port `5173` is already in use, Vite will automatically pick the next free port such as `http://localhost:5174`.

## Demo Credentials

- Email: `officer@sdrf.local`
- Password: `password123`

## Default Local Ports

- Backend: `http://localhost:4001`
- Frontend: `http://localhost:5173`
- Frontend fallback when busy: `http://localhost:5174`

## Useful Scripts

- Backend test suite:
```powershell
cd C:\Users\hp\Suraksha-Sarthi\backend
npm test
```

- Backend seed only:
```powershell
cd C:\Users\hp\Suraksha-Sarthi\backend
npm run seed
```

- Frontend production build:
```powershell
cd C:\Users\hp\Suraksha-Sarthi\frontend
npm run build
```

## API Areas

- Authentication: `/auth/login`
- Tasks: `/tasks`
- Alerts: `/alerts`
- Incidents and media: `/incidents`
- Volunteers: `/volunteers`
- Resources: `/resources`
- Verification: `/verify`
- Offline sync: `/sync`
- Watchdog: `/ping`

## Notes

- The backend uses SQLite in MVP mode, but the schema and dependencies are prepared for PostgreSQL migration.
- The frontend expects the backend URL from `frontend/.env` and is already configured for local development.
- If you already have an older SQLite database file, run the one-time migration scripts in `backend/` so the new `address` and `department` fields are available in existing data.
