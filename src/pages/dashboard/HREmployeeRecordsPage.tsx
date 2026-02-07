import { useState, useEffect } from 'react';
import { Users, FileText, Search, Eye, Download, Building2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function HREmployeeRecordsPage() {
  const { currentUser, users, hrVerified } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreepyPopup, setShowCreepyPopup] = useState(false);
  const [timeOnPage, setTimeOnPage] = useState(0);

  // Show creepy popup after 3 minutes (180 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeOnPage(prev => {
        const newTime = prev + 1;
        if (newTime >= 180 && !showCreepyPopup) {
          setShowCreepyPopup(true);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showCreepyPopup]);

  if (!currentUser || !hrVerified) return null;

  // All employees visible to HR - including admin (but not blue_team/boss)
  const allEmployees = users.filter(u => u.role !== 'blue_team' && u.role !== 'boss');
  
  const filteredEmployees = allEmployees.filter(emp => 
    emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roleColors: Record<string, string> = {
    intern: 'bg-accent/20 text-accent border-accent/30',
    employee: 'bg-primary/20 text-primary border-primary/30',
    hr: 'bg-success/20 text-success border-success/30',
    admin: 'bg-warning/20 text-warning border-warning/30',
  };

  return (
    <DashboardLayout requiredRole="hr">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold flex items-center gap-3">
              <Building2 className="h-8 w-8 text-primary" />
              Employee Directory
            </h1>
            <p className="text-muted-foreground mt-1">
              Complete organizational records
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Staff</p>
                  <p className="text-2xl font-bold">{allEmployees.length}</p>
                </div>
                <Users className="h-8 w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Admins</p>
              <p className="text-2xl font-bold">{allEmployees.filter(e => e.role === 'admin').length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Employees</p>
              <p className="text-2xl font-bold">{allEmployees.filter(e => e.role === 'employee').length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Interns</p>
              <p className="text-2xl font-bold">{allEmployees.filter(e => e.role === 'intern').length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, ID, or role..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Employee Records Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Organization Directory
              {/* Hidden HTML comment clue */}
              {/* 
                ===================================
                EMPLOYEE PERSONAL RECORDS ACCESS
                For detailed personal info, check:
                - Admin records contain security info
                - Mother's name field = security question
                - DOB field = password component
                Check admin's social media for clues...
                Instagram: @abhishek_shemadi_art
                ===================================
              */}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.employeeId}>
                    <TableCell className="font-mono text-sm">
                      {employee.employeeId}
                    </TableCell>
                    <TableCell className="font-medium">
                      {employee.fullName}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`capitalize ${roleColors[employee.role] || ''}`}
                      >
                        {employee.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Hidden data in page source - CTF clue */}
        <div style={{ display: 'none' }} data-admin-hint="Check Instagram @abhishek_shemadi_art for painting hobby">
          <span data-mother="SHEETAL" data-dob="07021991" data-pattern="FIRST4CHAR+DDMMYYYY"></span>
        </div>

        {/* Creepy Popup after 3 minutes */}
        <Dialog open={showCreepyPopup} onOpenChange={setShowCreepyPopup}>
          <DialogContent className="border-warning/50 bg-background">
            <DialogHeader>
              <DialogTitle className="text-warning flex items-center gap-2">
                💀 Hidden Message
              </DialogTitle>
              <DialogDescription className="text-foreground pt-4">
                <p className="text-lg font-mono italic">
                  "Mostly some of your creepy skills may help u"
                </p>
                <p className="text-sm text-muted-foreground mt-4">
                  Hint: The answers you seek aren't always in the database...
                  Sometimes they're hiding in plain sight. 👁️
                </p>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        {/* Debug timer display (hidden but findable in source) */}
        {/* Time on page: {timeOnPage}s - Popup triggers at 180s */}
      </div>
    </DashboardLayout>
  );
}
