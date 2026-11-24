# ♻️ EcoCollect - Smart Recyclable Waste Management System

A scalable, feature-based monorepo platform designed for household recycling, eco-collector fleet routing, and municipal/admin waste oversight.

---

## 📁 Repository Structure

```text
eco-collect/
├── mobile-app/                # React Native (Expo) - Customer & Picker dual mobile experience
│   └── src/
│       ├── common/            # Reusable UI primitives (Button, Card, EmptyState, Header, Input)
│       ├── constants/         # API configuration
│       ├── hooks/             # Reusable data-fetching hooks
│       ├── navigation/        # RootNavigator, AuthNavigator, CustomerTabs, PickerTabs
│       ├── screens/           # Feature screens (auth, customer, picker, shared)
│       ├── services/          # API, auth, location, AI, pickup, customer, picker, reward, notification
│       └── store/             # AuthContext & PickupContext state providers
├── admin-web/                 # React + Vite - Admin Management Dashboard (Graphite Theme)
│   └── src/
│       ├── components/        # Header, Sidebar
│       ├── layouts/           # AuthLayout, DashboardLayout
│       ├── pages/             # Landing, Login, Dashboard, Allocations, Pickups, Pickers, Customers, Rewards, Reports, Settings
│       ├── router/            # React Router configuration
│       ├── services/          # REST API clients & session storage
│       └── theme/             # Admin color/design tokens
├── backend/                   # Express + TypeScript + PostgreSQL REST API
│   ├── src/
│   │   ├── config/            # PostgreSQL pool & password/domain utilities
│   │   ├── db/                # SQL schema & migration/seed runner
│   │   └── server.ts          # REST API endpoints (/api/v1/*)
│   └── tests/                 # End-to-end API QA suite
├── shared/                    # Shared TypeScript domain contracts & types
├── datasets/                  # Seed datasets (CSV, JSON, SQL, sample waste images)
├── scripts/                   # Dataset & sample image generation utilities
├── docs/                      # Architecture, calculations, QA report & dissertation
└── README.md
```

---

## 🎨 Theme Guidelines & Color Tokens

- **Customer App Theme**: Primary Emerald (`#10B981`), Accent Blue (`#2563EB`), Background White.
- **Picker App Theme**: Primary Ocean Blue (`#0284C7`), Accent Green (`#16A34A`), Background White.
- **Admin Portal Theme**: Primary Graphite (`#1E293B`), Secondary Slate (`#475569`), Background Light Grey (`#F8FAFC`).

---

## 🚀 Getting Started

### 1. Backend API (Express + PostgreSQL)
```bash
cd backend
npm install
npm run db:setup
npm run dev
```
Runs on [http://localhost:4000](http://localhost:4000) (`GET /api/v1/health`).

### 2. Admin Web Portal (React + Vite)
```bash
cd admin-web
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) to access the admin dashboard.

### 3. Mobile Application (React Native Expo)
```bash
cd mobile-app
npm install --legacy-peer-deps
npm run start
```
Runs Expo Metro & Web on [http://localhost:8081](http://localhost:8081).

### Run All Services Together (from root)
```bash
npm run dev
```

---

## 📱 Navigation & User Roles

- **Auth Flow**: Splash ➔ Onboarding ➔ Login ➔ Role Selection (Customer vs. Picker) ➔ OTP / Forgot Password.
- **Customer Portal**: Doorstep Pickup Requests, Live GPS Tracking, Eco-Wallet, Rewards Redemption Store, Badges & History.
- **Picker Portal**: Assigned Duty Jobs Queue, Job Details, Bluetooth Weight Scale Verification, Photo Proof Camera, Navigation.
