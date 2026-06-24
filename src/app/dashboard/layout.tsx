import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-2xl font-bold tracking-tight text-teal-400">BizBot</h2>
          <p className="text-xs text-slate-400 mt-1">City Care Clinic</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="block px-4 py-2 bg-teal-500/10 text-teal-300 rounded-md">
            📥 Shared Inbox
          </Link>
          <Link href="#" className="block px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-md transition">
            🤖 AI Settings
          </Link>
          <Link href="#" className="block px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-md transition">
            📅 Appointments
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800 text-sm text-slate-400">
          ⚙️ Workspace Settings
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-800">Shared Inbox</h1>
          <div className="ml-auto flex items-center gap-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-slate-600">AI is Active</span>
          </div>
        </header>
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
