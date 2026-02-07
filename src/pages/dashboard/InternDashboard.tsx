import { useEffect, useState } from 'react';
import { User, FileText, Calendar, Bell, Clock, Building2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function InternDashboard() {
  const { currentUser, systemState, enableFteLogin, addAnnouncement } = useAuth();
  const [timeOnPage, setTimeOnPage] = useState(0);
  const [announcementsSent, setAnnouncementsSent] = useState(0);

  // Simulate real-time announcements
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOnPage(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Send periodic announcements
  useEffect(() => {
    if (timeOnPage > 0 && timeOnPage % 60 === 0 && announcementsSent < 3) {
      const announcements = [
        { title: 'Team Meeting', message: 'Weekly standup at 10:00 AM in Conference Room B', type: 'general' as const },
        { title: 'System Maintenance', message: 'Scheduled maintenance tonight from 2:00 AM to 4:00 AM', type: 'general' as const },
        { title: 'Training Session', message: 'Security awareness training tomorrow at 2:00 PM', type: 'general' as const },
      ];
      
      if (announcements[announcementsSent]) {
        addAnnouncement(announcements[announcementsSent]);
        setAnnouncementsSent(prev => prev + 1);
      }
    }

    // After 3-4 minutes, trigger FTE announcement
    if (timeOnPage === 180 && !systemState.fteLoginAvailable) {
      enableFteLogin();
    }
  }, [timeOnPage, announcementsSent, addAnnouncement, enableFteLogin, systemState.fteLoginAvailable]);

  if (!currentUser) return null;

  return (
    <DashboardLayout requiredRole="intern">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">
              Welcome, {currentUser.fullName}
            </h1>
            <p className="text-muted-foreground mt-1">
              Intern Dashboard • {currentUser.department}
            </p>
          </div>
          <Badge variant="outline" className="w-fit">
            <Clock className="h-3 w-3 mr-1" />
            Session: {Math.floor(timeOnPage / 60)}:{(timeOnPage % 60).toString().padStart(2, '0')}
          </Badge>
        </div>

        {/* Announcements */}
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {systemState.announcements.length === 0 ? (
              <p className="text-sm text-muted-foreground">No announcements yet. Stay tuned!</p>
            ) : (
              <div className="space-y-3">
                {systemState.announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className={`p-3 rounded-lg border ${
                      announcement.type === 'fte'
                        ? 'bg-primary/10 border-primary/30'
                        : announcement.type === 'security'
                        ? 'bg-destructive/10 border-destructive/30'
                        : 'bg-secondary/50 border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-sm">{announcement.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{announcement.message}</p>
                      </div>
                      <Badge variant={announcement.type === 'fte' ? 'default' : 'secondary'} className="text-xs shrink-0">
                        {announcement.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Employee ID</span>
                <span className="font-mono">{currentUser.employeeId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Email</span>
                <span>{currentUser.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Department</span>
                <span>{currentUser.department}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Join Date</span>
                <span>{currentUser.joinDate}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Department Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Team</span>
                <span>{currentUser.department}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Manager</span>
                <span>Priya Sharma</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Office</span>
                <span>Building A, Floor 3</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Intern Period</span>
                <span>6 months</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-2 rounded bg-secondary/50 text-sm">
                <p className="font-medium">Project Review</p>
                <p className="text-xs text-muted-foreground">Tomorrow, 2:00 PM</p>
              </div>
              <div className="p-2 rounded bg-secondary/50 text-sm">
                <p className="font-medium">Training Session</p>
                <p className="text-xs text-muted-foreground">Friday, 10:00 AM</p>
              </div>
              <div className="p-2 rounded bg-secondary/50 text-sm">
                <p className="font-medium">Team Lunch</p>
                <p className="text-xs text-muted-foreground">Friday, 12:30 PM</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documents Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Recent Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {[
                { name: 'Employee Handbook.pdf', size: '2.4 MB' },
                { name: 'Code of Conduct.pdf', size: '1.1 MB' },
                { name: 'Security Guidelines.pdf', size: '856 KB' },
                { name: 'IT Policy.pdf', size: '1.8 MB' },
                { name: 'Leave Policy.pdf', size: '420 KB' },
                { name: 'Emergency Contacts.pdf', size: '128 KB' },
              ].map((doc, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer">
                  <FileText className="h-8 w-8 text-primary/50" />
                  <div>
                    <p className="text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.size}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Password Hint - Hidden in page source */}
        {/* 
          ================================================
          INTERN ONBOARDING NOTES:
          Emergency password format for higher-level access:
          [First 4 letters of mother's name][DOB in DDMMYYYY]
          
          Example: If mother's name is "SHEETAL" and DOB is March 22, 1985
          Password would be: SHEE22031985
          
          This information is stored in HR records.
          Check with HR for details on admin: Abhishek Shemadi
          ================================================
        */}
      </div>
    </DashboardLayout>
  );
}
