
import React, { useState, useRef, useEffect } from 'react';
import { getDesignAdvice } from '../../geminiService';

const AdvisorSection: React.FC<{ onProcess: () => boolean }> = ({ onProcess }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'سلام! من مشاور دکوراسیون شما هستم. چه کمکی از دستم برمی‌آید؟' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = { role: 'user' as const, text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getDesignAdvice([...messages, userMessage]);
      setMessages(prev => [...prev, { role: 'model', text: response || 'متاسفانه مشکلی پیش آمد.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: 'خطا در برقراری ارتباط با مشاور.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[70vh] bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="p-4 bg-indigo-600 text-white flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <i className="fa-solid fa-headset"></i>
        </div>
        <div>
          <h3 className="font-bold">مشاور هوشمند مووین</h3>
          <p className="text-xs text-indigo-100">پاسخگوی سوالات دکوراسیون شما</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tl-none' 
                : 'bg-slate-100 text-slate-800 rounded-tr-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 p-4 rounded-2xl rounded-tr-none">
              <i className="fa-solid fa-ellipsis fa-fade"></i>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 bg-slate-50 border-t flex gap-2">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="سوال خود را بپرسید..."
          className="flex-1 p-4 border rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        <button 
          onClick={handleSend}
          className="p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-colors"
        >
          <i className="fa-solid fa-paper-plane-rtl"></i>
        </button>
      </div>
    </div>
  );
};

export default AdvisorSection;
