
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const editRoomImage = async (base64Image: string, prompt: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
        { text: `این یک تصویر از دکوراسیون داخلی است. لطفا آن را بر اساس این دستور تغییر دهید: ${prompt}. خروجی باید تصویر باشد.` }
      ]
    }
  });

  for (const part of response.candidates?.[0]?.content.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("تصویری تولید نشد.");
};

export const getDesignAdvice = async (history: { role: 'user' | 'model', text: string }[]) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'شما یک طراح دکوراسیون داخلی حرفه‌ای هستید. به زبان فارسی و با لحنی صمیمی راهنمایی کنید.',
    }
  });

  const lastMessage = history[history.length - 1].text;
  const result = await chat.sendMessage({ message: lastMessage });
  return result.text;
};

export const generateRoomVideo = async (base64Image: string, prompt: string) => {
  const ai = getAI();
  
  // Check if API key is selected (required for Veo)
  if (!(await window.aistudio.hasSelectedApiKey())) {
    await window.aistudio.openSelectKey();
  }

  const aiVeo = new GoogleGenAI({ apiKey: process.env.API_KEY });
  let operation = await aiVeo.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `Animate this room according to: ${prompt}`,
    image: {
      imageBytes: base64Image,
      mimeType: 'image/jpeg',
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await aiVeo.operations.getVideosOperation({ operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  const res = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
};

export const updateAppTheme = async (request: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `درخواست کاربر برای تغییر تم برنامه: "${request}". 
    لطفا یک رنگ اصلی (HEX) و حالت تم (light یا dark) پیشنهاد دهید. 
    پاسخ را فقط به صورت JSON با ساختار {"primaryColor": string, "themeMode": "light" | "dark"} برگردانید.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          primaryColor: { type: Type.STRING },
          themeMode: { type: Type.STRING, enum: ['light', 'dark'] }
        },
        required: ['primaryColor', 'themeMode']
      }
    }
  });

  return JSON.parse(response.text || '{}');
};
