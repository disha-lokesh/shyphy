import { ReactNode, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  Shield, LogOut, Bell, User, Settings, Home, 
  AlertTriangle, Lock, Users, FileText, Terminal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DashboardLayoutProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[];
}

export default function DashboardLayout({ children, requiredRole }: DashboardLayoutProps) {
  const { currentUser, logout, systemState } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (requiredRole) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      if (!roles.includes(currentUser.role)) {
        navigate('/login');
      }
    }
  }, [currentUser, requiredRole, navigate]);

  if (!currentUser) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleColors: Record<UserRole, string> = {
    intern: 'text-blue-400',
    employee: 'text-green-400',
    hr: 'text-purple-400',
    admin: 'text-orange-400',
    boss: 'text-red-400',
    blue_team: 'text-cyan-400',
  };

  const navItems = getNavItems(currentUser.role);

  return (
    <div className="min-h-screen bg-background">
      {/* Security Alert Banner */}
      {systemState.securityLevel !== 'normal' && (
        <div className={`px-4 py-2 text-center text-sm ${
          systemState.securityLevel === 'lockdown' 
            ? 'bg-destructive/20 text-destructive border-b border-destructive/30' 
            : 'bg-warning/20 text-warning border-b border-warning/30'
        }`}>
          <AlertTriangle className="inline h-4 w-4 mr-2" />
          Security Level: {systemState.securityLevel.toUpperCase()}
          {systemState.emergencyMode && ' - Emergency Mode Active'}
        </div>
      )}

      {/* Top Navigation */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="font-display text-xl font-bold">
                Shi<span className="text-primary">Phy</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm transition-colors ${
                    location.pathname === item.href
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <item.icon className="h-4 w-4 inline mr-2" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {systemState.announcements.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] flex items-center justify-center">
                  {systemState.announcements.length}
                </span>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">{currentUser.fullName}</p>
                    <p className={`text-xs capitalize ${roleColors[currentUser.role]}`}>
                      {currentUser.role.replace('_', ' ')}
                    </p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{currentUser.fullName}</p>
                  <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}

function getNavItems(role: UserRole) {
  const baseItems = [
    { href: `/dashboard/${role === 'blue_team' ? 'blue-team' : role}`, label: 'Dashboard', icon: Home },
  ];

  switch (role) {
    case 'intern':
      return [
        ...baseItems,
        { href: '/dashboard/intern/profile', label: 'My Profile', icon: User },
        { href: '/dashboard/intern/documents', label: 'Documents', icon: FileText },
      ];
    case 'employee':
      return [
        ...baseItems,
        { href: '/dashboard/employee/projects', label: 'Projects', icon: FileText },
        { href: '/dashboard/employee/team', label: 'Team', icon: Users },
      ];
    case 'hr':
      return [
        ...baseItems,
        { href: '/dashboard/hr/employees', label: 'Employees', icon: Users },
        { href: '/dashboard/hr/records', label: 'Records', icon: FileText },
      ];
    case 'admin':
      return [
        ...baseItems,
        { href: '/dashboard/admin/users', label: 'Users', icon: Users },
        { href: '/dashboard/admin/security', label: 'Security', icon: Lock },
        { href: '/dashboard/admin/ssh', label: 'SSH Access', icon: Terminal },
      ];
    case 'boss':
      return [
        ...baseItems,
        { href: '/dashboard/boss/reports', label: 'Reports', icon: FileText },
        { href: '/dashboard/boss/executive', label: 'Executive', icon: Lock },
      ];
    case 'blue_team':
      return [
        { href: '/blue-team', label: 'Dashboard', icon: Home },
        { href: '/blue-team/alerts', label: 'Alerts', icon: AlertTriangle },
        { href: '/blue-team/controls', label: 'Controls', icon: Settings },
      ];
    default:
      return baseItems;
  }
}
