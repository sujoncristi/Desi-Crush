
import { GoogleGenAI, Type } from "@google/genai";
import { TileData } from "../types.ts";

// Strictly adhering to Google GenAI SDK initialization guidelines using process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getAiHint(board: (TileData | null)[][]): Promise<any> {
  // Using gemini-3-flash-preview for basic logical tasks like hint generation
  const model = "gemini-3-flash-preview";
  
  const simplifiedBoard = board.map(row => row.map(t => t?.type || "EMPTY"));
  
  const prompt = `
    I'm playing "Desi Feast", a match-3 game with Bangladeshi food.
    The board is 8x8. Tiles: BHAAT, DAAL, SHOBJIE, RUTI, BIRYANI, FISH, MISHTI.
    
    Board: ${JSON.stringify(simplifiedBoard)}
    
    Task: Find a valid adjacent swap that creates a match of 3 or more.
    Role: You are a wise and funny Bangladeshi Dadi (Grandmother).
    Style: Use Hinglish (Bengali + English). Be warm, encouraging, and witty. Mention specific foods.
    
    JSON Schema:
    {
      "r1": number, "c1": number, 
      "r2": number, "c2": number,
      "msg": "Dadi's witty advice string"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            r1: { type: Type.NUMBER },
            c1: { type: Type.NUMBER },
            r2: { type: Type.NUMBER },
            c2: { type: Type.NUMBER },
            msg: { type: Type.STRING },
          },
          required: ["r1", "c1", "r2", "c2", "msg"]
        }
      }
    });
    
    // Using .text property directly and trimming result before parsing
    const textOutput = response.text || "{}";
    return JSON.parse(textOutput.trim());
  } catch (error) {
    console.error("AI Hint Error:", error);
    return null;
  }
}
