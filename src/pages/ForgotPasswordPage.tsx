import { Shield, ArrowLeft, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-background cyber-grid flex items-center justify-center p-6">
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <div className="relative w-full max-w-md">
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>

        <div className="corporate-card glow-border">
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative">
                <Bot className="h-16 w-16 text-primary" />
                <div className="absolute -inset-2 bg-primary/20 blur-xl" />
              </div>
            </div>
            
            <h1 className="font-display text-2xl font-bold mb-4">
              Password Recovery
            </h1>
            
            <div className="p-6 rounded-lg bg-secondary/50 border border-border mb-6">
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Our AI-powered password recovery assistant will help you reset your password.
              </p>
              
              {/* Fake AI assistant placeholder */}
              <div className="aspect-square max-w-[200px] mx-auto rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
                <div className="text-center">
                  <Bot className="h-12 w-12 text-primary/50 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">AI Assistant</p>
                  <p className="text-xs text-muted-foreground/50">Coming Soon</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                For immediate assistance, please contact:
              </p>
              <p className="font-mono text-primary">
                it-support@shiphy.com
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
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
          ShiPhy Security
        </div>
      </div>
    </div>
  );
}
