import { useState, useEffect } from 'react';
import { 
  Activity, Shield, AlertTriangle, Clock, Eye, 
  Zap, Server, Globe, Lock, Ban, CheckCircle,
  XCircle, RefreshCw, Terminal
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'request' | 'auth' | 'scan' | 'attack' | 'system';
  severity: 'info' | 'warning' | 'critical';
  source: string;
  message: string;
  details?: string;
  blocked: boolean;
}

interface SecurityFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  vulnerability?: string;
}

export default function BlueTeamMonitoringPage() {
  const { currentUser, systemState, addSecurityAlert, blockUser, users } = useAuth();
  
  // Security features with intentional vulnerabilities
  const [securityFeatures, setSecurityFeatures] = useState<SecurityFeature[]>([
    {
      id: 'rate_limit',
      name: 'Rate Limiting',
      description: 'Block excessive requests (100/min)',
      enabled: true,
      vulnerability: 'Cooldown window of 30s between enforcement cycles allows burst attacks',
    },
    {
      id: 'brute_force',
      name: 'Brute Force Protection',
      description: 'Lock account after 3 failed attempts',
      enabled: true,
      vulnerability: 'Reset timer allows retry after 60s cooldown',
    },
    {
      id: 'sql_injection',
      name: 'SQL/NoSQL Injection Filter',
      description: 'Detect and block injection patterns',
      enabled: true,
      vulnerability: 'Base64 encoded payloads may bypass detection',
    },
    {
      id: 'xss_filter',
      name: 'XSS Protection',
      description: 'Sanitize script injection attempts',
      enabled: true,
    },
    {
      id: 'header_validation',
      name: 'Header Validation',
      description: 'Block suspicious HTTP headers (Burpsuite, etc)',
      enabled: true,
      vulnerability: 'Custom user-agent spoofing not fully detected',
    },
    {
      id: 'session_binding',
      name: 'Session IP Binding',
      description: 'Bind sessions to originating IP',
      enabled: false,
      vulnerability: 'Currently disabled for maintenance',
    },
  ]);

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [autoBlock, setAutoBlock] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Simulate real-time log generation
  useEffect(() => {
    const generateLog = () => {
      const types = ['request', 'auth', 'scan', 'attack', 'system'] as const;
      const sources = ['192.168.1.45', '10.0.0.23', '172.16.0.89', 'External', 'Internal'];
      const messages = [
        'HTTP GET /api/users - 200 OK',
        'Login attempt from unknown IP',
        'Port scan detected on range 80-443',
        'SQL injection pattern detected in parameter',
        'Rate limit threshold approaching',
        'Session validation successful',
        'Failed authentication attempt',
        'Suspicious header pattern: X-Forwarded-For spoofing',
        'Burpsuite signature detected in request',
        'NoSQLi payload pattern matched',
      ];

      const randomType = types[Math.floor(Math.random() * types.length)];
      const severity = randomType === 'attack' ? 'critical' : 
                       randomType === 'scan' ? 'warning' : 'info';
      
      const newLog: LogEntry = {
        id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        timestamp: new Date(),
        type: randomType,
        severity,
        source: sources[Math.floor(Math.random() * sources.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        blocked: severity === 'critical' && autoBlock && !maintenanceMode,
      };

      setLogs(prev => [newLog, ...prev.slice(0, 49)]);

      // Trigger security alert for attacks
      if (randomType === 'attack' && !maintenanceMode) {
        addSecurityAlert({
          type: 'unauthorized_access',
          severity: severity === 'critical' ? 'high' : 'medium',
          message: newLog.message,
          username: 'Unknown',
          details: `Source: ${newLog.source}`,
        });
      }
    };

    const interval = setInterval(generateLog, 3000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, [autoBlock, maintenanceMode, addSecurityAlert]);

  const toggleFeature = (featureId: string) => {
    setSecurityFeatures(prev => prev.map(f => 
      f.id === featureId ? { ...f, enabled: !f.enabled } : f
    ));
    toast.info(`Security feature ${featureId} toggled`);
  };

  const toggleMaintenanceMode = () => {
    setMaintenanceMode(!maintenanceMode);
    if (!maintenanceMode) {
      toast.warning('MAINTENANCE MODE ENABLED - Security features relaxed. Users should use emergency passwords.');
      // Disable some protections
      setSecurityFeatures(prev => prev.map(f => ({
        ...f,
        enabled: f.id === 'xss_filter' ? f.enabled : false,
      })));
    } else {
      toast.success('Maintenance mode disabled - Full security restored');
      // Re-enable protections
      setSecurityFeatures(prev => prev.map(f => ({
        ...f,
        enabled: f.id !== 'session_binding',
      })));
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-destructive';
      case 'warning': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'attack': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'scan': return <Eye className="h-4 w-4 text-warning" />;
      case 'auth': return <Lock className="h-4 w-4 text-primary" />;
      case 'system': return <Server className="h-4 w-4 text-accent" />;
      default: return <Globe className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (!currentUser) return null;

  const enabledCount = securityFeatures.filter(f => f.enabled).length;
  const securityScore = Math.round((enabledCount / securityFeatures.length) * 100);

  return (
    <DashboardLayout requiredRole="blue_team">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold flex items-center gap-3">
              <Activity className="h-8 w-8 text-accent" />
              Security Monitoring Center
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time threat detection & response
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge 
              variant={maintenanceMode ? 'destructive' : 'outline'} 
              className="gap-1 py-1"
            >
              <Zap className="h-3 w-3" />
              {maintenanceMode ? 'MAINTENANCE' : 'OPERATIONAL'}
            </Badge>
            <Button 
              variant={maintenanceMode ? 'destructive' : 'outline'}
              onClick={toggleMaintenanceMode}
            >
              {maintenanceMode ? 'Exit Maintenance' : 'Enter Maintenance'}
            </Button>
          </div>
        </div>

        {/* Maintenance Mode Warning */}
        {maintenanceMode && (
          <Card className="border-warning bg-warning/10">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-warning shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-warning">MAINTENANCE MODE ACTIVE</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Security features are relaxed during maintenance. All users should authenticate 
                    using their <strong className="text-foreground">emergency passwords</strong> 
                    (PESU Assessments pattern: First 4 letters of mother's name + DDMMYYYY DOB).
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Note: Some attack patterns may bypass detection during this window.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security Score & Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className={securityScore < 50 ? 'border-destructive/30' : 'border-success/30'}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Security Score</p>
              <div className="flex items-center gap-3 mt-2">
                <Progress value={securityScore} className="flex-1" />
                <span className={`font-bold ${securityScore < 50 ? 'text-destructive' : 'text-success'}`}>
                  {securityScore}%
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Active Features</p>
              <p className="text-2xl font-bold">{enabledCount}/{securityFeatures.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Blocked Today</p>
              <p className="text-2xl font-bold text-destructive">
                {logs.filter(l => l.blocked).length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Auto-Block</p>
                  <p className="text-sm font-medium mt-1">{autoBlock ? 'Enabled' : 'Disabled'}</p>
                </div>
                <Switch checked={autoBlock} onCheckedChange={setAutoBlock} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Features Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              Security Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {securityFeatures.map((feature) => (
                <div 
                  key={feature.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    feature.enabled 
                      ? 'bg-success/5 border-success/30' 
                      : 'bg-destructive/5 border-destructive/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {feature.enabled ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <XCircle className="h-4 w-4 text-destructive" />
                        )}
                        <h4 className="font-medium text-sm">{feature.name}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {feature.description}
                      </p>
                      {feature.vulnerability && (
                        <p className="text-xs text-warning/80 mt-2 italic">
                          ⚠️ {feature.vulnerability}
                        </p>
                      )}
                    </div>
                    <Switch 
                      checked={feature.enabled} 
                      onCheckedChange={() => toggleFeature(feature.id)}
                      disabled={maintenanceMode && feature.id !== 'xss_filter'}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary" />
                Live Security Logs
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setLogs([])}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-background/50 rounded-lg border border-border p-4 font-mono text-xs max-h-[400px] overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Waiting for activity...
                </p>
              ) : (
                <div className="space-y-2">
                  {logs.map((log) => (
                    <div 
                      key={log.id} 
                      className={`flex items-start gap-3 p-2 rounded ${
                        log.blocked ? 'bg-destructive/10' : ''
                      }`}
                    >
                      <span className="text-muted-foreground shrink-0">
                        [{new Date(log.timestamp).toLocaleTimeString()}]
                      </span>
                      {getTypeIcon(log.type)}
                      <span className={getSeverityColor(log.severity)}>
                        [{log.severity.toUpperCase()}]
                      </span>
                      <span className="text-accent">{log.source}</span>
                      <span className="flex-1">{log.message}</span>
                      {log.blocked && (
                        <Badge variant="destructive" className="text-xs">BLOCKED</Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Block Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Ban className="h-5 w-5 text-destructive" />
              Quick Block Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {users.filter(u => u.role !== 'boss' && u.role !== 'blue_team').map((user) => (
                <Button
                  key={user.username}
                  variant={user.isBlocked ? 'outline' : 'destructive'}
                  size="sm"
                  onClick={() => {
                    if (!user.isBlocked) {
                      blockUser(user.username);
                      toast.success(`Blocked ${user.username}`);
                    }
                  }}
                  disabled={user.isBlocked}
                >
                  {user.isBlocked ? '✓ ' : ''}{user.username}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
