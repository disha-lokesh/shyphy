import { Users, FolderKanban, MessageSquare, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function EmployeeDashboard() {
  const { currentUser, systemState } = useAuth();

  if (!currentUser) return null;

  return (
    <DashboardLayout requiredRole="employee">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="font-display text-3xl font-bold">
            Welcome back, {currentUser.fullName}
          </h1>
          <p className="text-muted-foreground mt-1">
            Employee Dashboard • {currentUser.department}
          </p>
        </div>

        {/* Security Alert if any */}
        {systemState.securityLevel !== 'normal' && (
          <div className="alert-banner alert-warning">
            <p className="font-medium">Security Notice</p>
            <p className="text-sm opacity-80">
              Elevated security measures are in effect. Please report any suspicious activity.
            </p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Projects</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
                <FolderKanban className="h-8 w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tasks Completed</p>
                  <p className="text-2xl font-bold">28</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Team Members</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Users className="h-8 w-8 text-accent/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Hours Logged</p>
                  <p className="text-2xl font-bold">164</p>
                </div>
                <Clock className="h-8 w-8 text-warning/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects & Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FolderKanban className="h-5 w-5 text-primary" />
                Active Projects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Cloud Migration', progress: 75, status: 'On Track' },
                { name: 'Security Audit', progress: 45, status: 'In Progress' },
                { name: 'API Integration', progress: 90, status: 'Near Complete' },
                { name: 'Dashboard Redesign', progress: 30, status: 'Started' },
              ].map((project, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{project.name}</span>
                    <Badge variant="secondary" className="text-xs">{project.status}</Badge>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'Completed code review for PR #234', time: '2 hours ago' },
                  { action: 'Updated project documentation', time: '4 hours ago' },
                  { action: 'Attended team standup meeting', time: 'Yesterday' },
                  { action: 'Submitted security training certificate', time: '2 days ago' },
                  { action: 'Fixed bug in authentication module', time: '3 days ago' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                    <div>
                      <p className="text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Employee Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">Employee ID</p>
                <p className="font-mono">{currentUser.employeeId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p>{currentUser.department}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p>{currentUser.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Join Date</p>
                <p>{currentUser.joinDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
