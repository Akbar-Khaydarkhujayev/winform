import api from "./axios";
import type {
  Student,
  StudentsParams,
  PaginatedStudentsResponse,
  CreateStudentRequest,
} from "../types/students";

export const studentsApi = {
  getAll: async (params?: StudentsParams) => {
    const { data } = await api.get<PaginatedStudentsResponse>("/Students", {
      params,
    });
    return data;
  },

  getById: async (id: number) => {
    const { data } = await api.get<Student>(`/Students/${id}`);
    return data;
  },

  create: async (body: CreateStudentRequest) => {
    const { data } = await api.post<Student>("/Students", body);
    return data;
  },

  delete: async (id: number) => {
    await api.delete(`/Students/${id}`);
  },
};
