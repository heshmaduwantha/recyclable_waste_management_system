# EcoCollect

Recyclable collection system with React admin/customer web, Expo customer/picker mobile, Express API and PostgreSQL. Telecom reload and Gemini photo classification are excluded from the current scope.

## Local demo

- Web: http://localhost:5173
- Mobile browser preview / Expo Metro: http://localhost:8081
- API health: http://localhost:4000/health
- PostgreSQL: 127.0.0.1:55432, database ecocollect

Demo accounts: admin@ecocollect.lk, customer@ecocollect.lk, picker@ecocollect.lk. The password is the local backend/.env DEMO_PASSWORD value. These are explicitly local demo accounts; choose different credentials for a deployed environment.

For this prepared Mac workspace, restart with `./scripts/start-local.sh`. Logs are stored under ignored work/logs.

## Setup

Use Node 22 LTS (or Node >=20.19.4), npm and PostgreSQL 16. Run npm ci in backend, admin-web and mobile-app. Configure backend/.env from backend/.env.example and create the database. Run `npm run seed` in backend to apply migrations and create demo accounts. The API applies its idempotent schema on startup as well.

Run services in separate terminals:

```
cd backend
npm run dev
```

```
cd admin-web
npm run dev
```

```
cd mobile-app
npm start -- --web
```

For a phone, use the Expo QR on the same LAN. The API host is inferred from the Expo development host; EXPO_PUBLIC_API_URL overrides it. Camera, location and notifications need device permissions. Android Google Maps opens through a universal Maps URL. The browser preview uses browser location and image upload. Browser location requires localhost or HTTPS; use the native phone app for LAN GPS testing.

## Firebase push

In-app job notifications and five-second active-screen updates work locally. Native background Android push additionally needs a Firebase project: set GOOGLE_APPLICATION_CREDENTIALS on the API, add mobile-app/google-services.json and reference it as expo.android.googleServicesFile in app.json, then build an Expo development client (`eas build --profile development --platform android`). Remote push is unavailable in Expo Go. No Firebase credentials were supplied, so actual FCM delivery is not verified. iOS push delivery is outside this verified Android prototype.

## Checks

- backend: npm run build, npm test (API must be running and DEMO_PASSWORD must match seeded accounts)
- admin-web: npm run build
- mobile-app: npx tsc --noEmit, npx expo export --platform web

Integration tests use PostgreSQL and check role isolation, photo requirement, GPS review, concurrent completion, unique wallet credit and badges. Temporary test records are removed after the test.

## Deployment

Use an HTTPS reverse proxy for the API and web, a managed PostgreSQL instance or backed-up PostgreSQL service, persistent photo storage, explicit CORS_ORIGINS and a private JWT secret. Build admin-web with VITE_API_URL pointing to the hosted API if it is on a different origin. Set EXPO_PUBLIC_API_URL before a mobile build. Rate limiting currently applies per API instance; use a shared limiter when horizontally scaling.

Architecture and data flow: docs/architecture.md. The original screens remain in Git history. Generated dependencies and build output are no longer version controlled.

## Android emulator on Mac and Windows

See [lightweight emulator setup](docs/emulator-setup.md). Run `npm run emulator:doctor`, then `npm run emulator:setup`, then `npm run emulator:start`. The installer checks disk space first. Windows double-click launchers are under scripts/.
