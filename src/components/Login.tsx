import React, { useState } from 'react';
import { Shield, Mail, Lock, AlertTriangle, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { validateEmail, validatePassword } from '../utils/validation';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const { login, signup } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await login(email, password);
    if (!success) {
      setError('Invalid email or password. Please check your credentials.');
    }
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error!);
      setIsLoading(false);
      return;
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.error!);
      setIsLoading(false);
      return;
    }

    // Validate name
    if (!name.trim()) {
      setError('Full name is required');
      setIsLoading(false);
      return;
    }

    const result = await signup(email, password, name.trim());
    if (!result.success) {
      setError(result.error!);
    }
    setIsLoading(false);
  };

  const fillDemoCredentials = (type: 'admin' | 'student') => {
    if (type === 'admin') {
      setEmail('sarah.johnson@crescent.education');
      setPassword('admin123');
    } else {
      setEmail('123456@crescent.education');
      setPassword('student123');
    }
    setName('');
    setIsSignup(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4" role="main">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md" role="form" aria-labelledby="auth-title">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 rounded-full p-3" aria-hidden="true">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 id="auth-title" className="text-2xl font-bold text-gray-900 mb-2">
            Crescent Sentinel
          </h1>
          <p className="text-gray-600">Anti-Ragging Protection System</p>
          <p className="text-sm text-gray-500 mt-2">
            {isSignup ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>

        <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-6" noValidate>
          {isSignup && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500" aria-label="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your full name"
                required={isSignup}
                aria-describedby={error && !email && !password ? "error-message" : undefined}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500" aria-label="required">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" aria-hidden="true" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder={isSignup ? "123456@crescent.education or name@crescent.education" : "Enter your email"}
                required
                aria-describedby="email-help"
                autoComplete="email"
              />
            </div>
            <p id="email-help" className="text-xs text-gray-500 mt-1">
              Students: 6 digits@crescent.education • Admins: name@crescent.education
            </p>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password <span className="text-red-500" aria-label="required">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" aria-hidden="true" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your password"
                required
                aria-describedby={isSignup ? "password-help" : undefined}
                autoComplete={isSignup ? "new-password" : "current-password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {isSignup && (
              <p id="password-help" className="text-xs text-gray-500 mt-1">
                Must be at least 8 characters with uppercase, lowercase, and number
              </p>
            )}
          </div>

          {error && (
            <div 
              id="error-message" 
              className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg"
              role="alert"
              aria-live="polite"
            >
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-describedby={isLoading ? "loading-message" : undefined}
          >
            {isLoading ? (
              <span id="loading-message">
                {isSignup ? 'Creating Account...' : 'Signing in...'}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                {isSignup && <UserPlus className="h-4 w-4" />}
                {isSignup ? 'Create Account' : 'Sign In'}
              </span>
            )}
          </button>
        </form>

        {/* Toggle between login and signup */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
              setEmail('');
              setPassword('');
              setName('');
            }}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors focus:outline-none focus:underline"
          >
            {isSignup ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
          </button>
        </div>

        {!isSignup && (
          <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600 mb-4">Demo Credentials</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => fillDemoCredentials('admin')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              aria-label="Fill admin demo credentials"
            >
              Admin Login
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('student')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              aria-label="Fill student demo credentials"
            >
              Student Login
            </button>
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;