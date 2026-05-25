# SDRF Helping Hands - API Reference (MVP)

## Auth
### `POST /auth/login`
Request:
```json
{ "email": "officer@sdrf.local", "password": "password123" }
```
Response:
```json
{ "token": "<jwt>", "user": { "id": 1, "name": "SDRF Officer", "role": "officer" } }
```

## Tasks
### `GET /tasks`
Returns task cards with incident context.

### `POST /tasks`
Creates a task.

### `PATCH /tasks/:id`
Updates assignment/status (`New`, `In Progress`, `Complete`).

## Alerts
### `POST /alerts`
Drops pin and dispatches geofenced notifications.

### `GET /alerts`
Returns alert pins for map canvas placeholders.

### `GET /alerts/:id/recipients`
Shows delivery matrix and response states.

### `POST /alerts/:id/respond`
Marks volunteer/user as responded.

## Incidents & Verification
### `POST /incidents`
Creates incident with tamper-proof hash metadata.

### `POST /incidents/:id/media`
Uploads photo (`multipart/form-data`, field: `photo`) and stores SHA-256 + timestamp + GPS metadata.

### `POST /verify/:incidentId`
Marks incident verified.

### `GET /verify/incidents?onlyVerified=true`
Returns verified incidents only.

## Offline Sync
### `POST /sync/queue`
Accepts queued offline operations.

### `POST /sync/flush`
Applies queued operations.

## Watchdog
### `POST /ping`
Heartbeat endpoint.

### `GET /ping/status`
Agency health status.

## CSV Export
### `GET /resources/export/resources.csv`
Resource inventory CSV.

### `GET /resources/export/rainfall.csv`
Rainfall logs CSV.

## Volunteers & Resources
### `GET /volunteers`
Lists volunteer roster and capability tags.

### `POST /volunteers/broadcast`
Returns volunteers within active radius and matching skills.

### `GET /resources`
Lists resources.

### `GET /resources/training-kits`
Lists pre-cached offline training kit references.
