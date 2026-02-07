import { Shield, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function FteLoginPage() {
  return (
    <div className="min-h-screen bg-background cyber-grid flex items-center justify-center p-6">
      <div className="fixed inset-0 bg-gradient-to-br from-destructive/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative w-full max-w-md">
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>

        <div className="corporate-card border-destructive/30">
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative">
                <AlertTriangle className="h-16 w-16 text-destructive" />
                <div className="absolute -inset-2 bg-destructive/20 blur-xl" />
              </div>
            </div>
            
            <h1 className="font-display text-2xl font-bold text-destructive mb-4">
              Access Denied
            </h1>
            
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 mb-6">
              <p className="text-sm text-foreground leading-relaxed">
                We're sorry to inform you that you've been <strong>rejected</strong> by the CEO 
                as per criteria of qualification and advice of the Vice CEO.
              </p>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong>Decision made by:</strong> Administration
              </p>
              <p>
                <strong>Reference:</strong> FTE-2025-REJ-{Math.floor(Math.random() * 9000) + 1000}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground mb-4">
                If you believe this is an error, please contact HR department.
              </p>
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  Return to Login
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-4 w-4" />
          ShiPhy HR Portal
        </div>
      </div>
    </div>
  );
}
