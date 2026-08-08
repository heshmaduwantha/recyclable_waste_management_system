import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AuthLayout } from '../layouts/AuthLayout';

import { LandingPage } from '../pages/Landing/LandingPage';
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { Allocations } from '../pages/Allocations/Allocations';
import { Pickups } from '../pages/Pickups/Pickups';
import { Pickers } from '../pages/Pickers/Pickers';
import { Customers } from '../pages/Customers/Customers';
import { Rewards } from '../pages/Rewards/Rewards';
import { Reports } from '../pages/Reports/Reports';
import { Settings } from '../pages/Settings/Settings';
import { Login } from '../pages/Login/Login';

export const router = createBrowserRouter([
  // 1. Commercial Web Landing Page Route
  {
    path: '/',
    element: <LandingPage />
  },

  // 2. Purchased Admin Portal Dashboard Subroutes (/admin/*)
  {
    path: '/admin',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'allocations', element: <Allocations /> },
      { path: 'pickups', element: <Pickups /> },
      { path: 'pickers', element: <Pickers /> },
      { path: 'customers', element: <Customers /> },
      { path: 'rewards', element: <Rewards /> },
      { path: 'reports', element: <Reports /> },
      { path: 'settings', element: <Settings /> }
    ]
  },

  // 3. Backward Compatibility Alias Routes for Direct Admin Navigation
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'allocations', element: <Allocations /> },
      { path: 'pickups', element: <Pickups /> },
      { path: 'pickers', element: <Pickers /> },
      { path: 'customers', element: <Customers /> },
      { path: 'rewards', element: <Rewards /> },
      { path: 'reports', element: <Reports /> },
      { path: 'settings', element: <Settings /> }
    ]
  },

  // 4. Auth Routes
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> }
    ]
  },

  // Catch-all Fallback -> Redirect to Commercial Web Site
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);
