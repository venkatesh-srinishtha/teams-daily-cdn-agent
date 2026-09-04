import { GoogleGenAI, Type } from "@google/genai";
import { CDN_LESSONS } from "./cdnLessons.js";

export async function generateGeminiLesson() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log("ℹ️ GEMINI_API_KEY not provided. Using pre-curated CDN curriculum lesson...");
    return null;
  }

  const candidateModels = Array.from(new Set([
    process.env.GEMINI_MODEL,
    "gemini-3.6-flash",
    "gemini-2.5-flash",
    "gemini-1.5-flash"
  ].filter(Boolean)));

  const ai = new GoogleGenAI({ apiKey });

  for (const modelName of candidateModels) {
    try {
      console.log(`🤖 Attempting Gemini AI generation with model '${modelName}'...`);
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              badge: { type: Type.STRING },
              analogy: { type: Type.STRING },
              analogyText: { type: Type.STRING },
              explanation: { type: Type.STRING },
              codeSnippet: { type: Type.STRING },
              takeaway: { type: Type.STRING }
            },
            required: ["title", "analogy", "analogyText", "explanation", "codeSnippet", "takeaway"]
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        
        return {
          id: `AI-${dayOfYear}`,
          title: parsed.title,
          badge: parsed.badge || "AI Generated",
          analogy: parsed.analogy,
          analogyText: parsed.analogyText,
          explanation: parsed.explanation,
          codeSnippet: parsed.codeSnippet,
          takeaway: parsed.takeaway,
          isAiGenerated: true
        };
      }
    } catch (modelErr) {
      console.warn(`⚠️ Model '${modelName}' failed (${modelErr.message}). Trying fallback model...`);
    }
  }
  } catch (err) {
    console.warn("⚠️ Gemini AI generation error:", err.message);
    console.log("🔄 Falling back to pre-curated CDN curriculum lesson...");
  }

  return null;
}
