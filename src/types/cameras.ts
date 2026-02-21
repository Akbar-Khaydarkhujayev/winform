import type { ERegion } from "./enums";

/* ── Camera ── */
export interface Camera {
  id: number;
  deviceId: number;
  deviceIp: string;
  deviceIsOnline: boolean;
  existsInIntegrator: boolean;
  name: string;
  ip: string;
  port: number;
  username: string;
  serialNumber: string;
  channelId: number;
  description: string;
  latitude: number;
  longitude: number;
  status: number;
  region: ERegion;
  examObjectId: number;
}

export interface CamerasParams {
  Region?: number;
  ExamObjectId?: number;
  DeviceId?: number;
  Status?: number;
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateCameraRequest {
  listenId: number;
  examObjectId: number;
  ip: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  port: number;
  sn: string;
  username: string;
  password: string;
  remoteChannel: number;
}

export interface PaginatedResponse<T> {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  items: T[];
}

/* ── Exam Object ── */
export interface ExamObjectCamera {
  id: number;
  deviceId: number;
  name: string;
  channelId: number;
  serialNumber: string;
  status: number;
  region: ERegion;
}

export interface ExamObject {
  id: number;
  name: string;
  description: string;
  groupCode: string;
  regionId: number;
  regionName: string;
  cameras: ExamObjectCamera[];
}

/* ── Device ── */
export interface DeviceIvss {
  address: string;
  port: number;
  username: string;
}

export interface Device {
  id: number;
  title: string;
  listenId: number;
  alarmUrl: string;
  type: number;
  ivss: DeviceIvss;
}

export interface CreateDeviceRequest {
  title: string;
  listen: number;
  alarmUrl: string;
  type: number;
  ivss: {
    address: string;
    port: number;
    username: string;
    password: string;
  };
}
