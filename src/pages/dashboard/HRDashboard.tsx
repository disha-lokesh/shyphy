import { Users, FileText, Search, Download, Eye, UserCog } from 'lucide-react';
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

export default function HRDashboard() {
  const { currentUser, users, hrVerified } = useAuth();

  if (!currentUser || !hrVerified) return null;

  // Filter out blue_team users from HR view
  const visibleUsers = users.filter(u => u.role !== 'blue_team' && u.role !== 'boss');

  return (
    <DashboardLayout requiredRole="hr">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">HR Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Employee Management System
            </p>
          </div>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Employees</p>
                  <p className="text-2xl font-bold">{visibleUsers.length}</p>
                </div>
                <Users className="h-8 w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Interns</p>
                  <p className="text-2xl font-bold">{visibleUsers.filter(u => u.role === 'intern').length}</p>
                </div>
                <UserCog className="h-8 w-8 text-blue-400/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">{visibleUsers.filter(u => !u.isBlocked).length}</p>
                </div>
                <div className="status-indicator status-online h-4 w-4" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Blocked</p>
                  <p className="text-2xl font-bold">{visibleUsers.filter(u => u.isBlocked).length}</p>
                </div>
                <div className="status-indicator status-offline h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search employees..." className="pl-10" />
          </div>
        </div>

        {/* Employee Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Employee Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleUsers.map((user) => (
                  <TableRow key={user.username}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.fullName}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{user.employeeId}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`status-indicator ${user.isBlocked ? 'status-offline' : 'status-online'}`} />
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </div>
                    </TableCell>
                    <TableCell>
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

        {/* Admin Details - Important for CTF */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Administration Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                <p className="font-medium">System Administrator</p>
                <p className="text-sm text-muted-foreground mt-1">Abhishek Shemadi</p>
                <p className="text-xs text-muted-foreground">admin_abhishek@shiphy.com</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {/* Hidden clue for CTF */}
                  {/* Mother's name: SHEETAL, DOB: 22/03/1985 */}
                  {/* Check Instagram @abhishek_shemadi_art for more info */}
                  Employee since 2019
                </p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                <p className="font-medium">CEO</p>
                <p className="text-sm text-muted-foreground mt-1">Prakash Deshmukh</p>
                <p className="text-xs text-muted-foreground">ceo@shiphy.com</p>
                <p className="text-xs text-muted-foreground mt-2">Executive Office</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 
          ================================================
          HR CONFIDENTIAL RECORDS - DO NOT SHARE
          ================================================
          
          Admin Profile - Abhishek Shemadi:
          - Full Name: Abhishek Shemadi
          - Mother's Maiden Name: SHEETAL
          - Date of Birth: March 22, 1985 (22/03/1985)
          - Emergency Password Pattern: [First 4 chars of mother's name][DDMMYYYY]
          - Instagram (personal hobby): @abhishek_shemadi_art
          
          Note: For painting references, check his Instagram - 
          he posts about his mother's influence on his art
          
          ================================================
        */}
      </div>
    </DashboardLayout>
  );
}
