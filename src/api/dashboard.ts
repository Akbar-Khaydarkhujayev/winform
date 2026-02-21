import api from "./axios";
import type { DashboardData, DashboardParams } from "../types/dashboard";

export const dashboardApi = {
  getData: async (params: DashboardParams) => {
    const response = await api.get<DashboardData>("/Dashboard", {
      params: {
        region: params.region,
        date: params.date,
        ...(params.period != null && { period: params.period }),
      },
    });
    return response.data;
  },
};
