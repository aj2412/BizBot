'use client';

import { useState } from 'react';

// Mock Data for the Inbox
const MOCK_PATIENTS = [
  { id: '1', name: 'Rahul Sharma', phone: '+91 98765 43210', lastMessage: 'Is the doctor available tomorrow?', unread: true },
  { id: '2', name: 'Priya Patel', phone: '+91 91234 56789', lastMessage: 'Thank you, I will be there.', unread: false },
  { id: '3', name: 'Amit Kumar', phone: '+91 99887 76655', lastMessage: 'Can I reschedule my appointment?', unread: false },
];

const MOCK_MESSAGES = [
  { id: 'm1', sender: 'patient', text: 'Hi, I need to book an appointment with Dr. Gupta for tomorrow.', time: '10:30 AM' },
  { id: 'm2', sender: 'bot', text: 'Hello! I am the AI assistant for City Care Clinic. Dr. Gupta has slots available tomorrow at 10:00 AM, 11:30 AM, and 4:00 PM. Which time works best for you?', time: '10:30 AM' },
  { id: 'm3', sender: 'patient', text: '11:30 AM please.', time: '10:32 AM' },
  { id: 'm4', sender: 'bot', text: 'Great! Your appointment with Dr. Gupta is confirmed for tomorrow at 11:30 AM. Reply with "CANCEL" if you need to change this later.', time: '10:32 AM' },
  { id: 'm5', sender: 'patient', text: 'Is the doctor available tomorrow?', time: '11:45 AM' },
];

export default function InboxPage() {
  const [selectedPatient, setSelectedPatient] = useState(MOCK_PATIENTS[0]);

  return (
    <div className="flex h-full bg-white">
      {/* Patient List (Left Column) */}
      <div className="w-1/3 border-r border-slate-200 flex flex-col h-[calc(100vh-64px)]">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <input 
            type="text" 
            placeholder="Search patients or numbers..." 
            className="w-full px-4 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {MOCK_PATIENTS.map(patient => (
            <div 
              key={patient.id}
              onClick={() => setSelectedPatient(patient)}
              className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition ${selectedPatient.id === patient.id ? 'bg-teal-50/50 border-l-4 border-l-teal-500' : 'border-l-4 border-l-transparent'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className={`font-medium ${patient.unread ? 'text-slate-900 font-semibold' : 'text-slate-700'}`}>{patient.name}</h3>
                <span className="text-xs text-slate-400">11:45 AM</span>
              </div>
              <p className="text-sm text-slate-500 truncate">{patient.lastMessage}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area (Right Column) */}
      <div className="w-2/3 flex flex-col h-[calc(100vh-64px)] bg-slate-50">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center shadow-sm z-10">
          <div>
            <h2 className="font-semibold text-slate-800">{selectedPatient.name}</h2>
            <p className="text-sm text-slate-500">{selectedPatient.phone}</p>
          </div>
          <button className="px-4 py-1.5 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50">
            Takeover Chat
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {MOCK_MESSAGES.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'patient' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-sm ${
                msg.sender === 'patient' 
                  ? 'bg-white border border-slate-100 text-slate-800 rounded-tl-none' 
                  : 'bg-teal-600 text-white rounded-tr-none'
              }`}>
                {msg.sender === 'bot' && (
                  <div className="text-[10px] uppercase font-bold tracking-wider text-teal-200 mb-1 flex items-center gap-1">
                    <span>🤖 AI Assistant</span>
                  </div>
                )}
                <p className="text-[15px] leading-relaxed">{msg.text}</p>
                <div className={`text-right mt-1 text-[11px] ${msg.sender === 'patient' ? 'text-slate-400' : 'text-teal-200'}`}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input Box */}
        <div className="p-4 bg-white border-t border-slate-200">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Type a manual reply... (This pauses the AI)" 
              className="w-full pl-4 pr-24 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              disabled
            />
            <button className="absolute right-2 top-2 px-4 py-1 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700 transition" disabled>
              Send
            </button>
          </div>
          <p className="text-xs text-center text-slate-400 mt-3">
            In Mock Mode, sending messages is disabled until WhatsApp Cloud API is connected.
          </p>
        </div>
      </div>
    </div>
  );
}
