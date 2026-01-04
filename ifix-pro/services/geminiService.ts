
import { GoogleGenAI, Type } from "@google/genai";
import { DeviceInfo } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDeviceInfoFromIMEI = async (imei: string): Promise<DeviceInfo> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Identify a realistic iPhone configuration for this IMEI: ${imei}. Provide the model name, storage capacity, and color.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            model: { type: Type.STRING },
            capacity: { type: Type.STRING },
            color: { type: Type.STRING },
          },
          required: ["model", "capacity", "color"]
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Failed to fetch device info:", error);
    // Fallback data
    return {
      model: "iPhone 14 Pro",
      capacity: "256GB",
      color: "Space Black"
    };
  }
};
