
import React, { useState, useEffect, useCallback } from 'react';
import { ChatMode, UserProfile, Message, SaigonLocation } from './types';
import { INITIAL_PROFILE, SAIGON_LOCATIONS } from './constants';
import { getGeminiResponse, parseProfileFromJson } from './services/gemini';
import ChatRoom from './components/ChatRoom';
import SaigonMap from './components/SaigonMap';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'map'>('chat');
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<SaigonLocation | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Initial greeting
  useEffect(() => {
    const greeting = "Ê mày! Tao là Buddy đây, người bạn Sài Gòn của mày nè. Mày tên gì? Muốn tao gọi mày thế nào? Chọn mode chat nào nhen: Teen chill (mặc định), Thân thiện nhẹ, hay Lịch sự ấm áp?";
    setMessages([{ role: 'model', content: greeting, timestamp: Date.now() }]);
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    const userMsg: Message = { role: 'user', content: text, timestamp: Date.now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const response = await getGeminiResponse(newMessages, profile);
      const buddyMsg: Message = { role: 'model', content: response, timestamp: Date.now() };
      setMessages(prev => [...prev, buddyMsg]);

      // Check for profile updates in the response
      const updatedProfileParts = parseProfileFromJson(response);
      if (updatedProfileParts) {
        setProfile(prev => ({ ...prev, ...updatedProfileParts }));
      }
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'model', content: "Hic, mạng méo gì chán vl, đợi tao chút nha...", timestamp: Date.now() }]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, profile]);

  const handleLocationClick = (loc: SaigonLocation) => {
    setSelectedLocation(loc);
  };

  const handleSuggestLocation = () => {
    handleSendMessage("Gợi ý cho tao vài chỗ chill ở Sài Gòn phù hợp với tâm trạng hiện tại của tao đi Buddy!");
    setActiveTab('chat');
  };

  return (
    <div className="h-screen w-full flex flex-col bg-slate-50 overflow-hidden text-slate-900">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">SB</div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-orange-500 bg-clip-text text-transparent">
            Sài Gòn Buddy
          </h1>
        </div>
        
        <nav className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'chat' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            💬 Bạn Đồng Hành
          </button>
          <button 
            onClick={() => setActiveTab('map')}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'map' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            📍 Bản Đồ Sài Gòn
          </button>
        </nav>

        <button 
          onClick={() => setShowProfileModal(true)}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full transition-colors"
        >
          <span className="text-lg">👤</span>
          <span className="hidden sm:inline font-medium text-sm">Xem Profile</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* Tab 1: Chat */}
        <div className={`absolute inset-0 transition-all duration-300 p-4 md:p-6 flex flex-col items-center ${
          activeTab === 'chat' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full pointer-events-none'
        }`}>
          <div className="w-full max-w-2xl h-full flex flex-col">
             <ChatRoom 
               messages={messages} 
               onSendMessage={handleSendMessage} 
               isTyping={isTyping} 
               profile={profile}
             />
          </div>
        </div>

        {/* Tab 2: Map */}
        <div className={`absolute inset-0 transition-all duration-300 p-4 md:p-6 flex gap-6 ${
          activeTab === 'map' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
        }`}>
          <div className="flex-1 relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white">
            <SaigonMap onLocationSelect={handleLocationClick} selectedId={selectedLocation?.id} />
            <button 
              onClick={handleSuggestLocation}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-white hover:bg-emerald-50 text-emerald-600 px-6 py-3 rounded-full shadow-2xl font-bold border-2 border-emerald-500 flex items-center gap-2 transition-transform active:scale-95"
            >
              <span>✨</span> Buddy ơi, tao nên đi đâu?
            </button>
          </div>

          {/* Location Detail Panel (Side) */}
          {selectedLocation && (
            <div className="hidden lg:block w-96 bg-white rounded-2xl shadow-xl overflow-y-auto border border-slate-200 animate-in fade-in slide-in-from-right-4 duration-500">
               <img 
                 src={`https://picsum.photos/seed/${selectedLocation.id}/400/250`} 
                 alt={selectedLocation.name} 
                 className="w-full h-48 object-cover"
               />
               <div className="p-6">
                 <div className="flex justify-between items-start mb-2">
                   <h2 className="text-2xl font-bold text-slate-800">{selectedLocation.name}</h2>
                   <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full font-bold">
                     {selectedLocation.year}
                   </span>
                 </div>
                 <p className="text-emerald-600 font-semibold mb-4 text-sm">{selectedLocation.shortDesc}</p>
                 <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                   <p>{selectedLocation.fullDesc}</p>
                   <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                     <p className="font-bold text-slate-800 mb-1 flex items-center gap-2">
                       💡 Tip từ Buddy:
                     </p>
                     <p>{selectedLocation.tips}</p>
                   </div>
                 </div>
                 <button 
                   onClick={() => {
                     handleSendMessage(`Kể tao nghe thêm về ${selectedLocation.name} đi Buddy!`);
                     setActiveTab('chat');
                   }}
                   className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-emerald-100"
                 >
                   Chat về chỗ này
                 </button>
               </div>
            </div>
          )}
        </div>
      </main>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-8 text-white relative">
              <button 
                onClick={() => setShowProfileModal(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full"
              >✕</button>
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl mb-4 border-2 border-white/50">
                  {profile.mood.includes('Hạnh phúc') ? '🥰' : profile.mood.includes('Buồn') ? '😔' : profile.mood.includes('Vui') ? '🙂' : '😐'}
                </div>
                <h3 className="text-2xl font-bold">{profile.name || 'Người lạ ơi'}</h3>
                <p className="opacity-80 text-sm">{profile.mood}</p>
              </div>
            </div>

            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tên Buddy</label>
                  <p className="font-semibold text-slate-800">{profile.buddyName}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Chế độ xưng hô</label>
                  <p className="font-semibold text-emerald-600 uppercase">{profile.mode}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <span className="text-emerald-500">💪</span> Điểm mạnh
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.strengths.length > 0 ? profile.strengths.map((s, i) => (
                      <span key={i} className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium border border-emerald-100">{s}</span>
                    )) : <span className="text-slate-400 text-xs italic">Đang phân tích...</span>}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <span className="text-orange-500">☕</span> Sở thích
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.length > 0 ? profile.interests.map((s, i) => (
                      <span key={i} className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-medium border border-orange-100">{s}</span>
                    )) : <span className="text-slate-400 text-xs italic">Đang phân tích...</span>}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <span className="text-red-500">⚡</span> Điều ghét
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.dislikes.length > 0 ? profile.dislikes.map((s, i) => (
                      <span key={i} className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-medium border border-red-100">{s}</span>
                    )) : <span className="text-slate-400 text-xs italic">Đang phân tích...</span>}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100 text-center">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Cập nhật lần cuối: {profile.lastUpdate}</p>
                <p className="text-[10px] text-slate-300 mt-1 italic">Dữ liệu được Buddy tự động phân tích từ cuộc trò chuyện</p>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 flex gap-2">
              <button 
                onClick={() => {
                  setProfile(prev => ({ ...prev, mode: prev.mode === 'Teen' ? 'Friendly' : prev.mode === 'Friendly' ? 'Polite' : 'Teen' }));
                }}
                className="flex-1 bg-white border border-slate-200 text-slate-600 text-xs font-bold py-3 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Đổi chế độ xưng hô
              </button>
              <button 
                onClick={() => setShowProfileModal(false)}
                className="flex-1 bg-emerald-500 text-white text-xs font-bold py-3 rounded-xl hover:bg-emerald-600 shadow-lg shadow-emerald-200 transition-colors"
              >
                Tiếp tục chill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Location Card for Mobile */}
      {selectedLocation && activeTab === 'map' && (
        <div className="lg:hidden fixed bottom-24 left-4 right-4 z-[1001] bg-white rounded-2xl shadow-2xl p-4 flex gap-4 animate-in slide-in-from-bottom-4 duration-300 border border-slate-200">
          <img 
             src={`https://picsum.photos/seed/${selectedLocation.id}/100/100`} 
             className="w-20 h-20 rounded-xl object-cover shrink-0 shadow-sm"
          />
          <div className="flex-1 min-w-0">
             <div className="flex justify-between items-start">
               <h4 className="font-bold text-slate-800 truncate">{selectedLocation.name}</h4>
               <button onClick={() => setSelectedLocation(null)} className="text-slate-300">✕</button>
             </div>
             <p className="text-xs text-slate-500 line-clamp-2 mt-1">{selectedLocation.shortDesc}</p>
             <button 
               onClick={() => {
                 handleSendMessage(`Kể tao nghe thêm về ${selectedLocation.name} đi Buddy!`);
                 setActiveTab('chat');
               }}
               className="mt-2 text-[10px] font-bold text-emerald-600 uppercase tracking-wider"
             >
               Chat về địa điểm này →
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
