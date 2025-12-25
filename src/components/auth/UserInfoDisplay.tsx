import React from 'react';
import { useOAuth } from '@/contexts/OAuthContext';

export const UserInfoDisplay: React.FC = () => {
  const { userInfo } = useOAuth();

  if (!userInfo) return null;

  return (
    <div className="bg-slate-50 rounded-lg p-4">
      <h3 className="font-semibold mb-2">User Information</h3>
      <div className="space-y-1 text-sm">
        <p><span className="font-medium">Subject:</span> {userInfo.sub}</p>
        {userInfo.name && <p><span className="font-medium">Name:</span> {userInfo.name}</p>}
        {userInfo.email && <p><span className="font-medium">Email:</span> {userInfo.email}</p>}
      </div>
    </div>
  );
};
