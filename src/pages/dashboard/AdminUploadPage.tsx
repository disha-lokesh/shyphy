import { useState, useEffect, useRef } from 'react';
import { 
  Upload, Lock, Unlock, Timer, AlertTriangle, 
  FileText, CheckCircle, XCircle, Shield, RefreshCw
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function AdminUploadPage() {
  const { 
    currentUser, 
    uploadUnlocked, 
    uploadWindowExpiry, 
    verifyCtfFlag, 
    completeUpload,
    uploadAttempted 
  } = useAuth();
  
  const [flagInput, setFlagInput] = useState('');
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Countdown timer for upload window
  useEffect(() => {
    if (!uploadWindowExpiry) {
      setTimeRemaining(null);
      return;
    }

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((uploadWindowExpiry - Date.now()) / 1000));
      setTimeRemaining(remaining);
      
      if (remaining <= 0) {
        setTimeRemaining(null);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [uploadWindowExpiry]);

  // Expose CTF hints
  useEffect(() => {
    // @ts-ignore - CTF hint
    window.shiphy_upload_system = {
      status: uploadUnlocked ? 'UNLOCKED' : 'LOCKED',
      hint: 'Complete the CTF challenges to obtain the upload flag',
      flagFormat: 'SHIPHY{upld_XXXX}',
      // Hidden hint
      debug: () => {
        console.log('[CTF HINT] The flag changes every 10 seconds based on timestamp.');
        console.log('[CTF HINT] Formula: SHIPHY{upld_HASH} where HASH = ((timestamp/10000) * 31337) % 9999');
      }
    };
    
    console.log('[SHIPHY] Upload system loaded. Type shiphy_upload_system for info.');
  }, [uploadUnlocked]);

  const handleFlagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verifyCtfFlag(flagInput)) {
      toast.success('Flag verified! Upload window open for 10 seconds!');
      setFlagInput('');
    } else {
      toast.error('Invalid flag. Complete all CTF challenges first.');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (!uploadUnlocked) {
      toast.error('Upload is locked. Submit the CTF flag first.');
      return;
    }
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!uploadUnlocked) {
      toast.error('Upload is locked.');
      return;
    }
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error('No file selected.');
      return;
    }

    const result = completeUpload(selectedFile);
    
    if (result.success) {
      setUploadStatus('success');
      toast.success(result.message);
    } else {
      setUploadStatus('failed');
      toast.error(result.message);
    }
    
    setSelectedFile(null);
  };

  if (!currentUser) return null;

  return (
    <DashboardLayout requiredRole="admin">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">
              Secure Document Upload
            </h1>
            <p className="text-muted-foreground mt-1">
              Upload FTE candidate list (requires authorization)
            </p>
          </div>
          <Badge 
            variant={uploadUnlocked ? 'default' : 'destructive'} 
            className="gap-1 text-sm py-2 px-4"
          >
            {uploadUnlocked ? (
              <>
                <Unlock className="h-4 w-4" />
                Upload Enabled
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Upload Disabled
              </>
            )}
          </Badge>
        </div>

        {/* Security Notice */}
        <div className="alert-banner alert-warning">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span className="font-medium">
              Critical admin actions require challenge-response verification
            </span>
          </div>
        </div>

        {/* Timer Display */}
        {timeRemaining !== null && timeRemaining > 0 && (
          <Card className="border-primary bg-primary/10">
            <CardContent className="py-6">
              <div className="flex items-center justify-center gap-4">
                <Timer className="h-8 w-8 text-primary animate-pulse" />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Upload Window Expires In</p>
                  <p className="text-4xl font-mono font-bold text-primary">
                    {timeRemaining}s
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Flag Submission */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Challenge Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFlagSubmit} className="flex gap-4">
              <Input
                type="text"
                value={flagInput}
                onChange={(e) => setFlagInput(e.target.value)}
                placeholder="Enter CTF flag: SHIPHY{...}"
                className="flex-1 font-mono"
                disabled={uploadUnlocked}
              />
              <Button type="submit" disabled={uploadUnlocked || !flagInput}>
                Verify Flag
              </Button>
            </form>
            <p className="mt-3 text-xs text-muted-foreground">
              Complete all security challenges to obtain the upload authorization flag.
            </p>
          </CardContent>
        </Card>

        {/* Upload Area */}
        <Card className={!uploadUnlocked ? 'opacity-50' : ''}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              FTE Candidate List Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`
                relative border-2 border-dashed rounded-lg p-8 text-center transition-all
                ${!uploadUnlocked ? 'cursor-not-allowed bg-muted/50' : 'cursor-pointer'}
                ${dragActive ? 'border-primary bg-primary/10' : 'border-border'}
                ${uploadAttempted ? 'border-destructive' : ''}
              `}
              onDragEnter={uploadUnlocked ? handleDrag : undefined}
              onDragLeave={uploadUnlocked ? handleDrag : undefined}
              onDragOver={uploadUnlocked ? handleDrag : undefined}
              onDrop={uploadUnlocked ? handleDrop : undefined}
              onClick={() => uploadUnlocked && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                disabled={!uploadUnlocked}
              />
              
              {!uploadUnlocked ? (
                <div className="space-y-3">
                  <Lock className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground font-medium">
                    Upload disabled during incident recovery
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Submit the authorization flag to enable upload
                  </p>
                </div>
              ) : uploadAttempted ? (
                <div className="space-y-3">
                  <XCircle className="h-12 w-12 mx-auto text-destructive" />
                  <p className="text-destructive font-medium">
                    Upload window closed
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Only one upload attempt per authorization
                  </p>
                </div>
              ) : selectedFile ? (
                <div className="space-y-3">
                  <FileText className="h-12 w-12 mx-auto text-primary" />
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                  <Button onClick={handleUpload} className="mt-4">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Now
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="h-12 w-12 mx-auto text-primary" />
                  <p className="font-medium">
                    Drag & drop your PDF here
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or click to select file
                  </p>
                  <p className="text-xs text-muted-foreground mt-4">
                    Required format: FTE_Candidates_YYYY.pdf
                  </p>
                </div>
              )}
            </div>

            {uploadStatus === 'success' && (
              <div className="mt-4 p-4 rounded-lg bg-success/20 border border-success/50 flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="text-success">FTE candidate list uploaded successfully!</span>
              </div>
            )}

            {uploadStatus === 'failed' && (
              <div className="mt-4 p-4 rounded-lg bg-destructive/20 border border-destructive/50 flex items-center gap-3">
                <XCircle className="h-5 w-5 text-destructive" />
                <span className="text-destructive">Upload failed. Please try again.</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rules Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Upload Restrictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Upload window is active for only 10 seconds after flag verification
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Only one upload attempt is allowed per authorization
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                File must be PDF format with naming: FTE_Candidates_YYYY.pdf
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Flag expires after each attempt - new challenges required
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Blue Team can reset the system at any time
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* 
          ===========================================================
          CTF HINT: The flag is generated based on timestamp/10000
          Formula: SHIPHY{upld_HASH}
          HASH = ((Math.floor(Date.now() / 10000)) * 31337) % 9999
          padded to 4 digits
          ===========================================================
        */}
      </div>
    </DashboardLayout>
  );
}
