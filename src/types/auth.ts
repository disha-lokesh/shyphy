export type UserRole = 'intern' | 'employee' | 'hr' | 'admin' | 'boss' | 'blue_team';

export interface User {
  username: string;
  password: string;
  role: UserRole;
  fullName: string;
  email: string;
  department: string;
  joinDate: string;
  employeeId: string;
  motherName?: string;
  dob?: string;
  emergencyPassword?: string;
  isBlocked: boolean;
  failedAttempts: number;
  lastLogin?: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  type: 'general' | 'urgent' | 'fte' | 'security';
  forRoles?: UserRole[];
}

export interface SecurityAlert {
  id: string;
  type: 'login_attempt' | 'brute_force' | 'nosqli' | 'unauthorized_access' | 'spam_attack';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  username: string;
  timestamp: Date;
  details?: string;
}

export interface SystemState {
  emergencyMode: boolean;
  fteLoginAvailable: boolean;
  blockedUsers: string[];
  securityLevel: 'normal' | 'elevated' | 'lockdown';
  announcements: Announcement[];
  securityAlerts: SecurityAlert[];
}
