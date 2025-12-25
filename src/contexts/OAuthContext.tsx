import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserInfo {
  sub: string;
  name?: string;
  email?: string;
}

interface TokenPayload {
  scope?: string;
  iat: number;
  exp: number;
  client_id?: string;
  azp?: string;
}

interface OAuthContextType {
  token: string | null;
  loading: boolean;
  error: string | null;
  userInfo: UserInfo | null;
  login: () => Promise<void>;
  logout: () => void;
  getScopes: (scope: any) => string[];
  tokenPayload: TokenPayload | null;
}

const OAuthContext = createContext<OAuthContextType | undefined>(undefined);

// OAuth configuration
const AUTH_SERVER = 'http://localhost:9000';
const CLIENT_ID = 'client';
const REDIRECT_URI = 'http://localhost:5173/authorized';
const SCOPE = 'openid profile read write';

export const OAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // Generate PKCE code verifier and challenge
  const generateCodeVerifier = (): string => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  };

  const generateCodeChallenge = async (verifier: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hash)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  };

  // Helper function to get scopes as array regardless of format
  const getScopes = (scope: any): string[] => {
    if (Array.isArray(scope)) {
      return scope;
    }
    if (typeof scope === 'string') {
      return scope.split(' ');
    }
    return [];
  };

  // Check for authorization code in URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code && !token) {
      exchangeCodeForToken(code);
    }
  }, []);

  const login = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Generate PKCE parameters
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      // Store code verifier for token exchange
      sessionStorage.setItem('code_verifier', codeVerifier);

      // Build authorization URL
      const authUrl = new URL(`${AUTH_SERVER}/oauth2/authorize`);
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('client_id', CLIENT_ID);
      authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
      authUrl.searchParams.append('scope', SCOPE);
      authUrl.searchParams.append('code_challenge', codeChallenge);
      authUrl.searchParams.append('code_challenge_method', 'S256');

      // Redirect to authorization server
      window.location.href = authUrl.toString();
    } catch (err) {
      setError('Failed to initiate login: ' + (err as Error).message);
      setLoading(false);
    }
  };

  const exchangeCodeForToken = async (code: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const codeVerifier = sessionStorage.getItem('code_verifier');

      if (!codeVerifier) {
        throw new Error('Code verifier not found in sessionStorage');
      }

      const params = new URLSearchParams();
      params.append('grant_type', 'authorization_code');
      params.append('code', code);
      params.append('redirect_uri', REDIRECT_URI);
      params.append('client_id', CLIENT_ID);
      params.append('code_verifier', codeVerifier);

      console.log('Token exchange request:', {
        url: `${AUTH_SERVER}/oauth2/token`,
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        code_verifier: codeVerifier.substring(0, 10) + '...' // Log partial verifier for debugging
      });

      const response = await fetch(`${AUTH_SERVER}/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: params,
      });

      console.log('Token exchange response status:', response.status);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          console.error('OAuth server error response:', errorData);
          errorMessage = errorData.error_description || errorData.error || errorMessage;
        } catch (e) {
          // If we can't parse JSON, use the HTTP status
          const responseText = await response.text();
          console.error('OAuth server response text:', responseText);
          if (responseText) {
            errorMessage += ` - ${responseText}`;
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Token exchange successful');

      // Store tokens in state only (memory)
      setToken(data.access_token);

      // Clean up
      sessionStorage.removeItem('code_verifier');
      window.history.replaceState({}, document.title, window.location.pathname);

      // Fetch user info
      await fetchUserInfo(data.access_token);

      // User is already on the authorized page after OAuth redirect, no need to navigate
    } catch (err) {
      console.error('Token exchange error:', err);
      setError('Token exchange failed: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInfo = async (accessToken: string): Promise<void> => {
    try {
      const response = await fetch(`${AUTH_SERVER}/userinfo`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data: UserInfo = await response.json();
        setUserInfo(data);
      } else {
        console.warn(`Userinfo endpoint returned ${response.status}: ${response.statusText}`);
        // Don't set userInfo if we can't fetch it - the token display will still work
      }
    } catch (err) {
      console.warn('Failed to fetch user info:', err);
      // Don't throw error - userinfo is optional, token display still works
    }
  };

  const logout = (): void => {
    setToken(null);
    setUserInfo(null);
    sessionStorage.removeItem('code_verifier');
    navigate('/login');
  };

  const decodeJWT = (token: string): TokenPayload | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const tokenPayload: TokenPayload | null = token ? decodeJWT(token) : null;

  // Debug: Log token payload for troubleshooting
  React.useEffect(() => {
    if (tokenPayload) {
      console.log('Token payload:', tokenPayload);
      console.log('Scope type:', typeof tokenPayload.scope);
      console.log('Scope value:', tokenPayload.scope);
    }
  }, [tokenPayload]);

  const value: OAuthContextType = {
    token,
    loading,
    error,
    userInfo,
    login,
    logout,
    getScopes,
    tokenPayload,
  };

  return (
    <OAuthContext.Provider value={value}>
      {children}
    </OAuthContext.Provider>
  );
};

export const useOAuth = (): OAuthContextType => {
  const context = useContext(OAuthContext);
  if (context === undefined) {
    throw new Error('useOAuth must be used within an OAuthProvider');
  }
  return context;
};
