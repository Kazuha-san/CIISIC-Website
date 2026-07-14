import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowLeft, Building2, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const AdminLogin: React.FC = () => {
  const { login, showToast } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your administrative email address.');
      return;
    }
    if (!password) {
      setError('Please enter your administrative password.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid corporate email address.');
      return;
    }

    setIsLoading(true);

    // Simulate small verification delay for professional federal look
    setTimeout(() => {
      // Validate credentials strictly
      if (email.toLowerCase() === 'admin@ciisic.org' && password === 'CIIAdmin@2026') {
        const res = login(email, 'admin');
        setIsLoading(false);

        if (res.success) {
          showToast('Successfully logged in as CII Administrator.', 'success');
          navigate('/admin/dashboard');
        } else {
          setError('Authentication service error. Please try again.');
        }
      } else {
        setIsLoading(false);
        setError('Invalid email or password.');
      }
    }, 600);
  };

  const handleQuickLogin = () => {
    setEmail('admin@ciisic.org');
    setPassword('CIIAdmin@2026');
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 relative">
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0b2545] mb-6 transition-colors">
            <ArrowLeft className="h-3 w-3" /> Back to Homepage
          </Link>
          <div className="mx-auto h-12 w-12 rounded-2xl bg-[#0b2545] border-2 border-[#c5a880] flex items-center justify-center text-[#c5a880] shadow-md">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-3xl font-black text-[#0b2545] tracking-tight font-display">
            CII Admin Portal
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Review submissions, publish requirements &amp; manage academic partners
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl premium-shadow">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-800 leading-relaxed">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                CII Administrative Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ciisic.org"
                  className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0b2545] focus:ring-1 focus:ring-[#0b2545] transition-all bg-slate-50/50"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Administrative Key
                </label>
                <button
                  type="button"
                  onClick={() => alert('Instruction: Please use the demo credentials to reset or contact CII support.')}
                  className="text-xs font-bold text-[#8f6d3b] hover:text-[#0b2545] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0b2545] focus:ring-1 focus:ring-[#0b2545] transition-all bg-slate-50/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me checkbox */}
            <div className="flex items-center">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-[#0b2545] focus:ring-[#0b2545] border-slate-300 rounded"
              />
              <label htmlFor="remember_me" className="ml-2 block text-xs font-bold text-slate-700 uppercase tracking-wide cursor-pointer">
                Remember Me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-[#c5a880]/40 rounded-xl text-sm font-bold text-white bg-[#0b2545] hover:bg-[#134074] focus:outline-none transition-all duration-150 disabled:opacity-50 cursor-pointer shadow-sm active:scale-[0.99]"
            >
              {isLoading ? 'Decrypting Credentials...' : 'Secure Administrator Sign In'}
            </button>
          </form>

          {/* Demo Credentials Assist Card */}
          <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
            <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Demo Credentials
            </p>
            <div className="bg-[#eef4f8] p-4 rounded-xl border border-blue-100 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="text-left text-xs space-y-0.5">
                <p className="text-slate-500">Email: <strong className="font-semibold text-[#0b2545]">admin@ciisic.org</strong></p>
                <p className="text-slate-500">Password: <strong className="font-semibold text-[#0b2545]">CIIAdmin@2026</strong></p>
              </div>
              <button
                type="button"
                onClick={handleQuickLogin}
                className="shrink-0 text-[10px] font-black uppercase bg-white border border-slate-200 hover:border-[#0b2545] text-[#0b2545] px-3.5 py-2 rounded-lg transition-colors shadow-sm active:scale-95"
              >
                Autofill Credentials
              </button>
            </div>
          </div>
        </div>

        {/* Alternate link */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            Are you a Corporate Representative?{' '}
            <Link to="/industry/login" className="font-bold text-[#8f6d3b] hover:text-[#0b2545] underline flex items-center justify-center gap-1 mt-1">
              <Building2 className="h-3.5 w-3.5" /> Go to Industry Partner Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
