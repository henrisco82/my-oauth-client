import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useOAuth } from '@/contexts/OAuthContext';

export const LogoutButton: React.FC = () => {
  const { logout } = useOAuth();

  return (
    <Button
      onClick={logout}
      variant="outline"
      className="w-full"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sign Out
    </Button>
  );
};
