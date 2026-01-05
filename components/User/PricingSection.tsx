
import React from 'react';

const PricingSection: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto py-12 animate-fade-in">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 text-center text-slate-800">
        <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 text-4xl transform rotate-3">
          <i className="fa-solid fa-gem"></i>
        </div>
        
        <h2 className="text-4xl font-black mb-6 text-slate-900">خرید اشتراک و اعتبار</h2>
        
        <p className="text-xl text-slate-600 mb-10 leading-relaxed">
          برای افزایش اعتبار و خرید اشتراک‌های ویژه، لطفاً به آیدی پشتیبانی در تلگرام پیام دهید.
          <br />
          همکاران ما در کوتاه‌ترین زمان ممکن حساب شما را شارژ خواهند کرد.
        </p>

        <div className="bg-indigo-600 p-8 rounded-3xl shadow-lg shadow-indigo-200">
          <div className="text-indigo-100 text-sm mb-2">آیدی تلگرام پشتیبانی:</div>
          <div className="text-3xl font-black text-white tracking-widest cursor-pointer hover:scale-110 transition-transform">
            @VOLVIN18
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
            <i className="fa-solid fa-bolt text-amber-500 text-xl"></i>
            <span className="text-sm font-bold">فعالسازی آنی پس از پرداخت</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
            <i className="fa-solid fa-shield-halved text-emerald-500 text-xl"></i>
            <span className="text-sm font-bold">تضمین بازگشت وجه</span>
          </div>
        </div>

        <p className="mt-8 text-slate-400 text-sm">
          فراموش نکنید که هنگام پیام دادن، <strong>آیدی کاربری</strong> خود را نیز ارسال کنید.
        </p>
      </div>
    </div>
  );
};

export default PricingSection;
