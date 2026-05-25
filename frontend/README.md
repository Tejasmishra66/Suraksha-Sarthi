# SDRF Helping Hands Frontend

Minimal React + Material UI web console for the SDRF Helping Hands backend.

## Stack
- React 18
- Vite
- Material UI
- Axios + React Router

## Setup
```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL` to your backend URL if it is not `http://localhost:4000`.

## Pages
- `/login` for JWT login
- `/` for summary dashboard
- `/tasks` for task board
- `/alerts` for incident pins
- `/volunteers` for volunteer and resource views
# SDRF Helping Hands Flutter Placeholder Frontend

Minimal Flutter placeholder for backend integration.

## Implemented Placeholder Screens
- Login screen
- Basic task list screen (fetches `/tasks`)
- Basic incident map list screen (fetches `/alerts` pins)

## Setup
1. Ensure Flutter SDK is installed.
2. Install dependencies:
```bash
cd frontend
flutter pub get
```
3. Run app:
```bash
flutter run
```

## Backend URL
The app points to `http://localhost:4000`. Update `ApiService` for emulator/device networking.
