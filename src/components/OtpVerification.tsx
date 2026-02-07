import { useState, useEffect } from 'react';
import { Shield, Lock, KeyRound, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

interface OtpVerificationProps {
  onSuccess: () => void;
  onBack: () => void;
}

export default function OtpVerification({ onSuccess, onBack }: OtpVerificationProps) {
  const [otp, setOtp] = useState('');
  const { verifyOtp, otpAttempts, maxOtpAttempts, otpCooldown, generateNewOtp, setMaxOtpAttempts } = useAuth();

  // Expose function to window for CTF - can be modified via console
  useEffect(() => {
    // @ts-ignore - Intentionally exposing for CTF
    window.shiphy_2fa_config = {
      maxAttempts: maxOtpAttempts,
      setMaxAttempts: setMaxOtpAttempts,
      // Hint: increase maxAttempts to get more tries
    };
    
    console.log('[SHIPHY] 2FA Config loaded. Type shiphy_2fa_config in console for options.');
  }, [maxOtpAttempts, setMaxOtpAttempts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verifyOtp(otp)) {
      onSuccess();
    }
    setOtp('');
  };

  const handleResendOtp = () => {
    generateNewOtp();
  };

  return (
    <div className="min-h-screen bg-background cyber-grid flex items-center justify-center p-6">
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <div className="relative w-full max-w-md">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </button>

        <div className="corporate-card glow-border">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="relative">
                <KeyRound className="h-12 w-12 text-primary" />
                <div className="absolute -inset-2 bg-primary/20 blur-xl" />
              </div>
            </div>
            <h1 className="font-display text-2xl font-bold">Two-Factor Authentication</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Enter the 6-digit code sent to your registered device
            </p>
          </div>

          {/* OTP Status */}
          <div className="mb-6 p-4 rounded-lg bg-secondary/50 border border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Attempts remaining:</span>
              <span className={`font-mono font-bold ${maxOtpAttempts - otpAttempts <= 1 ? 'text-destructive' : 'text-primary'}`}>
                {maxOtpAttempts - otpAttempts} / {maxOtpAttempts}
              </span>
            </div>
            {otpCooldown > 0 && (
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Cooldown:</span>
                <span className="text-warning font-mono">{otpCooldown}s</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="text-center text-2xl font-mono tracking-[0.5em] h-14"
                maxLength={6}
                disabled={otpCooldown > 0}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={otp.length !== 6 || otpCooldown > 0}
            >
              {otpCooldown > 0 ? `Wait ${otpCooldown}s...` : 'Verify Code'}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center">
            <button
              onClick={handleResendOtp}
              disabled={otpCooldown > 0}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
            >
              <RefreshCw className="h-4 w-4" />
              Resend Code
            </button>
          </div>

          {/* Debug hint in source */}
          {/* 
            ================================================
            2FA BYPASS HINT:
            Open browser console and type:
            shiphy_2fa_config.setMaxAttempts(100)
            This will give you more attempts to guess the OTP
            
            Alternative: Check network tab for OTP in response
            ================================================
          */}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Having trouble? Contact IT Support
        </p>
      </div>
    </div>
  );
}
