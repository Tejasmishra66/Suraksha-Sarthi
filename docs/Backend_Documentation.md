# 📋 Suraksha-Sarthi (SDRF Helping Hands) - Backend Technical Report

---

## 1. 🚀 Overview: What We Built
The backend of **Suraksha-Sarthi** serves as the central command center for our disaster-response coordination platform. It acts as the single source of truth, managing all the data required for disaster operations, incident reporting, volunteer coordination, and real-time alerts. 

The primary goal of this backend was to build a secure, resilient, and fast API that the frontend can rely on, even in low-connectivity disaster zones.

---

## 2. 🛠️ Technology Stack
We used a modern, scalable, and easy-to-deploy stack:
* **Runtime:** Node.js
* **Framework:** Express.js (REST API architecture)
* **Database:** SQLite (Used for MVP, but fully structured to be migrated to PostgreSQL later).
* **Authentication:** JWT (JSON Web Tokens) with `bcryptjs` for secure password hashing.
* **File Uploads:** `multer` (for handling media uploads with SHA-256 integrity checks).
* **Logging:** `morgan` and `winston`.

---

## 3. 🗄️ Database Schema Details
The database is designed to handle multiple aspects of disaster management. Below is an easy-to-understand breakdown of the tables we created and what they do:

### Core Users & Personnel
* **`users`**: Stores system users (officers, admins) including their names, secure passwords, roles, agency, and departments.
* **`volunteers`**: Tracks available volunteers, their locations (Lat/Lng), phone numbers, and specific capabilities/terrain restrictions.
* **`resources`**: Tracks physical resources (like excavators, boats, medical kits), their quantities, and real-time availability status.

### Incident Management
* **`incidents`**: The core table for disaster reporting. It stores the disaster type, exact coordinates (`lat`, `lng`), addresses, assigned agencies, and verification status. It also includes media metadata.
* **`tasks`**: Linked directly to `incidents`. This table breaks down an incident into actionable tasks assigned to specific agencies (e.g., "Clear debris on Road A").

### Communication & Intelligence
* **`bulletins`**: Broadcast messages sent by nodal officers to everyone in the system.
* **`intel_pins`**: Map-based notes dropped by different departments (e.g., Police marking a roadblock).
* **`alerts` & `alert_recipients`**: Manages geofenced emergency alerts sent to users and volunteers based on severity and radius.

### Monitoring & Resilience
* **`heartbeats`**: Tracks the online/offline status and last seen location of agency members in the field.
* **`offline_queue`**: A crucial table that handles offline syncing. If field workers lose the internet, their actions are temporarily queued here and synced once they reconnect.
* **`watchdog_status`**: Monitors if connected agencies are responsive.

---

## 4. 🔌 How the APIs Work
The Express backend exposes several RESTful API routes. All major routes (except login) are secured using an `authMiddleware`, meaning users must be logged in to access them. 

Here is how the API routes are structured and what they do:

* **`/auth`**: Handles user login and generates the JWT tokens for secure sessions.
* **`/incidents`**: Handles creating, updating, and fetching disaster incidents. Also handles media uploads related to incidents.
* **`/tasks`**: Manages the Kanban board tasks. Users can create tasks linked to incidents and update their status (e.g., New -> In Progress -> Completed).
* **`/volunteers` & `/resources`**: Manages the dispatch and tracking of people and equipment.
* **`/verify`**: Dedicated route for officers to verify reported incidents to prevent fake reporting.
* **`/ping` & `/status`**: Endpoints where the frontend sends continuous "heartbeats" to prove the user is online.
* **`/sync`**: The endpoint used by the frontend to push offline actions (like task updates made without internet) back to the server once the connection is restored.
* **`/bulletins` & `/intel`**: Used for fetching and posting system-wide announcements and map-based intelligence notes.

---

## 5. 📂 Project Structure 
If a new developer looks at the `backend/src/` folder, this is how it is structured:
* `/config`: Environment and global configuration variables.
* `/controllers`: Contains the core business logic (e.g., what exactly happens when a task is created).
* `/db`: Contains the database setup (`database.js`), seed data, and `schema.sql`.
* `/middlewares`: Security checkpoints (e.g., `auth.js` to check JWT tokens).
* `/models`: Database interaction logic.
* `/routes`: Maps URL endpoints (like `/tasks`) to their respective controllers.
* `app.js`: The main Express server file that ties all the routes and middlewares together.

---

## 6. 🛡️ Security & Middlewares
To keep the backend secure and stable, we implemented several custom middlewares:
* **`auth.js`**: Intercepts incoming requests, reads the `Authorization: Bearer <token>` header, and verifies the JWT. If the token is invalid, the request is blocked.
* **`requireRole.js`**: A secondary security layer. It ensures that only users with specific roles (e.g., 'admin', 'officer') can access sensitive routes like deleting an incident.
* **`errorHandler.js` & `asyncHandler.js`**: These ensure that if the server encounters a crash or a database error, it doesn't shut down. Instead, it catches the error and sends a clean JSON error message back to the frontend.

---

## 7. 📸 Media Uploads & Data Integrity
When field workers upload photos of a disaster (via `/incidents`):
1. **Multer** handles parsing the file from the frontend payload.
2. The file is saved locally in the `backend/src/uploads` directory.
3. The backend calculates a **SHA-256 Hash** of the file. This hash is saved in the database to guarantee the integrity of the image (proving the photo has not been tampered with after upload).

---

## 8. 📡 Offline Synchronization Workflow
Because disaster areas often lose cellular service, the backend is built to support offline syncing:
1. When a user goes offline, the frontend saves their actions (like verifying an incident) in its local storage.
2. Once the internet returns, the frontend sends a massive payload of all queued actions to the **`/sync`** API route.
3. The backend iterates through this payload, processes each action as if it were happening live, and updates the `offline_queue` table to mark those actions as `synced`.

---

## 9. 🧪 Testing Strategy
We set up a robust testing environment to ensure the API never breaks during an emergency:
* **Jest & Supertest**: We use these tools to simulate HTTP requests to our API.
* Test files are located in the `backend/tests/` folder. They automatically check if routes are secured properly and if the database is updating correctly when requests are made.

---

## 10. 📝 Sample API Payload Example
To help you understand how the API communicates, here is an example of what the frontend sends when creating a new map pin (Intel Pin):

**POST** `/intel`
```json
{
  "lat": 28.6139,
  "lon": 77.209,
  "department": "Police",
  "note": "Checkpoint established near the main junction."
}
```

---

## 11. 🤝 Onboarding for Future Developers
If you are taking over this project, simply navigate to the `backend` folder and run:
1. `npm install` (to install dependencies)
2. `npm run seed` (to populate the database with demo data)
3. `npm run dev` (to start the local server on port 4001)

*Note: The frontend expects this backend to be running on `http://localhost:4001`.*

---

*End of Report*
