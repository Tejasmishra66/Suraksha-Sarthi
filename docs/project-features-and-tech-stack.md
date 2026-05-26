# SDRF Helping Hands Project Features And Technical Stack

This document is a compact reference for the working features and the technical stack used in the SDRF Helping Hands project.

## 1. What The Project Does

SDRF Helping Hands is a disaster-response coordination system for field teams, nodal officers, volunteers, and agency commanders. It supports incident tracking, task allocation, bulletin updates, intel mapping, volunteer/resource management, heartbeat monitoring, and offline-friendly synchronization.

## 2. Working Features

### Core Operations
- Task board with create, update, and status flow
- Multi-agency task notification through SMS hooks
- Agency details page for viewing members and registering new members
- Volunteer dashboard for roster, resources, and radius broadcast
- Incident and alert map workflow
- Incident media upload with metadata tracking
- Verification workflow for incidents
- Offline queue and sync flush support

### Department And Command Features
- Macro-updates bulletin feed
- Intel pin map for operational notes by department
- Agency heartbeat status dashboard
- Background offline detection for stale agencies
- Failover SMS reminder when an agency goes offline

### Map And Location Features
- Himachal Pradesh-focused map bounds for operational views
- Click-to-capture coordinates on map pins
- Human-readable place field when coordinates are unavailable
- Last clicked alert coordinates can be reused in the volunteer flow

### Communication Features
- JWT-based login
- Role-based bulletin posting for nodal officers
- SMS integration hooks for Twilio and Gupshup
- Alert and escalation reminders through the SMS service layer

## 3. Backend Technical Stack

- Runtime: Node.js
- Framework: Express
- Architecture: Controller-service-model pattern
- Authentication: JWT using `jsonwebtoken`
- Password hashing: `bcryptjs`
- Uploads: `multer`
- Logging: `morgan` and `winston`
- Scheduled work: `node-cron` plus interval-based background monitors
- Validation/error handling: Express middleware layer
- SMS abstraction: `smsService.js`

## 4. Frontend Technical Stack

- Framework: React 18
- Build tool: Vite
- Routing: React Router
- UI library: Material UI
- Styling engine: Emotion
- API client: Axios
- Mapping: Leaflet and React-Leaflet
- Local state and draft persistence: React state plus localStorage queue helpers

## 5. API Layer

The project uses REST APIs for all operational actions.

### Existing And New Routes
- `POST /auth/login` - JWT login
- `GET /tasks` - task board data
- `POST /tasks` - create task
- `PATCH /tasks/:id` - update task
- `GET /bulletins` - macro-updates feed
- `POST /bulletins` - create bulletin
- `GET /intel` - intel pins feed
- `POST /intel` - create intel pin
- `POST /ping` - record agency heartbeat
- `GET /status` - current agency status feed
- `GET /agencies` - agency catalog
- `GET /agencies/:agency/members` - list agency members
- `POST /agencies/:agency/members` - register agency member
- `GET /alerts` - alerts feed
- `POST /alerts` - create alert pin
- `GET /volunteers` - volunteer roster
- `POST /volunteers` - add volunteer
- `POST /volunteers/broadcast` - radius broadcast
- `GET /resources` - resource roster
- `POST /resources` - add resource
- `GET /sync/queue` - offline queue items
- `POST /sync/queue` - add queued items
- `POST /sync/flush` - apply queued items

## 6. Database Layer

### Active Runtime Database
- SQLite via `better-sqlite3`

### Migration-Ready Database Support
- PostgreSQL schema file is included for future migration
- `pg` dependency is already present for the transition path

### Main Tables Used
- `users` - officers, agency heads, volunteers, workers, and related contact data
- `volunteers` - volunteer roster and capabilities
- `resources` - resource inventory
- `incidents` - incident records and verification state
- `tasks` - operational task board items
- `bulletins` - macro-updates feed
- `intel_pins` - operational intel map points
- `heartbeats` - agency monitoring and offline detection
- `alerts` - alert and geofence records
- `alert_recipients` - alert notification audit trail
- `offline_queue` - offline-first queued actions
- `watchdog_status` - legacy heartbeat/watchdog monitor table
- `macro_updates` - legacy bulletin storage used in earlier iterations
- `rainfall_logs` - sample environmental data

## 7. Documentation Files In The Repo

- `README.md` - full project overview and setup
- `docs/api.md` - API notes
- `docs/architecture.md` - system architecture notes
- `docs/demo-workflow.md` - demo usage flow
- `docs/web-integration.md` - frontend/backend integration notes
- `docs/project-features-and-tech-stack.md` - this file

## 8. Delivery And Dev Environment

- Local development uses separate backend and frontend apps
- Docker and Docker Compose are available for containerized runs
- Environment values are loaded from `.env`
- Backend serves uploaded media files from the local uploads directory

## 9. Sample Data And Seed Support

- Demo officers and agency heads are seeded for login
- Volunteer and resource sample records are seeded for the dashboard
- Incident/task samples are seeded for Kanban board testing
- Bulletin, intel pin, and heartbeat sample rows are seeded for the new monitoring features

## 10. Notes

- The current runtime uses SQLite.
- PostgreSQL support is scaffolded for future migration.
- Map views are centered on Himachal Pradesh for the current operational scope.
- The Intel map supports click-to-fill coordinates.
- Volunteer registration supports both coordinates and a place field.