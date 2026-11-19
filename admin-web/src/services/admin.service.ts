import { apiCall } from './api';

export interface AdminDashboardStats {
  totalPickups: number;
  wasteCollectedKg: number;
  totalCustomers: number;
  ecoPointsIssued: number;
  recycledRate: string;
  totalPickupsChange: string;
  wasteCollectedChange: string;
  customersChange: string;
  pointsChange: string;
}

export interface MonthlyChartItem {
  month: string;
  plastic: number;
  paper: number;
  glass: number;
}

export interface FleetStatusData {
  activeDrivers: number;
  totalDrivers: number;
  pendingPickups: number;
}

export interface ESGReportItem {
  label: string;
  value: string;
  note: string;
}

export const adminService = {
  getDashboardStats: () => apiCall<AdminDashboardStats>('/admin/stats'),
  getMonthlyChartData: () => apiCall<MonthlyChartItem[]>('/admin/charts/monthly-waste'),
  getFleetStatus: () => apiCall<FleetStatusData>('/admin/fleet-status'),
  getReports: () => apiCall<ESGReportItem[]>('/admin/reports'),
};
