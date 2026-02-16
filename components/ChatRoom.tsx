
import React, { useState, useRef, useEffect } from 'react';
import { Message, UserProfile } from '../types';

interface ChatRoomProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isTyping: boolean;
  profile: UserProfile;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ messages, onSendMessage, isTyping, profile }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-orange-400 p-4 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
            🌴
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">{profile.buddyName}</h2>
            <p className="text-xs opacity-90">Đang chill cùng bạn tại Sài Gòn</p>
          </div>
        </div>
        <div className="text-xs bg-black/10 px-2 py-1 rounded-full uppercase tracking-wider font-semibold">
          {profile.mode} Mode
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed"
      >
        {messages.length === 0 && (
          <div className="text-center py-10 space-y-2">
            <p className="text-slate-400 italic">"Chào mày! Tao là Sài Gòn Buddy đây..."</p>
            <p className="text-xs text-slate-300">Bắt đầu trò chuyện để Buddy hiểu mày hơn nhen!</p>
          </div>
        )}
        
        {messages.map((msg, i) => {
          const isBuddy = msg.role === 'model';
          // Clean up JSON from text for display
          const cleanText = msg.content.replace(/```json[\s\S]*?```/g, '').trim();
          if (!cleanText && isBuddy) return null;

          return (
            <div key={i} className={`flex ${isBuddy ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                isBuddy 
                ? 'bg-slate-100 text-slate-800 rounded-tl-none' 
                : 'bg-emerald-500 text-white rounded-tr-none'
              }`}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{cleanText}</p>
                <span className="text-[10px] opacity-50 block mt-1 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-100 rounded-2xl p-3 rounded-tl-none flex gap-1 items-center">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-100 flex gap-2 bg-slate-50">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhắn gì cho Buddy đi..."
          className="flex-1 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
        />
        <button 
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-lg shadow-emerald-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
