# EcoCollect System Architecture & Feature-Based Design

EcoCollect is structured as a modular monorepo with a single shared domain contract layer (`shared/types/`) consumed by three independent runtime applications.

## 1. High-Level Architecture

```text
┌──────────────────────────┐     ┌──────────────────────────┐
│   mobile-app (Expo RN)   │     │  admin-web (React Vite)  │
│  Customer & Picker Apps  │     │  Admin Ops & Analytics   │
│   http://localhost:8081  │     │   http://localhost:5173  │
└────────────┬─────────────┘     └────────────┬─────────────┘
             │         REST + JWT             │
             └───────────────┬────────────────┘
                             ▼
             ┌───────────────────────────────┐
             │  backend (Express + TS API)   │
             │    http://localhost:4000      │
             └───────────────┬───────────────┘
                             │ pg Pool
                             ▼
             ┌───────────────────────────────┐
             │     PostgreSQL 16 Database    │
             │       127.0.0.1:5432          │
             └───────────────────────────────┘
```

## 2. Workspace Modules

| Directory | Role | Entry Point |
| --- | --- | --- |
| `shared/types/` | Shared domain TypeScript interfaces (`User`, `Pickup`, `Wallet`, `Reward`, `Badge`) | `shared/types/index.ts` |
| `backend/src/` | Express REST API (`/api/v1/*`), JWT auth, PostgreSQL schema & seeding | `backend/src/server.ts` |
| `admin-web/src/` | Operations portal (Dashboard, Allocations, Pickups, Pickers, Customers, Rewards, Reports, Settings) | `admin-web/src/main.tsx` |
| `mobile-app/src/` | Dual-role Customer & Picker Expo app with live GPS reverse geocoding and AI scanner | `mobile-app/App.tsx` |
| `datasets/` | Seed CSV/JSON/SQL fixtures and sample recyclable waste images | `datasets/README.md` |
| `scripts/` | Dataset & sample image generator scripts | `scripts/generate_datasets.js` |

## 3. Layering Conventions

- **Presentation (`screens/`, `pages/`, `components/`, `common/`, `layouts/`)**: UI components and screens grouped by user role (`auth`, `customer`, `picker`, `shared`) or feature page.
- **Navigation / Routing (`navigation/`, `router/`)**: Role-gated navigation stacks (`RootNavigator` → `AuthNavigator` / `CustomerTabs` / `PickerTabs`) and React Router definitions.
- **State & Hooks (`store/`, `hooks/`)**: React Context providers (`AuthContext`, `PickupContext`) exported via `store/index.ts`, plus reusable API data hooks (`useApiData`).
- **Services (`services/`)**: Thin, typed API and device-integration clients (`api.ts`, `session.ts`, `auth.service.ts`, `location.service.ts`, `ai.service.ts`, domain resource services).
- **Backend (`config/`, `db/`, `server.ts`)**: Centralized PostgreSQL pool & password hashing (`config/db.ts`), idempotent SQL schema & seed runner (`db/schema.sql`, `db/setup.ts`), and versioned `/api/v1` endpoints.
