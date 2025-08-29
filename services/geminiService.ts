
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Idea generator will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateFarmIdeas = async (): Promise<string[]> => {
  if (!API_KEY) {
      return Promise.resolve([
          "Tip: Set up your Gemini API key to get AI-powered ideas!",
          "Consider using rotational grazing for healthier pastures.",
          "Install nipple waterers to keep water clean and reduce waste.",
          "Compost poultry litter to create valuable fertilizer for your farm."
      ]);
  }
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate 5 creative, fun, and actionable tips or ideas for a small to medium-sized frass farm (insect farming). Focus on topics like sustainability, animal welfare, efficiency, and unique products. The ideas should be concise, inspiring, and easy to understand for a farm owner.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            description: "A single, actionable tip or idea for a frass/insect farm."
          }
        },
      },
    });

    const jsonString = response.text.trim();
    const ideas = JSON.parse(jsonString);

    if (Array.isArray(ideas) && ideas.every(item => typeof item === 'string')) {
      return ideas;
    } else {
      throw new Error("Invalid response format from Gemini API");
    }
  } catch (error) {
    console.error("Error generating farm ideas:", error);
    return [
      "Could not fetch AI-powered ideas. Here's a default tip: Regularly check your flock for signs of illness to ensure their health."
    ];
  }
};