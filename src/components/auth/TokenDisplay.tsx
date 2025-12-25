import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useOAuth } from '@/contexts/OAuthContext';

export const TokenDisplay: React.FC = () => {
  const { tokenPayload, getScopes } = useOAuth();

  if (!tokenPayload) return null;

  return (
    <div className="bg-slate-50 rounded-lg p-4">
      <h3 className="font-semibold mb-3">Token Information</h3>
      <div className="space-y-2">
        <div>
          <span className="text-sm font-medium text-slate-600">Scopes:</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {getScopes(tokenPayload.scope).map(scope => (
              <Badge key={scope} variant="secondary">{scope}</Badge>
            ))}
          </div>
        </div>
        <div className="text-sm">
          <span className="font-medium text-slate-600">Issued:</span>{' '}
          {new Date(tokenPayload.iat * 1000).toLocaleString()}
        </div>
        <div className="text-sm">
          <span className="font-medium text-slate-600">Expires:</span>{' '}
          {new Date(tokenPayload.exp * 1000).toLocaleString()}
        </div>
        <div className="text-sm">
          <span className="font-medium text-slate-600">Client ID:</span>{' '}
          {tokenPayload.client_id || tokenPayload.azp}
        </div>
      </div>
    </div>
  );
};
