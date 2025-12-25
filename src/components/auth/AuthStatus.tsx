import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useOAuth } from '@/contexts/OAuthContext';

export const AuthStatus: React.FC = () => {
  const { error, token } = useOAuth();
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle error alerts
  useEffect(() => {
    if (error) {
      setShowError(true);
      setShowSuccess(false); // Hide success when there's an error
      const timer = setTimeout(() => {
        setShowError(false);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setShowError(false);
    }
  }, [error]);

  // Handle success alerts
  useEffect(() => {
    if (token && !error) {
      setShowSuccess(true);
      setShowError(false); // Hide error when there's success
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    } else if (!token) {
      setShowSuccess(false);
    }
  }, [token, error]);

  if (showError && error) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (showSuccess && token && !error) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Successfully authenticated!
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};
