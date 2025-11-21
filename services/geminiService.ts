import { GoogleGenAI } from "@google/genai";
import { Place } from "../types";

// Initialize the client
// Note: In a production environment, ensure process.env.API_KEY is set.
// For this demo, we handle the case where it might be missing gracefully in the UI.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'DEMO_KEY_placeholder' });

/**
 * Enhances a list of places by generating attractive descriptions using Gemini.
 * This simulates the "AI Polish" feature in the Admin Dashboard.
 */
export const enhancePlaceDescriptions = async (places: Place[], governorateName: string): Promise<Place[]> => {
  if (!process.env.API_KEY) {
    console.warn("Gemini API Key is missing. Returning original places.");
    return places;
  }

  const prompt = `
    You are a travel expert for the Asir region in Saudi Arabia.
    I have a list of places in the city of ${governorateName}.
    Please write a short, inviting, 1-sentence description (in English) for each place based on its name and type.
    
    Return the output as a JSON array of strings, corresponding exactly to the order of the input list.
    
    Input List:
    ${places.map(p => `${p.name} (${p.type})`).join('\n')}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const jsonResponse = JSON.parse(response.text || '[]');
    
    if (Array.isArray(jsonResponse) && jsonResponse.length === places.length) {
      return places.map((place, index) => ({
        ...place,
        description: jsonResponse[index]
      }));
    }
    
    return places;
  } catch (error) {
    console.error("Error enhancing content with Gemini:", error);
    return places;
  }
};

/**
 * Generates a summary for a governorate.
 */
export const generateGovernorateSummary = async (name: string): Promise<string> => {
    if (!process.env.API_KEY) return "Detailed tourism information coming soon.";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Write a brief, captivating 2-sentence introduction for tourists visiting ${name}, Asir, Saudi Arabia.`,
        });
        return response.text || "";
    } catch (e) {
        return "Explore the beauty of Asir.";
    }
}