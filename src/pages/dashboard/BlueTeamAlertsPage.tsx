import { 
  AlertTriangle, Clock, Shield, Filter, 
  ChevronDown, Eye, Trash2
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function BlueTeamAlertsPage() {
  const { currentUser, systemState, clearSecurityAlerts } = useAuth();

  if (!currentUser) return null;

  const alertsByType = {
    login_attempt: systemState.securityAlerts.filter(a => a.type === 'login_attempt'),
    brute_force: systemState.securityAlerts.filter(a => a.type === 'brute_force'),
    nosqli: systemState.securityAlerts.filter(a => a.type === 'nosqli'),
    unauthorized_access: systemState.securityAlerts.filter(a => a.type === 'unauthorized_access'),
    spam_attack: systemState.securityAlerts.filter(a => a.type === 'spam_attack'),
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive/20 border-destructive/50 text-destructive';
      case 'high': return 'bg-warning/20 border-warning/50 text-warning';
      case 'medium': return 'bg-primary/20 border-primary/50 text-primary';
      default: return 'bg-secondary border-border text-muted-foreground';
    }
  };

  return (
    <DashboardLayout requiredRole="blue_team">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-warning" />
              Security Alerts
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time threat monitoring
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>All Alerts</DropdownMenuItem>
                <DropdownMenuItem>Critical Only</DropdownMenuItem>
                <DropdownMenuItem>High Priority</DropdownMenuItem>
                <DropdownMenuItem>Last Hour</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={clearSecurityAlerts}
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          {Object.entries(alertsByType).map(([type, alerts]) => (
            <Card key={type} className={alerts.length > 0 ? 'border-warning/30' : ''}>
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {type.replace('_', ' ')}
                </p>
                <p className={`text-2xl font-bold mt-1 ${alerts.length > 0 ? 'text-warning' : ''}`}>
                  {alerts.length}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Alert List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Alert Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            {systemState.securityAlerts.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="h-12 w-12 text-success/50 mx-auto mb-4" />
                <p className="text-lg font-medium">All Clear</p>
                <p className="text-sm text-muted-foreground">No security alerts at this time</p>
              </div>
            ) : (
              <div className="space-y-4">
                {systemState.securityAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="uppercase text-xs">
                            {alert.type.replace('_', ' ')}
                          </Badge>
                          <Badge variant={
                            alert.severity === 'critical' ? 'destructive' :
                            alert.severity === 'high' ? 'default' : 'secondary'
                          } className="text-xs">
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="font-medium">{alert.message}</p>
                        {alert.details && (
                          <p className="text-sm opacity-80 mt-1">{alert.details}</p>
                        )}
                        <div className="flex items-center gap-4 mt-3 text-xs opacity-60">
                          <span>User: {alert.username}</span>
                          <span>Time: {new Date(alert.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
