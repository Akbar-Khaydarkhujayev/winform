export interface DashboardData {
  totalStudents: number;
  totalEvents: number;
  totalCameras: number;
  totalDevices: number;
  totalExamObjects: number;
  totalMaleStudents: number;
  totalFemaleStudents: number;
  totalMaleEvents: number;
  totalFemaleEvents: number;
  totalActiveDevices: number;
  totalInactiveDevices: number;
  totalActiveCameras: number;
  totalInactiveCameras: number;
  totalActiveExamObjects: number;
  totalInactiveExamObjects: number;
  totalOnTimeEvents: number;
  totalLateEvents: number;
  totalEarlyEvents: number;
}

export interface DashboardParams {
  region: number;
  date: string;
  period: number | null;
}

export interface SignalREvent {
  certificateNumber: string;
  eventDate: string;
  similarity: number;
  faceImageBase64: string;
  fullImageBase64: string;
  firstName: string;
  lastName: string;
  gender: number;
  birthDate: string;
  regionId: number;
  attendanceStatus: number;
  examingPeriod: number;
  isCrossRegion: boolean;
  currentRegion: number | null;
  expectedRegion: number;
  dbImagePath: string;
  faceImagePath: string;
  fullImagePath: string;
  panoramaImagePath: string;
}
