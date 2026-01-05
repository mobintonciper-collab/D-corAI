
import React, { useState } from 'react';
import { UserState } from '../../types';

interface ProfileProps {
  user: UserState;
  onSetId: (newId: string) => { success: boolean; message: string };
}

const ProfileSection: React.FC<ProfileProps> = ({ user, onSetId }) => {
  const [newId, setNewId] = useState('');
  const [msg, setMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const handleSubmit = () => {
    if (!newId.trim()) return;
    if (newId.length < 3) {
      setMsg({ text: 'آیدی باید حداقل ۳ کاراکتر باشد.', isError: true });
      return;
    }
    const result = onSetId(newId.trim());
    setMsg({ text: result.message, isError: !result.success });
    if (result.success) {
      setNewId('');
    }
  };

  return (
    <div className="max-w-md mx-auto animate-fade-in py-8">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-slate-800">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            <i className="fa-solid fa-user"></i>
          </div>
          <h2 className="text-2xl font-bold">پنل کاربری</h2>
          <p className="text-slate-500">مشخصات و آیدی اختصاصی شما</p>
        </div>

        {user.id ? (
          <div className="space-y-6">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <label className="block text-xs text-slate-400 mb-1">آیدی شما:</label>
              <div className="text-xl font-bold text-indigo-600">@{user.id}</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <label className="block text-xs text-slate-400 mb-1">اعتبار باقیمانده:</label>
              <div className="text-xl font-bold text-emerald-600">{user.credits} عکس / ویدیو</div>
            </div>
            <div className="p-4 bg-amber-50 rounded-2xl text-amber-800 text-sm">
              <i className="fa-solid fa-circle-info ml-2"></i>
              آیدی شما غیرقابل تغییر است. برای افزایش اعتبار، آیدی خود را به پشتیبانی اعلام کنید.
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">انتخاب آیدی اختصاصی:</label>
              <input 
                type="text"
                value={newId}
                onChange={(e) => setNewId(e.target.value)}
                placeholder="مثلاً: movin_fan"
                className="w-full p-4 border rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <p className="text-xs text-slate-400">آیدی شما در سیستم ثبت می‌شود و تکراری نباید باشد.</p>
            </div>

            {msg && (
              <div className={`p-4 rounded-xl text-sm font-bold text-center ${msg.isError ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                {msg.text}
              </div>
            )}

            <button 
              onClick={handleSubmit}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
            >
              ثبت آیدی و دریافت هدیه ورودی
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;
