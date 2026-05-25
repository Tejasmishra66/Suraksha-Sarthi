# SDRF Helping Hands - Architecture Notes

## Modules
- `frontend/`: Flutter app with local SQLite queue, sync service, dashboard screens
- `backend/`: Express REST API with JWT auth, SQLite persistence, watchdog/escalation services
- `docs/`: architecture, API references, demo workflow

## Data Flow
1. Field operator captures incident/task updates in app.
2. If network is unavailable, app writes operation to local `OfflineQueue`.
3. On connectivity restore, app sends queue to `POST /sync/queue` and triggers `POST /sync/flush`.
4. Backend applies operations and marks queue records synced.

## Geofence Notification Matrix
1. Operator posts alert (`disasterType`, `lat`, `lng`, `radiusKm`).
2. Backend matches volunteers by radius and capability tags.
3. Agency heads are included in recipient matrix.
4. Escalation monitor checks every minute and escalates if no response after 5 minutes.

## Verification State Machine
- Incident starts as `Unverified`.
- Officer verifies via `POST /verify/:incidentId`.
- Verified-only dashboard views use `GET /verify/incidents?onlyVerified=true`.

## Watchdog & Failover
- Agency systems call `POST /ping` every 5 minutes.
- Dashboard uses `GET /ping/status` for online/offline states.
- Offline agencies trigger SMS failover in watchdog monitor.
