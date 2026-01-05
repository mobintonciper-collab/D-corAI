
import React, { useState, useRef } from 'react';
import { editRoomImage } from '../../geminiService';

interface EditorProps {
  onProcess: () => boolean;
  primaryColor: string;
}

const EditorSection: React.FC<EditorProps> = ({ onProcess, primaryColor }) => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('حجم فایل نباید بیشتر از ۵ مگابایت باشد.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!image) {
      setError('لطفاً ابتدا یک عکس آپلود کنید.');
      return;
    }
    if (!prompt.trim()) {
      setError('لطفاً تغییرات مورد نظر خود را بنویسید.');
      return;
    }

    const hasCredit = onProcess();
    if (!hasCredit) return;

    setIsLoading(true);
    setError(null);
    try {
      const base64 = image.split(',')[1];
      const editedImageUrl = await editRoomImage(base64, prompt);
      setResult(editedImageUrl);
    } catch (err: any) {
      setError('خطا در هوش مصنوعی: ' + (err.message || 'مشکلی پیش آمد.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900">ویرایشگر هوشمند نانو</h2>
        <p className="text-sm md:text-base text-slate-500">عکس اتاق را آپلود کنید و هر تغییری که می‌خواهید را بنویسید</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
        {/* Input Panel */}
        <div className="bg-white p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col space-y-5 md:space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`aspect-video rounded-[1.5rem] md:rounded-[2rem] border-4 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden group relative ${
              image ? 'border-indigo-500' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
            }`}
          >
            {image ? (
              <>
                <img src={image} className="w-full h-full object-cover" alt="Original" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white/90 text-slate-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg">تغییر عکس</span>
                </div>
              </>
            ) : (
              <>
                <i className="fa-solid fa-cloud-arrow-up text-3xl md:text-4xl text-slate-300 mb-3 group-hover:scale-110 transition-transform"></i>
                <span className="text-slate-500 font-bold text-sm md:text-base">برای انتخاب عکس کلیک کنید</span>
              </>
            )}
            <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="space-y-2">
            <label className="text-xs md:text-sm font-bold text-slate-700 mr-1 flex items-center gap-1">
              <i className="fa-solid fa-pen-nib text-indigo-500"></i>
              تغییرات مورد نظر:
            </label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="مثلاً: این اتاق را به سبک مدرن تغییر بده و نورپردازی را گرم کن..."
              className="w-full p-4 border-2 border-slate-50 rounded-2xl h-28 md:h-32 focus:border-indigo-500 outline-none transition-all resize-none bg-slate-50 focus:bg-white text-sm md:text-base"
            />
          </div>

          {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs md:text-sm font-bold text-center animate-pulse">{error}</div>}

          <button 
            onClick={handleEdit}
            disabled={isLoading || !image}
            className="w-full py-4 md:py-5 text-white rounded-2xl font-black text-base md:text-lg shadow-lg transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
            style={{ backgroundColor: primaryColor }}
          >
            {isLoading ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin"></i>
                <span>درحال پردازش...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-magic-wand-sparkles"></i>
                <span>ارسال و طراحی جدید</span>
              </>
            )}
          </button>
        </div>

        {/* Output Panel */}
        <div className="bg-slate-900 p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl flex flex-col min-h-[400px] md:min-h-[450px]">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm md:text-base">
            <i className="fa-solid fa-sparkles text-yellow-400"></i>
            طرح پیشنهادی مووین
          </h3>
          <div className="flex-1 bg-slate-800 rounded-2xl flex items-center justify-center overflow-hidden border border-white/5 relative">
            {result ? (
              <img src={result} className="w-full h-full object-contain animate-in fade-in zoom-in duration-500" alt="Result" />
            ) : isLoading ? (
              <div className="text-center p-6">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4 shadow-[0_0_15px_rgba(99,102,241,0.4)]"></div>
                <p className="text-slate-400 text-sm">هوش مصنوعی نانو در حال بازسازی اتاق شماست...</p>
              </div>
            ) : (
              <div className="text-slate-600 text-center px-10">
                <i className="fa-solid fa-image text-5xl md:text-6xl mb-4 opacity-10"></i>
                <p className="text-sm md:text-base">نتیجه طراحی در این قسمت نمایش داده می‌شود</p>
              </div>
            )}
          </div>
          {result && (
            <div className="grid grid-cols-2 gap-3 mt-4 md:mt-6">
              <button 
                onClick={() => setResult(null)}
                className="py-3 md:py-4 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all active:scale-95 text-xs md:text-sm"
              >
                پاک کردن
              </button>
              <a 
                href={result} 
                download="movin-room.png"
                className="py-3 md:py-4 bg-indigo-600 text-white rounded-xl text-center font-bold hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2 text-xs md:text-sm shadow-lg shadow-indigo-900/50"
              >
                <i className="fa-solid fa-download"></i>
                ذخیره تصویر
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorSection;
