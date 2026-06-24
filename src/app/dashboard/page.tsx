'use client';

import { useState, useEffect } from 'react';
import { createIcons, icons } from 'lucide';

// Mock Data
const MOCK_PATIENTS = [
  { id: '1', name: 'Rahul Sharma', phone: '+91 98765 43210', lastMessage: 'Is the doctor available tomorrow?', unread: true, lastActive: '2 min ago', visits: 3, nextAppt: 'None' },
  { id: '2', name: 'Priya Patel', phone: '+91 91234 56789', lastMessage: 'Thank you, I will be there.', unread: false, lastActive: '1 hr ago', visits: 1, nextAppt: 'Tomorrow, 11:30 AM' },
  { id: '3', name: 'Amit Kumar', phone: '+91 99887 76655', lastMessage: 'Can I reschedule my appointment?', unread: false, lastActive: 'Yesterday', visits: 5, nextAppt: 'Oct 12, 4:00 PM' },
];

const MOCK_MESSAGES = [
  { id: 'm1', sender: 'patient', text: 'Hi, I need to book an appointment with Dr. Gupta for tomorrow.', time: '10:30 AM', status: 'read' },
  { id: 'm2', sender: 'bot', text: 'Hello! I am the AI assistant for City Care Clinic. Dr. Gupta has slots available tomorrow at 10:00 AM, 11:30 AM, and 4:00 PM. Which time works best for you?', time: '10:30 AM', status: 'read' },
  { id: 'm3', sender: 'patient', text: '11:30 AM please.', time: '10:32 AM', status: 'read' },
  { id: 'm4', sender: 'bot', text: 'Great! Your appointment with Dr. Gupta is confirmed for tomorrow at 11:30 AM. Reply with "CANCEL" if you need to change this later.', time: '10:32 AM', status: 'read' },
  { id: 'm5', sender: 'patient', text: 'Is the doctor available tomorrow?', time: '11:45 AM', status: 'delivered' },
];

export default function InboxPage() {
  const [selectedPatient, setSelectedPatient] = useState(MOCK_PATIENTS[0]);

  useEffect(() => {
    createIcons({ icons });
  }, [selectedPatient]);

  return (
    <div className="flex h-full w-full">
      {/* 1. Contacts List (Left Panel) */}
      <div className="w-[320px] border-r border-white/5 flex flex-col bg-[#0f1c2e]">
        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <i data-lucide="search" className="absolute left-3 top-2.5 w-4 h-4 text-[#94a3b8]"></i>
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="w-full pl-9 pr-4 py-2 bg-[#152336] border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-[#00BFA6] transition"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {MOCK_PATIENTS.map(patient => (
            <div 
              key={patient.id}
              onClick={() => setSelectedPatient(patient)}
              className={`p-4 border-b border-white/5 cursor-pointer transition ${selectedPatient.id === patient.id ? 'bg-[#152336] border-l-2 border-l-[#00BFA6]' : 'hover:bg-[#152336]/50 border-l-2 border-l-transparent'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className={`font-medium ${patient.unread ? 'text-white' : 'text-[#cbd5e1]'}`}>{patient.name}</h3>
                <span className={`text-xs ${patient.unread ? 'text-[#00BFA6]' : 'text-[#64748b]'}`}>{patient.lastActive}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className={`text-sm truncate pr-4 ${patient.unread ? 'text-[#e2e8f0]' : 'text-[#64748b]'}`}>{patient.lastMessage}</p>
                {patient.unread && (
                  <div className="w-2 h-2 rounded-full bg-[#00BFA6] flex-shrink-0 shadow-[0_0_8px_rgba(0,191,166,0.8)]"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Chat Area (Center Panel) */}
      <div className="flex-1 flex flex-col bg-[#0A1628] relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-white/5 bg-[#0f1c2e]/80 backdrop-blur-md flex justify-between items-center z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0D7A6D] to-[#00BFA6] flex items-center justify-center text-white font-bold shadow-lg">
              {selectedPatient.name.charAt(0)}
            </div>
            <div>
              <h2 className="font-semibold text-white flex items-center gap-2">
                {selectedPatient.name}
              </h2>
              <p className="text-xs text-[#94a3b8] flex items-center gap-1">
                <i data-lucide="phone" className="w-3 h-3"></i> {selectedPatient.phone}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#00BFA6]/10 border border-[#00BFA6]/20 rounded-full">
                <div className="w-2 h-2 bg-[#00BFA6] rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-[#00BFA6]">AI Active</span>
            </div>
            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-white hover:bg-white/10 transition flex items-center gap-2">
              <i data-lucide="user-x" className="w-4 h-4"></i> Pause AI
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 z-10 custom-scrollbar">
          {MOCK_MESSAGES.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'patient' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-lg relative ${
                msg.sender === 'patient' 
                  ? 'bg-[#152336] text-[#e2e8f0] rounded-tl-sm border border-white/5' 
                  : 'bg-gradient-to-br from-[#0D7A6D] to-[#00A38D] text-white rounded-tr-sm'
              }`}>
                {msg.sender === 'bot' && (
                  <div className="text-[10px] uppercase font-bold tracking-wider text-[#ccfbf1] mb-1.5 flex items-center gap-1 opacity-90">
                    <i data-lucide="sparkles" className="w-3 h-3"></i> AI Assistant
                  </div>
                )}
                <p className="text-[15px] leading-relaxed">{msg.text}</p>
                <div className={`flex items-center justify-end gap-1 mt-1.5 text-[11px] ${msg.sender === 'patient' ? 'text-[#64748b]' : 'text-[#ccfbf1]'}`}>
                  {msg.time}
                  {msg.sender === 'bot' && (
                    <i data-lucide="check-check" className="w-3 h-3 opacity-80"></i>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input Box */}
        <div className="p-4 bg-[#0f1c2e] border-t border-white/5 z-10">
          <div className="relative flex items-center gap-2">
            <button className="p-3 text-[#94a3b8] hover:text-white transition rounded-full hover:bg-white/5">
                <i data-lucide="paperclip" className="w-5 h-5"></i>
            </button>
            <input 
              type="text" 
              placeholder="Type a manual reply... (This pauses the AI automatically)" 
              className="flex-1 py-3 px-4 bg-[#152336] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00BFA6] transition"
              disabled
            />
            <button className="p-3 bg-[#00BFA6] text-[#0A1628] rounded-xl hover:bg-[#00d6ba] shadow-[0_0_15px_rgba(0,191,166,0.3)] transition flex items-center justify-center" disabled>
              <i data-lucide="send" className="w-5 h-5 ml-1"></i>
            </button>
          </div>
        </div>
      </div>

      {/* 3. CRM Panel (Right Panel) */}
      <div className="w-[300px] border-l border-white/5 bg-[#0f1c2e] flex flex-col p-6 hidden lg:flex">
        <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#152336] flex items-center justify-center text-3xl text-white font-bold mb-4 border-2 border-white/5">
              {selectedPatient.name.charAt(0)}
            </div>
            <h2 className="text-lg font-bold text-white">{selectedPatient.name}</h2>
            <p className="text-[#94a3b8] text-sm">{selectedPatient.phone}</p>
        </div>

        <div className="space-y-6 flex-1">
            <div className="bg-[#152336] rounded-xl p-4 border border-white/5">
                <h3 className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <i data-lucide="calendar" className="w-4 h-4"></i> Upcoming Appt
                </h3>
                <p className="text-[#e2e8f0] font-medium">{selectedPatient.nextAppt}</p>
                {selectedPatient.nextAppt !== 'None' && (
                    <button className="mt-3 w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white transition border border-white/5">
                        Manage Booking
                    </button>
                )}
            </div>

            <div className="bg-[#152336] rounded-xl p-4 border border-white/5">
                <h3 className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <i data-lucide="activity" className="w-4 h-4"></i> Activity
                </h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-[#94a3b8]">Total Visits</span>
                        <span className="text-white font-medium">{selectedPatient.visits}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[#94a3b8]">Last Active</span>
                        <span className="text-white font-medium">{selectedPatient.lastActive}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
