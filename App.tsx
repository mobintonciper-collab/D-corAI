
import React, { useState, useEffect, useCallback } from 'react';
import { AppSettings, UserState, AppSection, UserProfile } from './types';
import EditorSection from './components/User/EditorSection';
import AdvisorSection from './components/User/AdvisorSection';
import VideoSection from './components/User/VideoSection';
import PricingSection from './components/User/PricingSection';
import ProfileSection from './components/User/ProfileSection';
import AdminPanel from './components/Admin/AdminPanel';

const DEFAULT_SETTINGS: AppSettings = {
  freeLimit: 10,
  tokenPrice: 100000,
  currency: 'تومان',
  primaryColor: '#6366f1',
  themeMode: 'light',
  language: 'fa',
  logoUrl: 'https://cdn-icons-png.flaticon.com/512/2312/2312523.png'
};

const DB_KEY = 'movin_users_db_v4';

const translations = {
  fa: {
    appName: 'مووین دیزاین',
    editor: 'طراح نانو',
    advisor: 'مشاور همراه',
    animator: 'ویدیو ساز',
    profile: 'پنل من',
    pricing: 'شارژ حساب',
    credits: 'امتیاز شما',
    adminTitle: 'تایید هویت مدیر',
    adminPassPlaceholder: 'رمز عبور را بنویسید',
    confirm: 'تایید و ورود',
    cancel: 'انصراف',
    langSelect: 'انتخاب زبان / Select Language',
    footer: 'دکوراتور هوشمند مووین - پلتفرم اختصاصی طراحی داخلی',
    confirmLang: 'تایید زبان'
  },
  en: {
    appName: 'Movin Design',
    editor: 'Nano Editor',
    advisor: 'AI Advisor',
    animator: 'Video Maker',
    profile: 'My Panel',
    pricing: 'Buy Credits',
    credits: 'Credits',
    adminTitle: 'Admin Authentication',
    adminPassPlaceholder: 'Enter password',
    confirm: 'Confirm & Enter',
    cancel: 'Cancel',
    langSelect: 'Select Language',
    footer: 'Movin Smart Decorator - Exclusive Interior Design Platform',
    confirmLang: 'Confirm Language'
  }
};

const App: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [user, setUser] = useState<UserState>({ id: '', credits: 10, isAdmin: false });
  const [currentSection, setCurrentSection] = useState<AppSection>(AppSection.EDITOR);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [password, setPassword] = useState('');
  
  // New States for Splash and Language
  const [showSplash, setShowSplash] = useState(true);
  const [showLangPicker, setShowLangPicker] = useState(false);

  const t = (key: keyof typeof translations.fa) => translations[settings.language][key];

  useEffect(() => {
    // Splash logic: 2 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
      const savedLang = localStorage.getItem('movin_lang');
      if (!savedLang) {
        setShowLangPicker(true);
      } else {
        setSettings(prev => ({ ...prev, language: savedLang as 'fa' | 'en' }));
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      const savedId = localStorage.getItem('movin_current_user_id');
      const db = JSON.parse(localStorage.getItem(DB_KEY) || '{}');
      if (savedId && db[savedId]) {
        setUser(prev => ({ ...prev, id: savedId, credits: db[savedId].credits }));
      }
      const savedSettings = localStorage.getItem('movin_settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (e) {
      console.error("Error loading user data", e);
    }
  }, []);

  const saveUserToDB = (profile: UserProfile) => {
    const db = JSON.parse(localStorage.getItem(DB_KEY) || '{}');
    db[profile.id] = { credits: profile.credits };
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    localStorage.setItem('movin_current_user_id', profile.id);
  };

  const handleSetProfileId = (newId: string) => {
    const cleanId = newId.trim().toLowerCase();
    if (!cleanId) return { success: false, message: settings.language === 'fa' ? 'آیدی نمی‌تواند خالی باشد.' : 'ID cannot be empty.' };
    const db = JSON.parse(localStorage.getItem(DB_KEY) || '{}');
    if (db[cleanId]) return { success: false, message: settings.language === 'fa' ? 'این آیدی رزرو شده است.' : 'This ID is already taken.' };
    const newUser = { ...user, id: cleanId, credits: settings.freeLimit };
    setUser(newUser);
    saveUserToDB({ id: cleanId, credits: newUser.credits });
    return { success: true, message: settings.language === 'fa' ? `خوش آمدید @${cleanId}!` : `Welcome @${cleanId}!` };
  };

  const handleAdminLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const normalize = (str: string) => str.replace(/\s+/g, ' ').replace(/ی/g, 'ی').replace(/ک/g, 'ک').trim();
    if (normalize(password) === normalize('مووین ۲۳۸۸')) {
      setUser(prev => ({ ...prev, isAdmin: true }));
      setShowAdminLogin(false);
      setPassword('');
    } else {
      alert(settings.language === 'fa' ? 'رمز عبور اشتباه است!' : 'Incorrect Password!');
    }
  };

  const useCredit = useCallback(() => {
    if (user.isAdmin) return true;
    if (user.credits > 0) {
      const newCredits = user.credits - 1;
      setUser(prev => ({ ...prev, credits: newCredits }));
      if (user.id) saveUserToDB({ id: user.id, credits: newCredits });
      return true;
    }
    setCurrentSection(AppSection.PRICING);
    return false;
  }, [user]);

  const addCreditsToUserId = (targetId: string, amount: number) => {
    const cleanId = targetId.trim().toLowerCase();
    const db = JSON.parse(localStorage.getItem(DB_KEY) || '{}');
    if (!db[cleanId]) return { success: false, message: 'Not found.' };
    db[cleanId].credits += amount;
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    if (user.id === cleanId) setUser(prev => ({ ...prev, credits: db[cleanId].credits }));
    return { success: true, message: `Added ${amount} credits to @${cleanId}.` };
  };

  const confirmLanguage = () => {
    localStorage.setItem('movin_lang', settings.language);
    setShowLangPicker(false);
  };

  useEffect(() => {
    document.body.className = settings.themeMode === 'dark' 
      ? 'bg-slate-900 text-white transition-colors duration-500' 
      : 'bg-gray-50 text-slate-900 transition-colors duration-500';
    document.dir = settings.language === 'fa' ? 'rtl' : 'ltr';
  }, [settings.themeMode, settings.language]);

  if (showSplash) {
    return (
      <div className="fixed inset-0 z-[1000] bg-white flex flex-col items-center justify-center animate-pulse">
        <img src={settings.logoUrl} alt="Logo" className="w-48 h-48 object-contain animate-bounce" />
        <h1 className="mt-8 text-3xl font-black text-slate-900">MOVIN DESIGN</h1>
      </div>
    );
  }

  if (showLangPicker) {
    return (
      <div className="fixed inset-0 z-[1000] bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md text-center">
          <h2 className="text-2xl font-black mb-8 text-slate-900">{t('langSelect')}</h2>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button 
              onClick={() => setSettings(p => ({ ...p, language: 'fa' }))}
              className={`p-6 rounded-3xl border-4 transition-all ${settings.language === 'fa' ? 'border-indigo-600 bg-indigo-50 scale-105' : 'border-slate-100 hover:border-slate-200'}`}
            >
              <div className="text-3xl mb-2">🇮🇷</div>
              <div className="font-bold">فارسی</div>
            </button>
            <button 
              onClick={() => setSettings(p => ({ ...p, language: 'en' }))}
              className={`p-6 rounded-3xl border-4 transition-all ${settings.language === 'en' ? 'border-indigo-600 bg-indigo-50 scale-105' : 'border-slate-100 hover:border-slate-200'}`}
            >
              <div className="text-3xl mb-2">🇺🇸</div>
              <div className="font-bold">English</div>
            </button>
          </div>
          <button 
            onClick={confirmLanguage}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl active:scale-95"
          >
            {t('confirmLang')}
          </button>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: AppSection.EDITOR, icon: 'wand-magic-sparkles', label: t('editor') },
    { id: AppSection.ADVISOR, icon: 'comments', label: t('advisor') },
    { id: AppSection.ANIMATOR, icon: 'video', label: t('animator') },
    { id: AppSection.PROFILE, icon: 'user-astronaut', label: t('profile') },
    { id: AppSection.PRICING, icon: 'gem', label: t('pricing') },
  ];

  return (
    <div className={`min-h-screen flex flex-col font-['Vazirmatn'] ${settings.language === 'en' ? 'font-sans' : ''}`}>
      {!user.isAdmin && (
        <button 
          onClick={() => setShowAdminLogin(true)}
          className={`fixed top-4 z-50 p-3 rounded-full bg-white/90 hover:bg-white shadow-xl border border-slate-200 transition-all active:scale-90 ${settings.language === 'fa' ? 'left-4' : 'right-4'}`}
        >
          <i className="fa-solid fa-gear text-slate-600"></i>
        </button>
      )}

      {showAdminLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <form onSubmit={handleAdminLogin} className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-sm text-center">
            <h2 className="text-2xl font-black mb-6 text-slate-900">{t('adminTitle')}</h2>
            <input 
              type="password" 
              placeholder={t('adminPassPlaceholder')}
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border-2 border-slate-100 rounded-2xl mb-6 text-center focus:border-indigo-500 outline-none font-bold"
              autoFocus 
            />
            <div className="flex gap-3">
              <button type="submit" className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg active:scale-95">{t('confirm')}</button>
              <button type="button" onClick={() => setShowAdminLogin(false)} className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-2xl font-bold active:scale-95">{t('cancel')}</button>
            </div>
          </form>
        </div>
      )}

      {user.isAdmin ? (
        <AdminPanel settings={settings} setSettings={setSettings} onAddCredits={addCreditsToUserId} onExit={() => setUser(prev => ({ ...prev, isAdmin: false }))} />
      ) : (
        <>
          <header className={`p-4 md:p-6 ${settings.themeMode === 'dark' ? 'dark-glass border-b border-white/10' : 'glass border-b border-slate-200'} shadow-sm flex justify-between items-center sticky top-0 z-40`}>
            <div className="flex items-center gap-3">
              <img src={settings.logoUrl} alt="Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
              <h1 className="text-lg md:text-xl font-black">{t('appName')}</h1>
            </div>
            <div className={`flex items-center gap-4 ${settings.language === 'fa' ? 'ml-14' : 'mr-14'} md:m-0`}>
              <div className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 text-xs md:text-sm whitespace-nowrap">
                {t('credits')}: {user.credits}
              </div>
            </div>
          </header>

          <nav className="p-4">
            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-3">
              {navItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentSection(item.id as AppSection)}
                  className={`flex flex-col md:flex-row items-center justify-center gap-2 px-3 py-4 rounded-2xl font-black transition-all shadow-sm ${
                    currentSection === item.id ? 'bg-indigo-600 text-white -translate-y-1 scale-[1.02]' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
                  } ${index === 4 ? 'col-span-2 md:col-span-1' : ''} active:scale-95`}
                >
                  <i className={`fa-solid fa-${item.icon}`}></i>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </nav>

          <main className="flex-1 max-w-6xl mx-auto w-full p-4 pb-24">
            {currentSection === AppSection.EDITOR && <EditorSection onProcess={useCredit} primaryColor={settings.primaryColor} lang={settings.language} />}
            {currentSection === AppSection.ADVISOR && <AdvisorSection onProcess={useCredit} lang={settings.language} />}
            {currentSection === AppSection.ANIMATOR && <VideoSection onProcess={useCredit} lang={settings.language} />}
            {currentSection === AppSection.PRICING && <PricingSection lang={settings.language} />}
            {currentSection === AppSection.PROFILE && <ProfileSection user={user} onSetId={handleSetProfileId} lang={settings.language} />}
          </main>
        </>
      )}

      <footer className="p-4 text-center text-slate-400 text-[10px] md:text-xs font-bold border-t border-slate-100 bg-white/50">
        {t('footer')}
      </footer>
    </div>
  );
};

export default App;
