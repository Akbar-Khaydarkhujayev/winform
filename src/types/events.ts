import type { ERegion } from "./enums";
import type { EGender } from "./enums";
import type { EExamingPeriod } from "./enums";

export interface EventItem {
  id: number;
  certificateNumber: string;
  similarity: number;
  eventDate: string;
  cameraId: number;
  cameraName: string;
  cameraRegion: ERegion;
  studentId: number;
  studentFirstName: string;
  studentLastName: string;
  studentGender: EGender;
  studentBirthDate: string;
  studentExamDate: string;
  studentGroupCode: string;
  studentPhotoUrl: string;
  isCrossRegion: boolean;
  regionAlertMessage: string;
  attendanceStatus: number;
  examingPeriod: EExamingPeriod;
  region: ERegion;
  faceImageUrl: string;
  fullImageUrl: string;
  panoramaImageUrl: string;
}

export interface EventsParams {
  region?: number;
  page?: number;
  pageSize?: number;
}

export interface PaginatedEventsResponse {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  items: EventItem[];
}
