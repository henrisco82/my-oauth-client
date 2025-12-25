import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useOAuth } from '@/contexts/OAuthContext';

export const AuthStatus: React.FC = () => {
  const { error, token } = useOAuth();

  if (error) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Only show success message if authenticated (has token) and no error
  if (token) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Successfully authenticated!
        </AlertDescription>
      </Alert>
    );
  }

  // Don't show anything if not authenticated and no error
  return null;
};
