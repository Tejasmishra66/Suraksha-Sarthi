# SDRF Helping Hands Backend

Backend-first implementation for disaster-response coordination.

## Stack
- Node.js + Express
- SQLite (MVP) with PostgreSQL migration-ready schema
- JWT auth
- Controllers + services + models pattern
- Morgan + Winston logging
- Jest + Supertest tests

## Folder Design
- `src/routes` route declarations only
- `src/controllers` request/response orchestration
- `src/services` business logic
- `src/models` persistence logic
- `src/middlewares` auth, async wrapper, error handling

## Setup
```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

The backend listens on `http://localhost:4001` by default.

### Running with the React frontend
1. Start the backend (default port 4001):
```bash
cd backend
npm run dev
```
2. Start the frontend in a separate terminal:
```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```
3. Open the frontend at `http://localhost:5173` and sign in with the demo credentials.

Run tests:
```bash
npm test
```

Seed-only command:
```bash
npm run seed
```

## Demo Credentials
- Email: `officer@sdrf.local`
- Password: `password123`

## Primary Endpoints
- `POST /auth/login`
- `GET/POST/PATCH /tasks`
- `GET/POST /alerts`, `GET /alerts/:id/recipients`, `POST /alerts/:id/respond`
- `GET /volunteers`, `POST /volunteers/broadcast`
- `GET /resources`, `GET /resources/training-kits`
- `GET /resources/export/resources.csv`, `GET /resources/export/rainfall.csv`
- `GET/POST /incidents`, `POST /incidents/:id/media`
- `POST /verify/:incidentId`, `GET /verify/incidents`
- `POST /sync/queue`, `POST /sync/flush`
- `POST /ping`, `GET /ping/status`

## Sample Payloads

Create task:
```json
{
	"incidentId": 1,
	"title": "Deploy rescue boats",
	"details": "Cover sectors 9A-9C",
	"assignedAgency": "SDRF",
	"status": "New"
}
```

Create alert:
```json
{
	"disasterType": "Flood",
	"lat": 28.6125,
	"lng": 77.204,
	"radiusKm": 10,
	"severity": "high"
}
```

Create incident:
```json
{
	"title": "Bridge waterlogging",
	"description": "Water above road level",
	"disasterType": "Flood",
	"lat": 28.601,
	"lng": 77.198,
	"agencyAssigned": "SDRF",
	"offline": true
}
```

Offline queue sync:
```json
{
	"items": [
		{
			"entityType": "task",
			"entityId": "2",
			"operation": "update_status",
			"payload": {
				"taskId": 2,
				"status": "In Progress"
			}
		}
	]
}
```

## PostgreSQL Migration Note
MVP runtime uses SQLite. Migration scaffolding:
- `src/db/schema.postgres.sql`
- `src/db/postgres-switch.md`
