import type { ERegion } from "./enums";
import type { EGender } from "./enums";
import type { EExamingPeriod } from "./enums";

/* ── Student ── */
export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  certificateNumber: string;
  birthDate: string;
  gender: EGender;
  groupCode: string;
  examDate: string;
  examingPeriod: EExamingPeriod;
  region: ERegion;
  examObjectId: number;
  databaseId: number;
  photoPath: string;
  uid: string;
}

/* ── Query params ── */
export interface StudentsParams {
  Region?: number;
  ExamDateFrom?: string;
  ExamDateTo?: string;
  GroupCode?: string;
  CertificateNumber?: string;
  Gender?: number;
  ExamingPeriod?: number;
  q?: string;
  page?: number;
  pageSize?: number;
}

/* ── Create request body ── */
export interface CreateStudentRequest {
  firstName: string;
  lastName: string;
  certificateNumber: string;
  birthDate: string;
  gender: number;
  groupCode: string;
  examDate: string;
  examingPeriod: number;
  listenId: string;
}

/* ── Paginated response (reuse shape) ── */
export interface PaginatedStudentsResponse {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  items: Student[];
}
