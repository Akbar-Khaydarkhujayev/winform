import api from "./axios";
import type { LoginRequest, User } from "../types/auth";

export const authApi = {
  login: async (data: LoginRequest) => {
    const response = await api.post<{ accessToken: string }>(
      "/Users/login",
      data,
    );
    return response.data;
  },

  getMe: async () => {
    const response = await api.get<User>("/Users/me");
    return response.data;
  },

  logout: async () => {
    await api.post("/Users/logout");
  },
};
