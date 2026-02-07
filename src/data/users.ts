import { User } from '@/types/auth';

// Initial user database - this will be managed in context for reactivity
export const initialUsers: User[] = [
  {
    username: 'intern_001',
    password: 'Password@123',
    role: 'intern',
    fullName: 'Raj Kumar',
    email: 'raj.kumar@shiphy.com',
    department: 'Development',
    joinDate: '2024-01-15',
    employeeId: 'INT-2024-001',
    isBlocked: false,
    failedAttempts: 0,
  },
  {
    username: 'emp_001',
    password: 'EmpPass@456',
    role: 'employee',
    fullName: 'Priya Sharma',
    email: 'priya.sharma@shiphy.com',
    department: 'Engineering',
    joinDate: '2022-06-01',
    employeeId: 'EMP-2022-045',
    isBlocked: false,
    failedAttempts: 0,
  },
  {
    username: 'hr_team',
    password: 'HR@9999',
    role: 'hr',
    fullName: 'HR Department',
    email: 'hr@shiphy.com',
    department: 'Human Resources',
    joinDate: '2020-01-01',
    employeeId: 'HR-2020-001',
    isBlocked: false,
    failedAttempts: 0,
  },
  {
    username: 'admin_abhishek',
    password: 'Admin@123',
    role: 'admin',
    fullName: 'Abhishek Shemadi',
    email: 'abhishek.shemadi@shiphy.com',
    department: 'Administration',
    joinDate: '2019-03-22',
    employeeId: 'ADM-2019-001',
    motherName: 'SHEETAL',
    dob: '22031985', // March 22, 1985
    emergencyPassword: 'SHEE22031985', // First 4 letters of mother's name + DOB
    isBlocked: false,
    failedAttempts: 0,
  },
  {
    username: 'boss',
    password: '1@mth3bossPr@k@5h',
    role: 'boss',
    fullName: 'Prakash Deshmukh',
    email: 'ceo@shiphy.com',
    department: 'Executive',
    joinDate: '2018-01-01',
    employeeId: 'CEO-2018-001',
    emergencyPassword: '58913022EEHS', // Only blue team knows this
    isBlocked: false,
    failedAttempts: 0,
  },
  {
    username: 'blue_team_lead',
    password: 'BlueTeam@2026',
    role: 'blue_team',
    fullName: 'Blue Team Lead',
    email: 'security@shiphy.com',
    department: 'Security Operations',
    joinDate: '2021-01-01',
    employeeId: 'SEC-2021-001',
    isBlocked: false,
    failedAttempts: 0,
  },
];

// NoSQLi vulnerable endpoint simulation data - intentionally exposable
// <!-- DEBUG: Employee credentials for testing: emp_001 / EmpPass@456 -->
export const vulnerableEndpointData = {
  users: [
    { _id: 'usr_002', username: 'emp_001', password: 'EmpPass@456', role: 'employee' },
  ],
};
