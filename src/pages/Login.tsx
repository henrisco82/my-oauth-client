import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Home } from 'lucide-react';
import { LoginButton, AuthStatus } from '@/components/auth';

export const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Sign In</CardTitle>
          <CardDescription>
            Sign in to access protected resources with OAuth 2.0 and PKCE
          </CardDescription>
          <div className="flex justify-start mt-4">
            <Link to="/">
              <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </button>
            </Link>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <AuthStatus />

          <div className="space-y-4">
            <LoginButton />
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">About OAuth 2.0 with PKCE</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>PKCE</strong> (Proof Key for Code Exchange) enhances security</li>
              <li>• <strong>Spring Boot</strong> Authorization Server handles authentication</li>
              <li>• <strong>Secure token exchange</strong> prevents authorization code interception</li>
              <li>• <strong>JWT tokens</strong> provide secure access to protected resources</li>
            </ul>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>Authorization Server: localhost:9000</p>
            <p>PKCE Enabled • Secure Flow</p>
          </div>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-xs text-gray-500">
            Upon successful authentication, you'll be redirected to the authorized area
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
