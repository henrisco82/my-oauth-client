import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, LogIn } from 'lucide-react';
import { useOAuth } from '@/contexts/OAuthContext';

export const LoginButton: React.FC = () => {
  const { login, loading } = useOAuth();

  return (
    <div className="text-center py-8">
      <p className="text-slate-600 mb-6">
        Sign in to access protected resources
      </p>
      <Button
        onClick={login}
        disabled={loading}
        size="lg"
        className="w-full sm:w-auto bg-black text-white hover:bg-gray-800"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Redirecting...
          </>
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" />
            Sign In with OAuth
          </>
        )}
      </Button>
    </div>
  );
};
