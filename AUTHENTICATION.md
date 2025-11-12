# Authentication Implementation

## Overview
This Angular application now includes JWT-based authentication and authorization to protect routes and secure API requests.

## Features Implemented

### 1. Authentication Service (`/src/app/services/auth.ts`)
- **Sign In**: Authenticates users with email and password
- **Sign Up**: Registers new users with username, email, password, and role
- **Token Management**: Stores JWT tokens in localStorage
- **Auth State**: Uses Angular signals to manage authentication state
- **Sign Out**: Clears tokens and redirects to sign-in page

### 2. Route Protection
- **Auth Guard** (`/src/app/guards/auth.guard.ts`): Protects routes from unauthorized access
- **Protected Routes**:
  - `/` (Dashboard)
  - `/ani-list` (Ani List)
  - `/settings` (Settings)
- **Public Routes**:
  - `/sign-in` (Sign In page)
  - `/sign-up` (Sign Up page)

### 3. HTTP Interceptor (`/src/app/interceptors/auth.interceptor.ts`)
- Automatically attaches JWT token to all outgoing HTTP requests
- Adds `Authorization: Bearer <token>` header

### 4. UI Components

#### Sign In Component (`/src/app/component/sign-in/`)
- Email and password form
- Form validation
- Error handling
- Link to sign-up page
- Redirects to returnUrl after successful sign-in

#### Sign Up Component (`/src/app/component/sign-up/`)
- Username, email, password, confirm password, and role form
- Password matching validation
- Form validation
- Success/error messaging
- Auto-redirect to sign-in after successful registration

#### Navigation Bar
- Displays when user is authenticated
- Shows Dashboard, Ani List, Settings links
- Sign Out button

## GraphQL Mutations

### Sign In
```graphql
mutation SignIn($input: SignInInput!) {
  signIn(input: $input) {
    userId
    role
    accessToken
  }
}
```

**Input:**
```typescript
{
  email: string
  password: string
}
```

**Response:**
```typescript
{
  userId: string
  role: string
  accessToken: string
}
```

### Sign Up
```graphql
mutation SignUp($input: CreateUserInput!) {
  signUp(input: $input) {
    id
    username
    email
    role
  }
}
```

**Input:**
```typescript
{
  username: string
  email: string
  role: string
  password: string
}
```

**Response:**
```typescript
{
  id: string
  username: string
  email: string
  role: string
}
```

## How It Works

1. **Unauthenticated Access**: When users try to access protected routes without being authenticated, they are redirected to `/sign-in`

2. **Sign In Flow**:
   - User enters email and password
   - Application sends GraphQL mutation to backend
   - On success, JWT token and user data are stored in localStorage
   - Auth state is updated using signals
   - User is redirected to the originally requested page or dashboard

3. **Sign Up Flow**:
   - User enters username, email, password, and selects role
   - Application validates form (password matching, email format, etc.)
   - GraphQL mutation is sent to backend
   - On success, user is redirected to sign-in page

4. **Authenticated Requests**:
   - HTTP interceptor automatically adds JWT token to all requests
   - Token is sent as `Authorization: Bearer <token>` header

5. **Sign Out**:
   - Clears token and user data from localStorage
   - Resets auth state
   - Redirects to sign-in page

## Security Features

- **JWT Token Storage**: Tokens are stored in localStorage
- **Route Guards**: Prevent unauthorized access to protected routes
- **HTTP Interceptor**: Automatically includes auth token in requests
- **Form Validation**: Client-side validation for all forms
- **Password Matching**: Ensures password confirmation matches

## Usage

### Accessing the Application
1. Navigate to the application
2. You'll be redirected to `/sign-in` if not authenticated
3. Sign in with existing credentials or click "Create an Account"

### Creating a New Account
1. Click "Create an Account" from sign-in page
2. Fill in username, email, password, confirm password
3. Select role (USER or ADMIN)
4. Click "Sign Up"
5. After success, you'll be redirected to sign-in

### Signing In
1. Enter email and password
2. Click "Sign In"
3. You'll be redirected to dashboard or the page you originally tried to access

### Signing Out
1. Click "Sign Out" in the navigation bar
2. You'll be redirected to sign-in page

## Development Notes

- Uses Angular Signals for reactive state management
- Uses Reactive Forms with validation
- Follows Angular standalone components architecture
- Uses daisyUI for styling
- Implements functional route guards (CanActivateFn)
- Uses functional HTTP interceptors (HttpInterceptorFn)

## Next Steps

Consider implementing:
- Refresh token mechanism
- Role-based access control (RBAC) for specific features
- Remember me functionality
- Password reset flow
- Email verification
- Session timeout handling
- Token expiration detection and auto-logout
