import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User, UserRole, Announcement, SecurityAlert, SystemState } from '@/types/auth';
import { initialUsers } from '@/data/users';
import { toast } from 'sonner';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  systemState: SystemState;
  login: (username: string, password: string, isEmergency?: boolean) => { success: boolean; message: string };
  logout: () => void;
  blockUser: (username: string) => void;
  unblockUser: (username: string) => void;
  kickAllUsers: () => void;
  triggerEmergencyMode: () => void;
  disableEmergencyMode: () => void;
  enableFteLogin: () => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'timestamp'>) => void;
  addSecurityAlert: (alert: Omit<SecurityAlert, 'id' | 'timestamp'>) => void;
  clearSecurityAlerts: () => void;
  updateSecurityLevel: (level: 'normal' | 'elevated' | 'lockdown') => void;
  verifyOtp: (otp: string) => boolean;
  currentOtp: string;
  otpSeed: number;
  otpAttempts: number;
  maxOtpAttempts: number;
  setMaxOtpAttempts: (attempts: number) => void;
  otpCooldown: number;
  generateNewOtp: () => void;
  hrVerified: boolean;
  setHrVerified: (verified: boolean) => void;
  // Upload system
  uploadUnlocked: boolean;
  uploadWindowExpiry: number | null;
  uploadAttempted: boolean;
  verifyCtfFlag: (flag: string) => boolean;
  completeUpload: (file: File) => { success: boolean; message: string };
  resetUploadSystem: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('shiphy_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('shiphy_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [systemState, setSystemState] = useState<SystemState>(() => {
    const saved = localStorage.getItem('shiphy_system_state');
    return saved ? JSON.parse(saved) : {
      emergencyMode: false,
      fteLoginAvailable: false,
      blockedUsers: [],
      securityLevel: 'normal',
      announcements: [],
      securityAlerts: [],
    };
  });

  const [currentOtp, setCurrentOtp] = useState<string>('');
  const [otpSeed, setOtpSeed] = useState<number>(0);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [maxOtpAttempts, setMaxOtpAttempts] = useState(1); // Default to 1 - can be modified via console
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [hrVerified, setHrVerified] = useState(false);

  // CTF Upload System State
  const [uploadUnlocked, setUploadUnlocked] = useState(false);
  const [uploadWindowExpiry, setUploadWindowExpiry] = useState<number | null>(null);
  const [ctfFlag, setCtfFlag] = useState<string>('');
  const [uploadAttempted, setUploadAttempted] = useState(false);

  // Deterministic OTP Formula - CTF Challenge
  // The formula: seed * 7 + 13 * (seed % 100) + 42, then mod 900000 + 100000
  const calculateOtpFromSeed = useCallback((seed: number): string => {
    // Formula exposed in console for reverse engineering
    const result = ((seed * 7) + (13 * (seed % 100)) + 42) % 900000 + 100000;
    return result.toString().slice(0, 6);
  }, []);

  // Generate OTP with deterministic formula
  const generateNewOtp = useCallback(() => {
    const seed = Math.floor(Date.now() / 1000); // Seed based on current timestamp (seconds)
    setOtpSeed(seed);
    const otp = calculateOtpFromSeed(seed);
    setCurrentOtp(otp);
    setOtpAttempts(0);
    
    // CTF Hints in console
    console.log(`[SHIPHY 2FA] Secure OTP generated using proprietary algorithm`);
    console.log(`[SHIPHY 2FA] Seed: ${seed}`);
    console.log(`[SHIPHY DEBUG] Formula loaded from: /secure/otp-algo.js`);
    
    // "Hidden" formula hint - visible if you look closely
    console.log(`%c[DEV] OTP Formula: seed*7 + 13*(seed%100) + 42 mod 900000 + 100000`, 'color: #333; font-size: 10px;');
  }, [calculateOtpFromSeed]);

  // Generate CTF flag
  const generateCtfFlag = useCallback(() => {
    const flagBase = 'SHIPHY{upld_';
    const timestamp = Math.floor(Date.now() / 10000); // Changes every 10 seconds
    const hash = ((timestamp * 31337) % 9999).toString().padStart(4, '0');
    const flag = `${flagBase}${hash}}`;
    setCtfFlag(flag);
    console.log(`[CTF] Challenge flag refreshed. Complete the challenges to obtain.`);
    return flag;
  }, []);

  // Verify CTF flag and unlock upload
  const verifyCtfFlag = useCallback((submittedFlag: string): boolean => {
    const currentFlag = ctfFlag || generateCtfFlag();
    
    if (submittedFlag === currentFlag) {
      setUploadUnlocked(true);
      const expiry = Date.now() + 10000; // 10 second window
      setUploadWindowExpiry(expiry);
      setUploadAttempted(false);
      
      console.log(`[CTF] Flag verified! Upload window open for 10 seconds.`);
      
      // Auto-close after 10 seconds
      setTimeout(() => {
        setUploadUnlocked(false);
        setUploadWindowExpiry(null);
        generateCtfFlag(); // Reset flag
        console.log(`[CTF] Upload window expired. Flag invalidated.`);
      }, 10000);
      
      return true;
    }
    
    return false;
  }, [ctfFlag, generateCtfFlag]);

  // Complete upload (single use)
  const completeUpload = useCallback((file: File): { success: boolean; message: string } => {
    if (!uploadUnlocked) {
      return { success: false, message: 'Upload is disabled. Complete CTF challenges first.' };
    }
    
    if (uploadAttempted) {
      return { success: false, message: 'Upload already attempted. Window closed.' };
    }
    
    if (Date.now() > (uploadWindowExpiry || 0)) {
      setUploadUnlocked(false);
      return { success: false, message: 'Upload window expired.' };
    }
    
    // Validate file
    if (file.type !== 'application/pdf') {
      return { success: false, message: 'Invalid file type. Only PDF accepted.' };
    }
    
    if (!file.name.match(/^FTE_Candidates_\d{4}\.pdf$/)) {
      return { success: false, message: 'Invalid filename. Expected format: FTE_Candidates_YYYY.pdf' };
    }
    
    setUploadAttempted(true);
    setUploadUnlocked(false);
    setUploadWindowExpiry(null);
    
    // Add success announcement
    addAnnouncement({
      title: 'FTE Candidate List Updated',
      message: 'The Full-Time Employment candidate list has been updated by the administrator.',
      type: 'fte',
    });
    
    return { success: true, message: 'File uploaded successfully! FTE list updated.' };
  }, [uploadUnlocked, uploadAttempted, uploadWindowExpiry]);

  // Reset upload system (for Blue Team)
  const resetUploadSystem = useCallback(() => {
    setUploadUnlocked(false);
    setUploadWindowExpiry(null);
    setUploadAttempted(false);
    generateCtfFlag();
    console.log(`[SYSTEM] Upload system reset by Blue Team.`);
  }, [generateCtfFlag]);

  // Verify OTP
  const verifyOtp = useCallback((otp: string): boolean => {
    if (otpCooldown > 0) {
      toast.error(`Please wait ${otpCooldown} seconds before trying again`);
      return false;
    }

    if (otpAttempts >= maxOtpAttempts) {
      toast.error('Maximum OTP attempts exceeded. Please wait 30 seconds.');
      setOtpCooldown(30);
      const interval = setInterval(() => {
        setOtpCooldown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setOtpAttempts(0);
            generateNewOtp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return false;
    }

    setOtpAttempts(prev => prev + 1);

    if (otp === currentOtp) {
      setHrVerified(true);
      return true;
    }

    toast.error(`Invalid OTP. ${maxOtpAttempts - otpAttempts - 1} attempts remaining.`);
    return false;
  }, [currentOtp, otpAttempts, maxOtpAttempts, otpCooldown, generateNewOtp]);

  // Persist state
  useEffect(() => {
    localStorage.setItem('shiphy_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('shiphy_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('shiphy_system_state', JSON.stringify(systemState));
  }, [systemState]);

  const login = useCallback((username: string, password: string, isEmergency = false): { success: boolean; message: string } => {
    const user = users.find(u => u.username === username);

    if (!user) {
      addSecurityAlert({
        type: 'login_attempt',
        severity: 'low',
        message: `Failed login attempt for non-existent user: ${username}`,
        username,
        details: 'User not found in database',
      });
      return { success: false, message: 'Invalid credentials' };
    }

    if (user.isBlocked || systemState.blockedUsers.includes(username)) {
      addSecurityAlert({
        type: 'unauthorized_access',
        severity: 'medium',
        message: `Blocked user attempted login: ${username}`,
        username,
      });
      return { success: false, message: 'Account is blocked. Contact administrator.' };
    }

    // Emergency mode - require emergency password for higher roles
    if (systemState.emergencyMode && (user.role === 'admin' || user.role === 'boss')) {
      if (isEmergency) {
        if (password === user.emergencyPassword) {
          setCurrentUser(user);
          setUsers(prev => prev.map(u => 
            u.username === username ? { ...u, lastLogin: new Date().toISOString(), failedAttempts: 0 } : u
          ));
          return { success: true, message: 'Emergency login successful' };
        }
        return { success: false, message: 'Invalid emergency password' };
      }
      return { success: false, message: 'Emergency mode active. Use emergency password.' };
    }

    // Normal password check
    if (password === user.password) {
      // HR requires 2FA
      if (user.role === 'hr') {
        generateNewOtp();
        return { success: true, message: '2FA_REQUIRED' };
      }
      
      setCurrentUser(user);
      setUsers(prev => prev.map(u => 
        u.username === username ? { ...u, lastLogin: new Date().toISOString(), failedAttempts: 0 } : u
      ));
      return { success: true, message: 'Login successful' };
    }

    // Failed attempt
    setUsers(prev => prev.map(u => 
      u.username === username ? { ...u, failedAttempts: u.failedAttempts + 1 } : u
    ));

    const updatedUser = users.find(u => u.username === username);
    if (updatedUser && updatedUser.failedAttempts >= 4) {
      addSecurityAlert({
        type: 'brute_force',
        severity: 'high',
        message: `Possible brute force attack detected on: ${username}`,
        username,
        details: `${updatedUser.failedAttempts + 1} failed attempts`,
      });
    }

    return { success: false, message: 'Invalid credentials' };
  }, [users, systemState, generateNewOtp]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setHrVerified(false);
  }, []);

  const blockUser = useCallback((username: string) => {
    setSystemState(prev => ({
      ...prev,
      blockedUsers: [...prev.blockedUsers, username],
    }));
    setUsers(prev => prev.map(u => 
      u.username === username ? { ...u, isBlocked: true } : u
    ));
    addSecurityAlert({
      type: 'unauthorized_access',
      severity: 'medium',
      message: `User blocked by Blue Team: ${username}`,
      username,
    });
  }, []);

  const unblockUser = useCallback((username: string) => {
    setSystemState(prev => ({
      ...prev,
      blockedUsers: prev.blockedUsers.filter(u => u !== username),
    }));
    setUsers(prev => prev.map(u => 
      u.username === username ? { ...u, isBlocked: false } : u
    ));
  }, []);

  const kickAllUsers = useCallback(() => {
    setCurrentUser(null);
    setHrVerified(false);
    toast.error('SECURITY ALERT: All sessions terminated. Please login with emergency credentials.');
  }, []);

  const triggerEmergencyMode = useCallback(() => {
    setSystemState(prev => ({
      ...prev,
      emergencyMode: true,
      securityLevel: 'lockdown',
    }));
    kickAllUsers();
    addAnnouncement({
      title: 'EMERGENCY SECURITY LOCKDOWN',
      message: 'All employees must re-authenticate using emergency passwords provided during onboarding.',
      type: 'security',
    });
  }, [kickAllUsers]);

  const disableEmergencyMode = useCallback(() => {
    setSystemState(prev => ({
      ...prev,
      emergencyMode: false,
      securityLevel: 'normal',
    }));
  }, []);

  const enableFteLogin = useCallback(() => {
    setSystemState(prev => ({
      ...prev,
      fteLoginAvailable: true,
    }));
    addAnnouncement({
      title: 'FTE Conversion Portal Now Open',
      message: 'Interns selected for Full-Time Employment can now access the FTE Login portal to complete their conversion process.',
      type: 'fte',
    });
  }, []);

  const addAnnouncement = useCallback((announcement: Omit<Announcement, 'id' | 'timestamp'>) => {
    const newAnnouncement: Announcement = {
      ...announcement,
      id: `ann_${Date.now()}`,
      timestamp: new Date(),
    };
    setSystemState(prev => ({
      ...prev,
      announcements: [newAnnouncement, ...prev.announcements],
    }));
  }, []);

  const addSecurityAlert = useCallback((alert: Omit<SecurityAlert, 'id' | 'timestamp'>) => {
    const newAlert: SecurityAlert = {
      ...alert,
      id: `alert_${Date.now()}`,
      timestamp: new Date(),
    };
    setSystemState(prev => ({
      ...prev,
      securityAlerts: [newAlert, ...prev.securityAlerts],
    }));
  }, []);

  const clearSecurityAlerts = useCallback(() => {
    setSystemState(prev => ({
      ...prev,
      securityAlerts: [],
    }));
  }, []);

  const updateSecurityLevel = useCallback((level: 'normal' | 'elevated' | 'lockdown') => {
    setSystemState(prev => ({
      ...prev,
      securityLevel: level,
    }));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        systemState,
        login,
        logout,
        blockUser,
        unblockUser,
        kickAllUsers,
        triggerEmergencyMode,
        disableEmergencyMode,
        enableFteLogin,
        addAnnouncement,
        addSecurityAlert,
        clearSecurityAlerts,
        updateSecurityLevel,
        verifyOtp,
        currentOtp,
        otpSeed,
        otpAttempts,
        maxOtpAttempts,
        setMaxOtpAttempts,
        otpCooldown,
        generateNewOtp,
        hrVerified,
        setHrVerified,
        // Upload system
        uploadUnlocked,
        uploadWindowExpiry,
        uploadAttempted,
        verifyCtfFlag,
        completeUpload,
        resetUploadSystem,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
