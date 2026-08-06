# ♻️ EcoCollect - Smart Recyclable Waste Management System

A scalable, feature-based monorepo platform designed for household recycling, eco-collector fleet routing, and municipal/admin waste oversight.

---

## 📁 Repository Structure

```text
eco-collect/
│
├── mobile-app/                # React Native (Expo) - Customer & Picker dual mobile experience
├── admin-web/                 # React + Vite - Admin Management Dashboard (Graphite Theme)
├── backend/                   # NestJS Backend Microservice (API Endpoints)
├── shared/                    # Shared TypeScript domain contracts & types
├── docs/                      # Project documentation and specifications
├── AGENTS.md                  # Development rules & guidelines
└── README.md
```

---

## 🎨 Theme Guidelines & Color Tokens

- **Customer App Theme**: Primary Blue (`#2563EB`), Secondary Sky Blue (`#38BDF8`), Background White.
- **Picker App Theme**: Primary Green (`#16A34A`), Secondary Light Green (`#4ADE80`), Background White.
- **Admin Portal Theme**: Primary Graphite (`#1E293B`), Secondary Slate (`#475569`), Background Light Grey (`#F8FAFC`).

---

## 🚀 Getting Started

### 1. Admin Web Portal (React + Vite)
```bash
cd admin-web
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access the admin dashboard.

### 2. Mobile Application (React Native Expo)
```bash
cd mobile-app
npm install
npm run start
```

---

## 📱 Navigation & User Roles

- **Auth Flow**: Splash ➔ Onboarding ➔ Login ➔ Role Selection (Customer vs. Picker) ➔ OTP / Forgot Password.
- **Customer Portal**: Doorstep Pickup Requests, Live GPS Tracking, Eco-Wallet, Rewards Redemption Store, Badges & History.
- **Picker Portal**: Assigned Duty Jobs Queue, Job Details, Bluetooth Weight Scale Verification, Photo Proof Camera, Navigation.
