// src/api/types.ts

// 🟢 New Enum Types from Prisma Schema
export enum Zone {
  ER = "ER",
  ICU = "ICU",
  WARD1 = "WARD1",
  WARD2 = "WARD2",
  OPD = "OPD",
  LAB = "LAB",
  PHARMACY = "PHARMACY",
  RECEPTION = "RECEPTION",
  THEATER = "THEATER",
  CAFETERIA = "CAFETERIA",
  ADMIN_OFFICE = "ADMIN_OFFICE",
  TRIAGE = "TRIAGE",
}

export enum Role {
  ADMIN = "ADMIN",
  DOCTOR = "DOCTOR",
  NURSE = "NURSE",
}

export enum PatientStatus {
  WAITING = "WAITING",
  IN_TREATMENT = "IN_TREATMENT",
  DISCHARGED = "DISCHARGED",
}

export enum ShiftStatus {
  PENDING = "PENDING",
  ASSIGNED = "ASSIGNED",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

// 🟢 User-Related Types
export interface UserCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  phone: string;
  bio?: string;
  address?: string;
  specialty?: string;
  avatarUrl?: string;
  currentLocation?: Zone;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  role: Role;
  name: string;
  specialty?: string | null;
  avatarUrl?: string | null;
}

export interface UpdateUserPayload {
  email?: string;
  password?: string;
  role?: Role;
  name?: string;
  specialty?: string | null;
  avatarUrl?: string | null;
  phone?: string | null;
  bio?: string | null;
  address?: string | null;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

// 🟢 Department-Related Types
export interface Department {
  id: string;
  name: string;
  capacity: number;
  shiftLength: number; // 🟢 New field from schema
}

export interface DepartmentWithPatientCount {
  id: string;
  name: string;
  capacity: number;
  _count: {
    patients: number;
  };
}

// 🟢 Shift-Related Types
export interface Shift {
  id: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  status: ShiftStatus; // 🟢 New field from schema
  notes?: string; // 🟢 New field from schema
  user: User; // User object will have full fields
  department: Department; // Department object will have full fields
}

// 🟢 Patient-Related Types
export interface Patient {
  id: string;
  name: string;
  status: PatientStatus; // 🟢 Using the new PatientStatus enum
  createdAt: string;
  updatedAt: string;
  department: Department; // Department object will have full fields
}

// 🟢 Alert-Related Types
export interface Alert {
  id: string;
  type: string;
  message: string;
  resolved: boolean;
  createdAt: string;
  updatedAt: string;
}

// 🟢 EventLog-Related Types
export interface EventLog {
  id: string;
  userId?: string;
  action: string;
  details?: string;
  createdAt: string;
}

// 🟢 New Types for the new models
export interface Availability {
  id: string;
  userId: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PatientAssignment {
  id: string;
  patientId: string;
  userId: string;
  shiftId?: string;
  startTime: string;
  endTime?: string;
  status: string;
  createdAt: string;
}

// 🟢 Additional Utility Types for the Frontend
export interface PaginationResponse<T> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  sortBy: string;
  order: "asc" | "desc";
  data: T[];
}

export interface StaffUtilizationItem {
  time: string;
  doctors: number;
  nurses: number;
  total: number;
}

export interface PatientCongestionItem {
  department: string;
  current: number;
  capacity: number;
  percentage: number;
}

export interface StaffDistributionItem {
  role: string;
  count: number;
  percentage: number;
}

export interface KeyMetricsData {
  avgWaitTime: number;
  staffEfficiency: number;
  patientThroughput: number;
  alertsResolved: number;
}

export interface AnalyticsData {
  staffUtilization: StaffUtilizationItem[];
  patientCongestion: PatientCongestionItem[];
  staffDistribution: StaffDistributionItem[];
  keyMetrics: KeyMetricsData;
}

export interface Notification {
  id: number;
  type: "success" | "info" | "error";
  message: string;
  timestamp: string;
}
