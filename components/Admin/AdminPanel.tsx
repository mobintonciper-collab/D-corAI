
import React, { useState } from 'react';
import { AppSettings } from '../../types';
import { updateAppTheme } from '../../geminiService';

interface AdminPanelProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  onAddCredits: (id: string, amount: number) => { success: boolean; message: string };
  onExit: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ settings, setSettings, onAddCredits, onExit }) => {
  const [themePrompt, setThemePrompt] = useState('');
  const [isUpdatingTheme, setIsUpdatingTheme] = useState(false);
  const [logoInput, setLogoInput] = useState(settings.logoUrl);
  
  // Credit management state
  const [targetId, setTargetId] = useState('');
  const [amount, setAmount] = useState(10);
  const [adminMsg, setAdminMsg] = useState<{text: string, isError: boolean} | null>(null);

  const handleUpdateTheme = async () => {
    if (!themePrompt.trim()) {
      alert('لطفاً ابتدا دستور تغییر تم را بنویسید.');
      return;
    }
    setIsUpdatingTheme(true);
    try {
      const newTheme = await updateAppTheme(themePrompt);
      setSettings(prev => {
        const updated = { ...prev, ...newTheme };
        localStorage.setItem('movin_settings', JSON.stringify(updated));
        return updated;
      });
      setThemePrompt('');
      alert('تغییرات با موفقیت اعمال شد!');
    } catch (err) {
      alert('خطا در اجرای هوش مصنوعی!');
    } finally {
      setIsUpdatingTheme(false);
    }
  };

  const handleLogoUpdate = () => {
    setSettings(prev => {
      const updated = { ...prev, logoUrl: logoInput };
      localStorage.setItem('movin_settings', JSON.stringify(updated));
      return updated;
    });
    alert('لوگو با موفقیت تغییر کرد!');
  };

  const handleApplyCredits = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = targetId.trim().replace('@', '').toLowerCase();
    if (!cleanId) return;
    const result = onAddCredits(cleanId, amount);
    setAdminMsg({ text: result.message, isError: !result.success });
    if (result.success) {
      setTargetId('');
      setAmount(10);
    }
    setTimeout(() => setAdminMsg(null), 5000);
  };

  return (
    <div className="flex-1 p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Admin Header */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-2xl shadow-xl">
              <i className="fa-solid fa-user-shield"></i>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">پنل مدیریت مووین</h1>
              <p className="text-slate-400 text-sm">تغییر لوگو، تم و مدیریت امتیازات</p>
            </div>
          </div>
          <button onClick={onExit} className="px-10 py-4 bg-red-600 text-white rounded-2xl font-black active:scale-95 shadow-lg">خروج از پنل</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Logo Manager */}
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
            <h2 className="text-xl font-black mb-4 flex items-center gap-2">
              <i className="fa-solid fa-image text-blue-500"></i> تنظیم لوگوی برنامه
            </h2>
            <p className="text-sm text-slate-500 mb-4">لینک مستقیم تصویر لوگو را وارد کنید:</p>
            <input 
              type="text" 
              value={logoInput} 
              onChange={(e) => setLogoInput(e.target.value)}
              className="w-full p-4 border rounded-xl mb-4 text-xs font-mono"
              placeholder="https://example.com/logo.png"
            />
            <button onClick={handleLogoUpdate} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg">بروزرسانی لوگو</button>
            <div className="mt-4 p-4 bg-slate-50 rounded-xl flex items-center justify-center">
              <img src={logoInput} className="h-12 object-contain opacity-50" alt="Preview" />
            </div>
          </div>

          {/* AI Theme Manager */}
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
            <h2 className="text-xl font-black mb-4 flex items-center gap-2">
              <i className="fa-solid fa-wand-magic-sparkles text-purple-600"></i> تغییر هوشمند تم
            </h2>
            <textarea 
              value={themePrompt} 
              onChange={(e) => setThemePrompt(e.target.value)}
              placeholder="مثلاً: تم برنامه را تاریک کن..."
              className="w-full p-4 border rounded-xl h-24 mb-4 resize-none"
            />
            <button onClick={handleUpdateTheme} disabled={isUpdatingTheme} className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold shadow-lg disabled:opacity-50">
              {isUpdatingTheme ? <i className="fa-solid fa-spinner fa-spin"></i> : 'اعمال با هوش مصنوعی'}
            </button>
          </div>

          {/* Credit Manager */}
          <form onSubmit={handleApplyCredits} className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-slate-100 lg:col-span-2">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-emerald-600">
              <i className="fa-solid fa-coins"></i> مدیریت امتیاز کاربران
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2">آیدی کاربر:</label>
                <input type="text" value={targetId} onChange={(e) => setTargetId(e.target.value)} placeholder="user_123" className="w-full p-4 border rounded-xl bg-slate-50 font-bold" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">تعداد امتیاز:</label>
                <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full p-4 border rounded-xl bg-slate-50 font-black text-center text-xl" />
              </div>
            </div>
            {adminMsg && <div className={`mt-4 p-4 rounded-xl text-center font-bold ${adminMsg.isError ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>{adminMsg.text}</div>}
            <button type="submit" className="w-full mt-6 py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-lg active:scale-95">شارژ حساب کاربر</button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
