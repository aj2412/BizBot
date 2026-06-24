'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setError("Check your email for the confirmation link.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#152336] rounded-2xl shadow-xl overflow-hidden border border-white/5">
        <div className="p-8">
          <div className="flex justify-center mb-8">
             {/* Dynamic inline SVG Logo */}
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-12 h-12">
                <mask id="crossMaskLogin">
                    <rect width="24" height="24" fill="white" />
                    <path d="M13 14h-2v-2H9v-2h2V8h2v2h2v2h-2v2z" fill="black" />
                </mask>
                <path mask="url(#crossMaskLogin)" fill="#00BFA6" d="M12 2C6.477 2 2 6.029 2 11c0 2.849 1.438 5.394 3.665 7.027L4 22l4.316-1.92A10.825 10.825 0 0 0 12 20c5.523 0 10-4.029 10-9s-4.477-9-10-9z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white text-center mb-2">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-[#475569] text-center mb-8">
            {isSignUp ? 'Start automating your clinic today.' : 'Sign in to access your dashboard.'}
          </p>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#94a3b8] mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#0A1628] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00BFA6] transition-all"
                placeholder="doctor@clinic.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#94a3b8] mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#0A1628] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00BFA6] transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-400 text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#0D7A6D] to-[#00BFA6] hover:from-[#0B685D] hover:to-[#00A38D] text-white font-medium rounded-lg shadow-lg shadow-teal-900/20 transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => { setIsSignUp(!isSignUp); setError(null); }} 
              className="text-sm text-[#00BFA6] hover:text-white transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
        <div className="p-4 border-t border-white/5 bg-[#0A1628]/50 text-center">
          <Link href="/" className="text-sm text-[#475569] hover:text-white transition-colors">
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
