import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Copy, Check } from 'lucide-react';
import { useOAuth } from '@/contexts/OAuthContext';
import {
  LoginButton,
  LogoutButton,
  AuthStatus,
  UserInfoDisplay,
  TokenDisplay,
} from '@/components/auth';

export const Authorized: React.FC = () => {
  const { token } = useOAuth();

  // Check if there's an authorization code in the URL (OAuth redirect in progress)
  const hasAuthCode = React.useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('code');
  }, []);

  // If not authenticated and no auth code in progress, redirect to login
  React.useEffect(() => {
    if (!token && !hasAuthCode) {
      window.location.href = '/login';
    }
  }, [token, hasAuthCode]);

  // Don't render anything if not authenticated and no auth code processing
  if (!token && !hasAuthCode) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Authorized Area</CardTitle>
          <CardDescription>
            Welcome! You have successfully authenticated with OAuth 2.0
          </CardDescription>
          <div className="flex justify-start mt-4 space-x-2">
            <Link to="/">
              <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </button>
            </Link>
            <Link to="/login">
              <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                Switch Account
              </button>
            </Link>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <AuthStatus />

          <div className="space-y-4">
            <UserInfoDisplay />
            <TokenDisplay />

            <TokenDisplayWithCopy token={token} />
          </div>
        </CardContent>

        <CardFooter>
          <LogoutButton />
        </CardFooter>
      </Card>
    </div>
  );
};

// Component for JWT token display with copy functionality
const TokenDisplayWithCopy: React.FC<{ token: string }> = ({ token }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy token:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = token;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="bg-slate-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm">Access Token (JWT)</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          className="h-8 px-2 text-xs"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 mr-1" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </>
          )}
        </Button>
      </div>
      <div className="bg-white border rounded p-3 text-xs font-mono break-all text-slate-700 max-h-32 overflow-y-auto">
        {token}
      </div>
    </div>
  );
};
