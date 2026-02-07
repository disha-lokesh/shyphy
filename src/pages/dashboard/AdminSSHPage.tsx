import { useState, useEffect } from 'react';
import { Terminal, ArrowLeft, Shield, Server, Lock } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function AdminSSHPage() {
  const { currentUser } = useAuth();
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState<string[]>([
    '╔══════════════════════════════════════════════════════════════╗',
    '║                    SHIPHY SECURE SHELL                       ║',
    '║                     Production Server                        ║',
    '╚══════════════════════════════════════════════════════════════╝',
    '',
    'Welcome, Administrator.',
    'Connection established to prod-server-01.shiphy.internal',
    '',
    'Type "help" for available commands.',
    '',
  ]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cmd = command.toLowerCase().trim();
    let response: string[] = [];

    switch (cmd) {
      case 'help':
        response = [
          'Available commands:',
          '  help     - Show this help message',
          '  whoami   - Display current user',
          '  status   - Show system status',
          '  uptime   - Show server uptime',
          '  ls       - List directory contents',
          '  pwd      - Print working directory',
          '  cat      - Read file (restricted)',
          '  clear    - Clear terminal',
          '  exit     - Close SSH session',
          '',
          'For CTF participants: The final step awaits...',
        ];
        break;
      case 'whoami':
        response = [`admin_abhishek (Administrator)`];
        break;
      case 'status':
        response = [
          'System Status: OPERATIONAL',
          'Security Level: STANDARD',
          'Active Connections: 1',
          'Last Audit: 2025-02-06 14:32:00',
        ];
        break;
      case 'uptime':
        response = ['Server uptime: 47 days, 12:34:56'];
        break;
      case 'ls':
        response = [
          'drwxr-xr-x  admin  admin  4096  Jan 15  config/',
          'drwxr-xr-x  admin  admin  4096  Jan 20  logs/',
          '-rw-r--r--  admin  admin   512  Feb 01  README.md',
          '-rw-------  admin  admin  2048  Feb 05  secrets.enc',
          'drwxr-xr-x  admin  admin  4096  Feb 06  ctf/',
        ];
        break;
      case 'pwd':
        response = ['/home/admin'];
        break;
      case 'ls ctf':
      case 'ls ctf/':
        response = [
          '-rw-r--r--  admin  admin   256  Feb 06  flag.txt',
          '-rwx------  admin  admin  1024  Feb 06  final_challenge.sh',
        ];
        break;
      case 'cat flag.txt':
      case 'cat ctf/flag.txt':
        response = [
          '╔══════════════════════════════════════════════════════════════╗',
          '║                    🏁 FLAG CAPTURED 🏁                       ║',
          '╠══════════════════════════════════════════════════════════════╣',
          '║                                                              ║',
          '║   SHIPHY{y0u_h4ck3d_th3_s3cur3_syst3m_2025}                  ║',
          '║                                                              ║',
          '║   Congratulations! You have successfully completed the      ║',
          '║   ShiPhy Security Challenge. Your red team skills are       ║',
          '║   impressive.                                               ║',
          '║                                                              ║',
          '║   Submit this flag to claim your victory!                   ║',
          '║                                                              ║',
          '╚══════════════════════════════════════════════════════════════╝',
        ];
        break;
      case 'clear':
        setOutput([]);
        setCommand('');
        return;
      case 'exit':
        response = ['Closing SSH session... Goodbye!'];
        break;
      case '':
        response = [];
        break;
      default:
        if (cmd.startsWith('cat ')) {
          response = ['Permission denied: File is encrypted or restricted'];
        } else {
          response = [`Command not found: ${command}`];
        }
    }

    setOutput(prev => [...prev, `admin@prod-server:~$ ${command}`, ...response, '']);
    setCommand('');
  };

  if (!currentUser) return null;

  return (
    <DashboardLayout requiredRole="admin">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/dashboard/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold flex items-center gap-2">
              <Terminal className="h-6 w-6 text-primary" />
              SSH Terminal
            </h1>
            <p className="text-sm text-muted-foreground">
              Secure connection to prod-server-01
            </p>
          </div>
        </div>

        {/* Connection Info */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="status-indicator status-online" />
            <span className="text-muted-foreground">Connected</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-success" />
            <span className="text-muted-foreground">Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">prod-server-01.shiphy.internal</span>
          </div>
        </div>

        {/* Terminal */}
        <Card className="bg-[hsl(220,25%,5%)] border-border">
          <CardContent className="p-0">
            <div className="h-[500px] overflow-y-auto p-4 font-mono text-sm">
              {output.map((line, i) => (
                <div key={i} className="text-accent whitespace-pre">
                  {line}
                </div>
              ))}
              
              {/* Input Line */}
              <form onSubmit={handleCommand} className="flex items-center mt-2">
                <span className="text-success mr-2">admin@prod-server:~$</span>
                <input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  className="flex-1 bg-transparent text-foreground outline-none"
                  autoFocus
                />
              </form>
            </div>
          </CardContent>
        </Card>

        {/* Help */}
        <div className="text-xs text-muted-foreground text-center">
          <Shield className="h-4 w-4 inline mr-1" />
          All terminal sessions are monitored and logged for security purposes
        </div>
      </div>
    </DashboardLayout>
  );
}
