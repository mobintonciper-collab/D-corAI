
import React, { useState, useRef } from 'react';
import { generateRoomVideo } from '../../geminiService';

const VideoSection: React.FC<{ onProcess: () => boolean }> = ({ onProcess }) => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!image || !onProcess()) return;
    setIsGenerating(true);
    try {
      const base64 = image.split(',')[1];
      const url = await generateRoomVideo(base64, prompt || "Animate the lights and camera movement");
      setVideoUrl(url);
    } catch (err) {
      alert('خطا در تولید ویدیو: ' + err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">تبدیل طرح به ویدیو</h2>
        <p className="text-slate-500">طرح دکوراسیون خود را با انیمیشن‌های سینمایی زنده کنید</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-[16/9] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all overflow-hidden"
          >
            {image ? <img src={image} className="w-full h-full object-cover" /> : <span className="text-slate-400">آپلود عکس مرجع</span>}
            <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} />
          </div>
          <div className="mt-6 space-y-4">
            <input 
              type="text"
              placeholder="توضیحات حرکت ویدیو (اختیاری)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-4 border rounded-xl"
            />
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !image}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              {isGenerating ? 'در حال ساخت ویدیو (ممکن است چند دقیقه طول بکشد)...' : 'ساخت ویدیو با Veo'}
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 flex flex-col min-h-[300px]">
          <h3 className="font-bold mb-4">ویدیو نهایی</h3>
          <div className="flex-1 bg-black rounded-2xl flex items-center justify-center overflow-hidden">
            {videoUrl ? (
              <video src={videoUrl} controls className="w-full h-full" autoPlay loop />
            ) : (
              <div className="text-slate-500 text-center">
                <i className="fa-solid fa-film text-5xl mb-3 opacity-20"></i>
                <p>ویدیو اینجا نمایش داده می‌شود</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoSection;
