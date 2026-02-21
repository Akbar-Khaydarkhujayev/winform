import api from "./axios";
import type {
  Camera,
  CamerasParams,
  PaginatedResponse,
  ExamObject,
  Device,
  CreateCameraRequest,
  CreateDeviceRequest,
} from "../types/cameras";

export const camerasApi = {
  getAll: async (params?: CamerasParams) => {
    const { data } = await api.get<PaginatedResponse<Camera>>("/Cameras", {
      params,
    });
    return data;
  },

  create: async (body: CreateCameraRequest) => {
    const { data } = await api.post<Camera>("/Cameras", body);
    return data;
  },

  delete: async (listenId: number, channelId: number) => {
    await api.delete(`/Cameras/${listenId}/${channelId}`);
  },
};

export const examObjectApi = {
  getAll: async () => {
    const { data } = await api.get<ExamObject[]>("/ExamObject");
    return data;
  },
};

export const devicesApi = {
  getAll: async () => {
    const { data } = await api.get<Device[]>("/Devices");
    return data;
  },

  create: async (body: CreateDeviceRequest) => {
    const { data } = await api.post<Device>("/Devices", body);
    return data;
  },

  delete: async (listenId: number) => {
    await api.delete(`/Devices/${listenId}`);
  },
};
