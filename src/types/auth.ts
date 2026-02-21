export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface User {
  id: number;
  username: string;
  name: string;
  photoPath: string;
  role: number;
  roleName: string;
  isActive: boolean;
  createdAt: string;
  lastLoginedAt: string;
}
