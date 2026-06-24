'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { createIcons, icons } from 'lucide';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    createIcons({ icons });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#0A1628] flex text-white font-sans">
      {/* Sidebar - Dark Glassmorphism */}
      <aside className="w-64 bg-[#152336]/80 backdrop-blur-md border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8">
                <mask id="crossMaskNav">
                    <rect width="24" height="24" fill="white" />
                    <path d="M13 14h-2v-2H9v-2h2V8h2v2h2v2h-2v2z" fill="black" />
                </mask>
                <path mask="url(#crossMaskNav)" fill="#00BFA6" d="M12 2C6.477 2 2 6.029 2 11c0 2.849 1.438 5.394 3.665 7.027L4 22l4.316-1.92A10.825 10.825 0 0 0 12 20c5.523 0 10-4.029 10-9s-4.477-9-10-9z"/>
            </svg>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">BizBot</h2>
            <p className="text-[10px] uppercase tracking-wider text-[#00BFA6]">City Care Clinic</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#0D7A6D]/20 to-transparent border-l-2 border-[#00BFA6] text-white rounded-r-lg transition">
            <i data-lucide="inbox" className="w-5 h-5 text-[#00BFA6]"></i>
            <span className="font-medium">Shared Inbox</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-[#94a3b8] hover:text-white hover:bg-white/5 rounded-lg transition">
            <i data-lucide="bot" className="w-5 h-5"></i>
            <span className="font-medium">AI Settings</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-[#94a3b8] hover:text-white hover:bg-white/5 rounded-lg transition">
            <i data-lucide="calendar" className="w-5 h-5"></i>
            <span className="font-medium">Appointments</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-[#94a3b8] hover:text-white hover:bg-white/5 rounded-lg transition">
            <i data-lucide="users" className="w-5 h-5"></i>
            <span className="font-medium">Patients CRM</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-[#94a3b8] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition"
          >
            <i data-lucide="log-out" className="w-5 h-5"></i>
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0A1628]">
        {children}
      </main>
    </div>
  );
}
