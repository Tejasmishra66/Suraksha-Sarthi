# Web Integration Guide

This document explains how the React frontend interacts with the Express backend and lists example API payloads.

Base API: `http://localhost:4000`

Auth
- POST `/auth/login` — body: `{ "email": "officer@sdrf.local", "password": "password123" }`

Tasks
- GET `/tasks` — returns list of tasks
- POST `/tasks` — create task (see sample in backend README)
- PATCH `/tasks/:id` — update status or assignedAgency

Alerts
- GET `/alerts` — returns pins for map
- POST `/alerts` — create alert with `{disasterType, lat, lng, radiusKm, severity}`

Volunteers
- GET `/volunteers` — list volunteers
- POST `/volunteers/broadcast` — body `{ lat, lng, radiusKm, skills: [] }`

Media Uploads
- POST `/incidents/:id/media` — multipart/form-data with fields `file` and `metadata` (JSON) including `lat`, `lng`, `timestamp`
