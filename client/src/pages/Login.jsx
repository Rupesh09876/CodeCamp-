import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        toast.success('Welcome back!');
        if (res.user && res.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        toast.error(res.message || 'Login failed');
      }
    } catch (err) {
      toast.error('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-base)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[var(--color-primary)] opacity-10 blur-[150px] rounded-full mix-blend-multiply pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[var(--color-accent)] opacity-10 blur-[150px] rounded-full mix-blend-multiply pointer-events-none"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block text-3xl font-bold tracking-tight text-slate-900 mb-2">
            CodeCamp <span className="text-[var(--color-primary)]">AI</span>
          </Link>
          <p className="text-[var(--color-text-secondary)]">Your personalized coding platform</p>
        </div>

        <Card className="p-8 shadow-xl border border-[var(--color-ui-border)]/60 bg-[var(--color-card)]/80 backdrop-blur-xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Welcome Back 🎉</h2>
            <p className="text-[var(--color-text-secondary)]">Login to continue your coding journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-[var(--color-surface)] border border-[var(--color-ui-border)] rounded-lg text-[var(--color-text-primary)] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-[var(--color-text-primary)]">Password</label>
                <Link to="/forgot-password" name="forgot-password" id="forgot-password" className="text-sm text-[var(--color-primary)] hover:text-indigo-600 font-medium">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 bg-[var(--color-surface)] border border-[var(--color-ui-border)] rounded-lg text-[var(--color-text-primary)] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-[var(--color-text-primary)] focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full py-3 text-white shadow-lg shadow-indigo-500/20" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Login'}
            </Button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--color-ui-border)]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-[var(--color-text-secondary)]">Or continue with</span>
            </div>
          </div>

          <div className="mt-8">
            <button className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-[var(--color-ui-border)] rounded-lg shadow-sm bg-white text-sm font-medium text-[var(--color-text-primary)] hover:bg-slate-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>
        </Card>

        <p className="mt-8 text-center text-sm text-[var(--color-text-secondary)]">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-[var(--color-primary)] hover:text-indigo-600">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
