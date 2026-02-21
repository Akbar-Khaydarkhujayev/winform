import api from "./axios";
import type { EventsParams, PaginatedEventsResponse } from "../types/events";

export const eventsApi = {
  getAll: async (params?: EventsParams) => {
    const { data } = await api.get<PaginatedEventsResponse>("/Events", {
      params,
    });
    return data;
  },
};
