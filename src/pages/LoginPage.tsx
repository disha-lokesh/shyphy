import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import OtpVerification from '@/components/OtpVerification';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [pendingUser, setPendingUser] = useState('');
  
  const { login, systemState } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = login(username, password, isEmergencyMode);
    
    if (result.success) {
      if (result.message === '2FA_REQUIRED') {
        setPendingUser(username);
        setShow2FA(true);
        toast.info('2FA verification required');
      } else {
        toast.success('Login successful');
        // Route based on role
        const roleRoutes: Record<string, string> = {
          intern: '/dashboard/intern',
          employee: '/dashboard/employee',
          hr: '/dashboard/hr',
          admin: '/dashboard/admin',
          boss: '/dashboard/boss',
          blue_team: '/blue-team',
        };
        const user = JSON.parse(localStorage.getItem('shiphy_current_user') || '{}');
        navigate(roleRoutes[user.role] || '/dashboard');
      }
    } else {
      toast.error(result.message);
    }

    setIsLoading(false);
  };

  const handle2FASuccess = () => {
    toast.success('2FA verification successful');
    navigate('/dashboard/hr');
  };

  if (show2FA) {
    return <OtpVerification onSuccess={handle2FASuccess} onBack={() => setShow2FA(false)} />;
  }

  return (
    <div className="min-h-screen bg-background cyber-grid flex items-center justify-center p-6">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <div className="relative w-full max-w-md">
        {/* Back button */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="corporate-card glow-border">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="relative">
                <Shield className="h-12 w-12 text-primary" />
                <div className="absolute -inset-2 bg-primary/20 blur-xl" />
              </div>
            </div>
            <h1 className="font-display text-2xl font-bold">
              Shi<span className="text-primary">Phy</span> Portal
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Secure Employee Access
            </p>
          </div>

          {/* Emergency Mode Banner */}
          {systemState.emergencyMode && (
            <div className="alert-banner alert-danger mb-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <div>
                  <p className="font-semibold">Emergency Lockdown Active</p>
                  <p className="text-xs opacity-80">Use emergency password to login</p>
                </div>
              </div>
            </div>
          )}

          {/* Security Level Indicator */}
          <div className="flex items-center justify-center gap-2 mb-6 text-xs">
            <div className={`status-indicator ${
              systemState.securityLevel === 'normal' ? 'status-online' :
              systemState.securityLevel === 'elevated' ? 'status-warning' :
              'status-offline'
            }`} />
            <span className="text-muted-foreground">
              Security Level: <span className="capitalize">{systemState.securityLevel}</span>
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">
                {isEmergencyMode ? 'Emergency Password' : 'Password'}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isEmergencyMode ? 'Enter emergency password' : 'Enter password'}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {systemState.emergencyMode && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="emergencyMode"
                  checked={isEmergencyMode}
                  onChange={(e) => setIsEmergencyMode(e.target.checked)}
                  className="rounded border-border"
                />
                <Label htmlFor="emergencyMode" className="text-sm cursor-pointer">
                  Use emergency password
                </Label>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Forgot Password */}
          <div className="mt-6 text-center">
            <Link 
              to="/forgot-password" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* FTE Login Link */}
          {systemState.fteLoginAvailable && (
            <div className="mt-4 pt-4 border-t border-border text-center">
              <Link 
                to="/fte-login" 
                className="text-sm text-primary hover:underline"
              >
                FTE Conversion Portal →
              </Link>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Protected by ShiPhy Security Protocol v2.5
          <br />
          All access attempts are monitored and logged
        </p>

        {/* 
          ============================================
          DEBUG NOTES - REMOVE BEFORE PRODUCTION
          ============================================
          NoSQLi endpoint: /api/users?query={}
          Test user: emp_001 / EmpPass@456
          HR 2FA can be bypassed by modifying maxOtpAttempts
          Admin emergency pwd pattern: [Mother's name 4 chars][DOB]
          Check HR records for admin details
          Instagram clue: @abhishek_shemadi_art
          ============================================
        -->
        <!-- Employee data exposed at /api/debug/users -->
        */}
      </div>
    </div>
  );
}
