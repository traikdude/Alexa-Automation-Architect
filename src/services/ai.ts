import { GoogleGenAI, Type } from '@google/genai';

// Initialize the Gemini API client
// Note: In Vite, process.env is replaced via the define config in vite.config.ts
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export async function optimizeVoiceTrigger(phrase: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: `You are an Elite Amazon Alexa Automation Architect. Analyze the following problematic voice trigger phrase and provide variations to improve Alexa's recognition.
    
    Problem Phrase: "${phrase}"
    
    Provide 5-8 variations across these categories: Phonetic Tweaks, Simplified Forms, Unambiguous Replacements, Intentional Mispronunciations.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            variation: { type: Type.STRING, description: "The suggested trigger phrase" },
            type: { type: Type.STRING, description: "The category of the variation (e.g., Phonetic Split, Simplified)" },
            reason: { type: Type.STRING, description: "Why this might work better" }
          },
          required: ["variation", "type", "reason"]
        }
      }
    }
  });
  
  return JSON.parse(response.text || '[]');
}

export async function generateRoutineBlueprint(description: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: `You are an Elite Amazon Alexa Automation Architect. Create a detailed Alexa Routine blueprint based on this user request: "${description}"
    
    Ensure you follow best practices:
    - Music, Podcasts, Audiobooks, Skills, and Calls are terminal actions — they must be the LAST action in a Routine.
    - Volume changes should be placed BEFORE any media playback.
    - Use Wait actions between device commands that depend on each other.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          routineName: { type: Type.STRING },
          trigger: { type: Type.STRING },
          device: { type: Type.STRING },
          actions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                actionType: { type: Type.STRING, description: "e.g., Alexa Says, Smart Home, Wait, Media" },
                description: { type: Type.STRING, description: "Details of the action" }
              },
              required: ["actionType", "description"]
            }
          },
          explanation: { type: Type.STRING, description: "Why this works and any common pitfalls" }
        },
        required: ["routineName", "trigger", "device", "actions", "explanation"]
      }
    }
  });
  
  return JSON.parse(response.text || '{}');
}
