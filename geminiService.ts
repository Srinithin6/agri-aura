
import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client using the process.env.API_KEY exclusively.
const getAI = () =>
  new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  });
export const getAgriAdvice = async (userPrompt: string, history: { role: 'user' | 'model', content: string }[]) => {
  const model = 'gemini-3-flash-preview';
  
  const contents = history.map(h => ({
    role: h.role,
    parts: [{ text: h.content }]
  }));
  
  contents.push({
    role: 'user',
    parts: [{ text: userPrompt }]
  });

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction: `You are 'Aura', the healthy living expert for Agri Aura. 
      Your specific duties:
      1. HEALTHY DISHES: Suggest recipes that are low-calorie and high-nutrition using the vegetables we sell.
      2. SOURCING & NATURAL: Tell users about where our products come from (local farmers, traditional methods). Explain that they are 'natural' because we avoid synthetic ripening and chemical pesticides.
      3. ORGANIC SUGGESTIONS: Always mention new organic products like 'Heirloom Grains', 'Organic Pulses', or 'Certified Organic Fruits'.
      4. TONE: Be encouraging, helpful, and transparent. Use emojis to be friendly!`,
      temperature: 0.7,
    },
  });

  return response.text || "I'm sorry, I couldn't help with that right now. How about I suggest a healthy farm-fresh recipe instead?";
};

export const analyzeCropImage = async (base64Image: string, prompt: string) => {
  const model = 'gemini-3-flash-preview';
  
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image,
    },
  };
  
  const textPart = {
    text: `Act as a food quality expert. Analyze this grocery item image and answer: ${prompt}. Check for ripeness, freshness, or signs of decay. Suggest how to store it or how to use it in cooking.`
  };

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [imagePart, textPart] }],
  });

  return response.text;
};

export const getSmartProductSearch = async (query: string) => {
  const model = 'gemini-3-flash-preview';
  
  const response = await ai.models.generateContent({
    model,
    contents: `Based on this customer query: "${query}", which grocery categories should I recommend? Options: Vegetables, Fruits, Dairy, Staples, Beverages, Organic. Return ONLY a comma-separated list.`,
  });

  return response.text?.split(',').map(s => s.trim()) || [];
};
