import { GoogleGenAI, Modality } from "@google/genai";

// Ensure API Key is present
const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateHorrorImage = async (prompt: string): Promise<string | null> => {
  if (!API_KEY) return null;

  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `${prompt}, horror theme, scary atmosphere, cinematic lighting, 8k resolution, dark colors`,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9',
      },
    });

    const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    if (base64ImageBytes) {
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    return null;
  } catch (error) {
    console.error("Image generation failed:", error);
    return null;
  }
};

export const generateGhostVoice = async (text: string): Promise<AudioBuffer | null> => {
  if (!API_KEY) return null;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Fenrir' }, // Fenrir is deep/rough, good for a ghost? Or Kore for whispery. Let's try Fenrir.
              },
          },
        },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) return null;

    // We need an AudioContext to decode. We'll assume the caller handles the context creation 
    // to comply with browser autoplay policies, but we can return the buffer here if we pass a context,
    // or just return the base64 and let the component handle decoding.
    // For simplicity in this service, let's return the AudioBuffer using a temporary context or just raw data.
    // Actually, best pattern is to return the base64 or ArrayBuffer and let component decode.
    // To follow the "Audio Decoding" guide strictly, I'll implement the decoding helper here.
    
    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(bytes.buffer);
    return audioBuffer;

  } catch (error) {
    console.error("TTS generation failed:", error);
    return null;
  }
};
