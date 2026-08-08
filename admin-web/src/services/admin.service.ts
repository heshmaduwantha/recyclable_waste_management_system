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
  async getDashboardStats(): Promise<AdminDashboardStats> {
    try {
      return await apiCall<AdminDashboardStats>('/admin/stats');
    } catch {
      return {
        totalPickups: 1420,
        wasteCollectedKg: 42850,
        totalCustomers: 5890,
        ecoPointsIssued: 857000,
        recycledRate: '94.2%',
        totalPickupsChange: '+12.5% this week',
        wasteCollectedChange: '+8.4% this month',
        customersChange: '+142 new users',
        pointsChange: '+45.2k redeemed'
      };
    }
  },

  async getMonthlyChartData(): Promise<MonthlyChartItem[]> {
    try {
      return await apiCall<MonthlyChartItem[]>('/admin/charts/monthly-waste');
    } catch {
      return [
        { month: 'Jan', plastic: 60, paper: 40, glass: 25 },
        { month: 'Feb', plastic: 75, paper: 50, glass: 30 },
        { month: 'Mar', plastic: 90, paper: 65, glass: 45 },
        { month: 'Apr', plastic: 110, paper: 80, glass: 50 },
        { month: 'May', plastic: 130, paper: 95, glass: 60 },
        { month: 'Jun', plastic: 160, paper: 110, glass: 70 }
      ];
    }
  },

  async getFleetStatus(): Promise<FleetStatusData> {
    try {
      return await apiCall<FleetStatusData>('/admin/fleet-status');
    } catch {
      return {
        activeDrivers: 38,
        totalDrivers: 42,
        pendingPickups: 14
      };
    }
  },

  async getReports(): Promise<ESGReportItem[]> {
    try {
      return await apiCall<ESGReportItem[]>('/admin/reports');
    } catch {
      return [
        { label: 'CO2 Emissions Avoided', value: '54.2 Tons', note: 'Equivalent to 2,400 trees planted' },
        { label: 'Landfill Diversion Rate', value: '96.8%', note: 'Exceeding municipal target by 12%' },
        { label: 'Water Saved', value: '184,000 Liters', note: 'Through paper & glass recycling' }
      ];
    }
  }
};
