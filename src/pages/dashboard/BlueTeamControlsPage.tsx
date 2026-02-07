import { 
  Settings, Shield, Lock, Users, Bell, 
  Server, Database, Terminal, Key, Upload, RefreshCw
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function BlueTeamControlsPage() {
  const { 
    currentUser, 
    systemState,
    triggerEmergencyMode,
    disableEmergencyMode,
    updateSecurityLevel,
    maxOtpAttempts,
    setMaxOtpAttempts,
    uploadUnlocked,
    uploadAttempted,
    resetUploadSystem,
  } = useAuth();

  if (!currentUser) return null;

  return (
    <DashboardLayout requiredRole="blue_team">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            System Controls
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure security settings and system behavior
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Emergency Mode</Label>
                  <p className="text-xs text-muted-foreground">Kicks all users and requires emergency passwords</p>
                </div>
                <Switch 
                  checked={systemState.emergencyMode} 
                  onCheckedChange={(checked) => {
                    if (checked) {
                      triggerEmergencyMode();
                      toast.error('Emergency mode activated');
                    } else {
                      disableEmergencyMode();
                      toast.success('Emergency mode disabled');
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label>Security Level</Label>
                <div className="flex gap-2">
                  {(['normal', 'elevated', 'lockdown'] as const).map((level) => (
                    <Button
                      key={level}
                      variant={systemState.securityLevel === level ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1 capitalize"
                      onClick={() => {
                        updateSecurityLevel(level);
                        toast.info(`Security level: ${level}`);
                      }}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>FTE Login Portal</Label>
                  <p className="text-xs text-muted-foreground">Allow FTE conversion access</p>
                </div>
                <Switch checked={systemState.fteLoginAvailable} disabled />
              </div>
            </CardContent>
          </Card>

          {/* 2FA Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                2FA Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Max OTP Attempts</Label>
                  <span className="font-mono text-sm">{maxOtpAttempts}</span>
                </div>
                <Slider
                  value={[maxOtpAttempts]}
                  onValueChange={([value]) => setMaxOtpAttempts(value)}
                  min={1}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Note: Default is 1. Attackers can modify via browser console (shiphy_2fa_config)
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>OTP Cooldown</Label>
                  <p className="text-xs text-muted-foreground">30 seconds after max attempts</p>
                </div>
                <span className="font-mono text-sm">30s</span>
              </div>
            </CardContent>
          </Card>

          {/* Upload System Control */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Upload System
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Upload Status</Label>
                  <p className="text-xs text-muted-foreground">CTF-based unlock required</p>
                </div>
                <Badge variant={uploadUnlocked ? 'default' : 'secondary'}>
                  {uploadUnlocked ? 'UNLOCKED' : 'LOCKED'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Upload Attempted</Label>
                  <p className="text-xs text-muted-foreground">One attempt per authorization</p>
                </div>
                <Badge variant={uploadAttempted ? 'destructive' : 'outline'}>
                  {uploadAttempted ? 'USED' : 'AVAILABLE'}
                </Badge>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  resetUploadSystem();
                  toast.success('Upload system reset. New flag generated.');
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Upload System
              </Button>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'API Server', icon: Server, status: 'online' },
                  { name: 'Database', icon: Database, status: 'online' },
                  { name: 'Auth Service', icon: Lock, status: 'online' },
                  { name: 'SSH Service', icon: Terminal, status: 'online' },
                  { name: 'Alert System', icon: Bell, status: 'online' },
                ].map((service, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-2">
                      <service.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{service.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`status-indicator ${service.status === 'online' ? 'status-online' : 'status-offline'}`} />
                      <span className="text-xs text-muted-foreground capitalize">{service.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* User Session Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Vulnerability Endpoints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 font-mono text-xs">
                <div className="p-2 rounded bg-secondary/50">
                  <p className="text-muted-foreground">NoSQLi Endpoint (vulnerable):</p>
                  <p className="text-accent">/api/users?query={'{}'}</p>
                </div>
                <div className="p-2 rounded bg-secondary/50">
                  <p className="text-muted-foreground">Debug Endpoint:</p>
                  <p className="text-accent">/api/debug/users</p>
                </div>
                <div className="p-2 rounded bg-secondary/50">
                  <p className="text-muted-foreground">2FA Bypass (seed-based):</p>
                  <p className="text-accent">shiphy_2fa_config.calculateOtp(shiphy_2fa_config.currentSeed)</p>
                </div>
                <div className="p-2 rounded bg-secondary/50">
                  <p className="text-muted-foreground">2FA Attempts Override:</p>
                  <p className="text-accent">shiphy_2fa_config.setMaxAttempts(100)</p>
                </div>
                <div className="p-2 rounded bg-secondary/50">
                  <p className="text-muted-foreground">Upload Flag Formula:</p>
                  <p className="text-accent">SHIPHY{'{upld_XXXX}'} where XXXX = ((timestamp/10000)*31337)%9999</p>
                </div>
                <div className="p-2 rounded bg-secondary/50">
                  <p className="text-muted-foreground">HTML Comment Clues:</p>
                  <p className="text-accent">Login page source code</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
