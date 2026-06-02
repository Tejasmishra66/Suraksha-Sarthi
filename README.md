# SDRF Helping Hands

SDRF Helping Hands is a disaster-response coordination web app for incident tracking, volunteer dispatch, verification, and operational updates. The repo is split into a backend API and a React web frontend so the system can run locally as a full website.

## How The Project Works

The backend is the source of truth. It exposes REST APIs for authentication, tasks, alerts, incidents, volunteers, resources, verification, sync, bulletins, intel pins, and heartbeat monitoring. The frontend signs in with the demo account, calls those APIs, renders the task board and incident map, uploads media, and stores offline actions locally until they are flushed back to the server.

Recent UI updates include a detailed-address field for incidents, an agency dropdown on the task board, and department dropdowns for adding volunteers and resources.

### Runtime Flow
1. `backend/` starts the Express server, loads the SQLite schema, seeds demo data, and enables the alert, bulletin, intel, and heartbeat monitors.
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

## Special Technical Stack

This project uses a backend-first disaster operations stack. The table below breaks the stack down by field so it is clear which tools power each part of the system.

| Field | Technology Used |
| --- | --- |
| Backend runtime | Node.js |
| Backend framework | Express |
| Backend architecture | Controller-service-model pattern |
| API style | REST APIs |
| Authentication | JWT using `jsonwebtoken` |
| Password security | `bcryptjs` |
| File uploads | `multer` |
| Logging | `morgan` and `winston` |
| Scheduled jobs | `node-cron` |
| Database runtime | SQLite via `better-sqlite3` |
| Database migration readiness | PostgreSQL schema support with `pg` dependency |
| Frontend framework | React 18 |
| Frontend build tool | Vite |
| UI library | Material UI |
| Styling engine | Emotion |
| Frontend routing | React Router |
| API client | Axios |
| Mapping library | Leaflet and React-Leaflet |
| Mobile-style frontend | Flutter placeholder client |
| Testing | Jest and Supertest |
| Local delivery | Docker and Docker Compose |
| Configuration | `.env` based environment variables |
| Data seeding | Custom SQLite seed scripts |
| Offline support | Local offline queue and sync flush flow |
| SMS integration hooks | Twilio and Gupshup ready hooks |

### Field Breakdown
- Backend: Node.js, Express, JWT auth, bcrypt password hashing, upload handling, logging, and background monitors.
- Frontend: React 18, Vite, Material UI, Emotion, Axios, React Router, and Leaflet.
- Database: SQLite is the active runtime database, with PostgreSQL schema files already prepared for migration.
- API: REST endpoints for auth, tasks, alerts, incidents, volunteers, resources, verification, sync, and watchdog checks.
- DevOps and delivery: Docker, Docker Compose, `.env` configuration, and backend-served static uploads.
- Quality and testing: Jest and Supertest for API tests.

## Key Features

- Task board with status changes
- Macro-updates bulletin feed for nodal officer announcements
- Intel pin map for operational notes by department
- Agency heartbeat dashboard with offline detection and fallback reminder SMS
- Geofenced alerts and escalation flow
- Offline queue and sync flush endpoint
- Incident media uploads with SHA-256 integrity metadata
- Incident reports can be created with either coordinates or a detailed address
- Incident verification workflow
- Volunteer and resource management with department selection and capability tags
- Macro updates bulletin board at `/bulletins`
- Intel pin management at `/intel`
- Agency heartbeat tracking at `/ping` and `/status`

## Quick Start

### Run Both Servers Simultaneously (Recommended)

You can start both the backend and frontend together using a single command from the **root directory**.

```powershell
# 1. Install root dependencies (like concurrently)
npm install

# 2. Setup the environment (installs dependencies, creates .env files, and seeds the database)
npm run setup

# 3. Start both servers!
npm run dev
```

### Individual Start

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
- Bulletins: `/bulletins`
- Intel pins: `/intel`
- Heartbeats: `/ping`
- Status dashboard feed: `/status`

## Sample API Payloads

Create bulletin:
```json
{
	"category": "Connectivity",
	"message": "Backup satellite link is live for field teams."
}
```

Create intel pin:
```json
{
	"lat": 28.6139,
	"lon": 77.209,
	"department": "Police",
	"note": "Checkpoint established near the main junction."
}
```

Send heartbeat:
```json
{
	"user_id": 1,
	"location": "HQ command room"
}
```

Create agency member:
```json
{
	"name": "Dr. Neha Sharma",
	"role": "officer",
	"phone": "+919812345678",
	"address": "Medical Block A"
}
```

## Notes

- The backend uses SQLite in MVP mode, but the schema and dependencies are prepared for PostgreSQL migration.
- The frontend expects the backend URL from `frontend/.env` and is already configured for local development.
- If you already have an older SQLite database file, run the one-time migration scripts in `backend/` so the new `address` and `department` fields are available in existing data.
