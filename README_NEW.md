# OAuth 2.0 Client with PKCE - React Demo

A comprehensive demonstration of OAuth 2.0 authentication with Proof Key for Code Exchange (PKCE) using a modern React application that integrates with a Spring Boot Authorization Server.

## 🚀 What This Application Does

This is a **complete OAuth 2.0 client implementation** that demonstrates:

- **Secure Authentication**: Login/logout with industry-standard OAuth 2.0 flow
- **PKCE Security**: Enhanced security using Proof Key for Code Exchange
- **JWT Token Management**: Automatic token exchange and secure storage
- **Spring Boot Integration**: Seamless integration with Spring Security OAuth2 server
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **TypeScript**: Full type safety and excellent developer experience

## 📋 Features

### 🔐 Authentication & Security
- **OAuth 2.0 Authorization Code Flow** with PKCE
- **Automatic token exchange** from authorization code to access token
- **Secure token storage** in browser memory (not localStorage)
- **JWT token inspection** with decoded payload information
- **Session management** with proper logout functionality

### 🎨 User Interface
- **Multi-page routing**: Separate pages for home, login, and authorized areas
- **Responsive design**: Works on desktop and mobile devices
- **Modern UI components**: Built with shadcn/ui and Tailwind CSS
- **Loading states**: Visual feedback during authentication processes
- **Error handling**: Clear error messages and recovery options

### 🛠️ Developer Experience
- **TypeScript**: Full type safety throughout the application
- **React Router**: Client-side routing with protected routes
- **Context API**: Centralized authentication state management
- **Component architecture**: Modular, reusable components
- **Hot reload**: Fast development with Vite

## 🏗️ Architecture

### Application Structure
```
src/
├── contexts/
│   └── OAuthContext.tsx          # Authentication state & logic
├── pages/
│   ├── Home.tsx                  # Landing page
│   ├── Login.tsx                 # Sign-in page
│   └── Authorized.tsx            # Protected area
├── components/
│   ├── auth/                     # Authentication UI components
│   │   ├── LoginButton.tsx
│   │   ├── LogoutButton.tsx
│   │   ├── AuthStatus.tsx
│   │   ├── UserInfoDisplay.tsx
│   │   ├── TokenDisplay.tsx
│   │   └── index.ts
│   └── ui/                       # Reusable UI components
└── App.tsx                       # Main application with routing
```

### OAuth Flow
1. **User visits home page** (`/`) - Introduction and navigation
2. **User clicks "Sign In"** - Redirects to login page (`/login`)
3. **User initiates OAuth flow** - Redirects to authorization server
4. **Authorization server authenticates** - User logs in at OAuth provider
5. **Server redirects back** - Returns to `/authorized` with authorization code
6. **Client exchanges code for token** - Automatic token retrieval
7. **User accesses protected content** - Token display and user information

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern React with concurrent features
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **Lucide React** - Modern icon library

### Backend Integration
- **Spring Boot** - OAuth 2.0 Authorization Server
- **Spring Security OAuth2** - OAuth 2.0 implementation
- **JWT** - JSON Web Tokens for secure data exchange

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and npm
- **Spring Boot OAuth Server** running on `http://localhost:9000`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-oauth-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### OAuth Server Setup

This client expects a Spring Boot OAuth 2.0 server running on `http://localhost:9000` with:

- **Client ID**: `client`
- **Redirect URI**: `http://localhost:5173/authorized`
- **Scopes**: `openid profile read write`
- **Grant Types**: `authorization_code`

Example Spring Boot configuration:
```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          client:
            client-id: client
            client-secret: client-secret
            authorization-grant-type: authorization_code
            redirect-uri: http://localhost:5173/authorized
            scope: openid,profile,read,write
```

## 🔄 OAuth 2.0 Flow with PKCE

### What is PKCE?
PKCE (Proof Key for Code Exchange) is an OAuth 2.0 security extension that prevents authorization code interception attacks. It uses a cryptographically-random key (code verifier) and its hash (code challenge) to secure the authorization code flow.

### How It Works Here

1. **Code Verifier Generation**
   ```javascript
   const codeVerifier = crypto.getRandomValues(new Uint8Array(32));
   // Base64URL-encoded random bytes
   ```

2. **Code Challenge Creation**
   ```javascript
   const codeChallenge = await crypto.subtle.digest('SHA-256', codeVerifier);
   // SHA-256 hash of verifier, Base64URL-encoded
   ```

3. **Authorization Request**
   ```
   GET /oauth2/authorize?
     response_type=code&
     client_id=client&
     redirect_uri=http://localhost:5173/authorized&
     scope=openid profile read write&
     code_challenge=abc123...&
     code_challenge_method=S256
   ```

4. **Token Exchange**
   ```
   POST /oauth2/token
   Content-Type: application/x-www-form-urlencoded

   grant_type=authorization_code&
   code=auth_code_from_server&
   redirect_uri=http://localhost:5173/authorized&
   client_id=client&
   code_verifier=original_code_verifier
   ```

## 🎨 User Interface

### Home Page (`/`)
- Welcome message and OAuth introduction
- Feature highlights (security, token management, Spring Boot integration)
- "Sign In" button to start authentication

### Login Page (`/login`)
- OAuth flow initiation interface
- Information about PKCE and security features
- Navigation back to home

### Authorized Page (`/authorized`)
- Protected content area (only accessible when authenticated)
- JWT token display with copy-to-clipboard functionality
- Decoded token information (scopes, expiration, client ID)
- User information display
- Logout functionality

## 🔒 Security Features

- **PKCE Implementation**: Prevents authorization code interception
- **Secure Token Storage**: Tokens stored in memory, not localStorage
- **HTTPS Required**: Modern web security standards
- **CORS Protection**: Server-side CORS configuration required
- **Automatic Cleanup**: Session data cleared on logout
- **Route Protection**: Unauthorized users redirected to login

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop computers** (1200px+)
- **Tablets** (768px - 1199px)
- **Mobile phones** (320px - 767px)

## 🧪 Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Code Quality
- **TypeScript**: Full type checking
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting (via ESLint)

### Architecture Patterns
- **Context API**: Centralized state management
- **Custom Hooks**: Reusable authentication logic
- **Component Composition**: Modular, reusable UI components
- **Protected Routes**: Route-level authentication checks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Spring Boot OAuth2](https://docs.spring.io/spring-authorization-server/docs/current/reference/html/) for the authorization server
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [React Router](https://reactrouter.com/) for client-side routing

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
