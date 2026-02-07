import { 
  TrendingUp, Users, DollarSign, BarChart3, 
  FileText, Lock, Shield, ArrowUpRight
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function BossDashboard() {
  const { currentUser, systemState } = useAuth();

  if (!currentUser) return null;

  return (
    <DashboardLayout requiredRole="boss">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">
              Executive Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {currentUser.fullName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Shield className="h-3 w-3" />
              Maximum Security
            </Badge>
          </div>
        </div>

        {/* Executive Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-success/20 bg-success/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">$4.2M</p>
                  <p className="text-xs text-success flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" /> +12.5% MoM
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-success/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Employees</p>
                  <p className="text-2xl font-bold">156</p>
                  <p className="text-xs text-success flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" /> +8 this month
                  </p>
                </div>
                <Users className="h-8 w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Projects</p>
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
                <BarChart3 className="h-8 w-8 text-accent/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Growth</p>
                  <p className="text-2xl font-bold">34%</p>
                  <p className="text-xs text-success flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> YoY
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-success/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Executive Reports */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Recent Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'Q4 2024 Financial Report', date: 'Feb 01, 2025' },
                { name: 'Annual Security Audit', date: 'Jan 28, 2025' },
                { name: 'Employee Satisfaction Survey', date: 'Jan 15, 2025' },
                { name: 'Market Analysis Report', date: 'Jan 10, 2025' },
              ].map((report, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary/50" />
                    <span className="text-sm">{report.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{report.date}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Security Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">System Status</span>
                  <Badge variant="outline" className="text-success border-success/30">
                    Secure
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Security Level</span>
                  <span className="text-sm capitalize">{systemState.securityLevel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Alerts</span>
                  <span className="text-sm">{systemState.securityAlerts.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Emergency Mode</span>
                  <span className="text-sm">{systemState.emergencyMode ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Security Notice */}
        <Card className="border-warning/20 bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Shield className="h-8 w-8 text-warning shrink-0" />
              <div>
                <p className="font-medium">Maximum Security Account</p>
                <p className="text-sm text-muted-foreground mt-1">
                  This account has the highest security clearance. All actions are logged and monitored. 
                  Emergency password is known only to you and the Blue Team for disaster recovery.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
