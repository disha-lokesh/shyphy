import { 
  Shield, AlertTriangle, Users, Lock, Activity, 
  Eye, Ban, Power, RefreshCw, Bell
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function BlueTeamDashboard() {
  const { 
    currentUser, 
    users, 
    systemState, 
    blockUser, 
    unblockUser,
    triggerEmergencyMode,
    disableEmergencyMode,
    enableFteLogin,
    updateSecurityLevel,
    clearSecurityAlerts,
    addAnnouncement,
  } = useAuth();

  if (!currentUser) return null;

  const handleBlockUser = (username: string) => {
    blockUser(username);
    toast.success(`User ${username} has been blocked`);
  };

  const handleUnblockUser = (username: string) => {
    unblockUser(username);
    toast.success(`User ${username} has been unblocked`);
  };

  const handleEmergencyMode = () => {
    if (systemState.emergencyMode) {
      disableEmergencyMode();
      toast.success('Emergency mode disabled');
    } else {
      triggerEmergencyMode();
      toast.error('Emergency mode activated - all users kicked');
    }
  };

  const handleSecurityLevel = (level: 'normal' | 'elevated' | 'lockdown') => {
    updateSecurityLevel(level);
    toast.info(`Security level set to ${level}`);
  };

  const handleTriggerFteAnnouncement = () => {
    enableFteLogin();
    toast.success('FTE login announcement sent');
  };

  const handleSendAnnouncement = (type: 'general' | 'security') => {
    const announcements = {
      general: { title: 'System Update', message: 'Scheduled maintenance in 2 hours' },
      security: { title: 'Security Notice', message: 'Suspicious activity detected. Please verify your accounts.' },
    };
    addAnnouncement({ ...announcements[type], type });
    toast.success('Announcement sent');
  };

  return (
    <DashboardLayout requiredRole="blue_team">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold flex items-center gap-3">
              <Shield className="h-8 w-8 text-accent" />
              Blue Team Command Center
            </h1>
            <p className="text-muted-foreground mt-1">
              Security Operations Dashboard
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={systemState.emergencyMode ? 'destructive' : 'outline'} 
              className="gap-1"
            >
              <Power className="h-3 w-3" />
              {systemState.emergencyMode ? 'EMERGENCY' : 'NORMAL'}
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-accent/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold">{users.filter(u => !u.isBlocked).length}</p>
                </div>
                <Users className="h-8 w-8 text-accent/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-destructive/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Blocked</p>
                  <p className="text-2xl font-bold text-destructive">{users.filter(u => u.isBlocked).length}</p>
                </div>
                <Ban className="h-8 w-8 text-destructive/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-warning/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Alerts</p>
                  <p className="text-2xl font-bold text-warning">{systemState.securityAlerts.length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-warning/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Security Level</p>
                  <p className="text-2xl font-bold capitalize">{systemState.securityLevel}</p>
                </div>
                <Lock className="h-8 w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Control Panel */}
        <Card className="border-accent/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-accent" />
              Control Panel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Emergency Mode Toggle */}
              <Button 
                variant={systemState.emergencyMode ? 'outline' : 'destructive'}
                className="h-auto py-4 flex-col gap-2"
                onClick={handleEmergencyMode}
              >
                <Power className="h-6 w-6" />
                <span>{systemState.emergencyMode ? 'Disable Emergency' : 'Trigger Emergency'}</span>
              </Button>

              {/* FTE Announcement */}
              <Button 
                variant="outline" 
                className="h-auto py-4 flex-col gap-2"
                onClick={handleTriggerFteAnnouncement}
                disabled={systemState.fteLoginAvailable}
              >
                <Bell className="h-6 w-6" />
                <span>Send FTE Announcement</span>
              </Button>

              {/* Security Level */}
              <div className="flex flex-col gap-2">
                <p className="text-xs text-muted-foreground text-center">Security Level</p>
                <div className="flex gap-1">
                  {(['normal', 'elevated', 'lockdown'] as const).map((level) => (
                    <Button
                      key={level}
                      variant={systemState.securityLevel === level ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1 capitalize"
                      onClick={() => handleSecurityLevel(level)}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Clear Alerts */}
              <Button 
                variant="outline" 
                className="h-auto py-4 flex-col gap-2"
                onClick={() => {
                  clearSecurityAlerts();
                  toast.success('Alerts cleared');
                }}
              >
                <RefreshCw className="h-6 w-6" />
                <span>Clear Alerts</span>
              </Button>
            </div>

            {/* Announcement Buttons */}
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">Send Announcements</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleSendAnnouncement('general')}>
                  General Announcement
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleSendAnnouncement('security')}>
                  Security Alert
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Alerts */}
        <Card className="border-warning/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Security Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {systemState.securityAlerts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No active alerts</p>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {systemState.securityAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border ${
                      alert.severity === 'critical' ? 'bg-destructive/10 border-destructive/30' :
                      alert.severity === 'high' ? 'bg-warning/10 border-warning/30' :
                      'bg-secondary/50 border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            alert.severity === 'critical' ? 'destructive' :
                            alert.severity === 'high' ? 'default' : 'secondary'
                          } className="text-xs">
                            {alert.severity}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{alert.type}</span>
                        </div>
                        <p className="text-sm mt-1">{alert.message}</p>
                        {alert.details && (
                          <p className="text-xs text-muted-foreground mt-1">{alert.details}</p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Failed Attempts</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.filter(u => u.role !== 'boss').map((user) => (
                  <TableRow key={user.username}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.fullName}</p>
                        <p className="text-xs text-muted-foreground font-mono">{user.username}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {user.role.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`status-indicator ${user.isBlocked ? 'status-offline' : 'status-online'}`} />
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={user.failedAttempts > 3 ? 'text-destructive font-bold' : ''}>
                        {user.failedAttempts}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {user.isBlocked ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnblockUser(user.username)}
                          >
                            Unblock
                          </Button>
                        ) : (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleBlockUser(user.username)}
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            Block
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Boss Emergency Password - Only visible to Blue Team */}
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-destructive">
              <Lock className="h-5 w-5" />
              Emergency Recovery Credentials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              For disaster recovery only. These credentials bypass all security measures.
            </p>
            <div className="p-4 rounded-lg bg-background border border-border font-mono text-sm">
              <p><strong>Boss Account Emergency Password:</strong></p>
              <p className="text-accent mt-2">58913022EEHS</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
