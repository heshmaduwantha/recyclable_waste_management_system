import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AuthLayout } from '../layouts/AuthLayout';

import { Dashboard } from '../pages/Dashboard/Dashboard';
import { Pickups } from '../pages/Pickups/Pickups';
import { Pickers } from '../pages/Pickers/Pickers';
import { Customers } from '../pages/Customers/Customers';
import { Rewards } from '../pages/Rewards/Rewards';
import { Reports } from '../pages/Reports/Reports';
import { Settings } from '../pages/Settings/Settings';
import { Login } from '../pages/Login/Login';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'pickups', element: <Pickups /> },
      { path: 'pickers', element: <Pickers /> },
      { path: 'customers', element: <Customers /> },
      { path: 'rewards', element: <Rewards /> },
      { path: 'reports', element: <Reports /> },
      { path: 'settings', element: <Settings /> }
    ]
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> }
    ]
  }
]);
