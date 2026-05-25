# SDRF Helping Hands - Demo Workflow

## 1. Start Backend
```bash
cd backend
npm install
npm run dev
```

## 2. Start Frontend
```bash
cd frontend
flutter pub get
flutter run
```

## 3. Login
Use:
- `officer@sdrf.local`
- `password123`

## 4. Task Assignment (Digital Handshake)
1. Open Task Board.
2. Pick a `New` task.
3. Set agency + status (`In Progress` / `Complete`).
4. Save update.

## 5. Offline Sync Pipeline
1. Disconnect network.
2. Update task status again.
3. App queues operation in local SQLite `OfflineQueue`.
4. Reconnect network and tap `Sync`.
5. App pushes queue to backend `/sync/queue` then `/sync/flush`.

## 6. Geofenced Notification Matrix
1. Open Alerts screen.
2. Choose disaster type and location.
3. Tap `Drop Pin & Alert`.
4. Backend routes to matched volunteers + agency heads.
5. If no response in 5 minutes, escalation monitor triggers failover message.

## 7. Verification State Machine
1. Open Incidents.
2. Toggle filter off to show unverified incidents.
3. Tap `Verify` for an unverified incident.
4. Toggle verified-only filter on.

## 8. Watchdog
1. Heartbeat agencies with:
```bash
curl -X POST http://localhost:4000/ping -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d "{\"agency\":\"SDRF\"}"
```
2. Check dashboard status via Bulletins screen.

## 9. CSV Export
- `GET /export/resources.csv`
- `GET /export/rainfall.csv`
