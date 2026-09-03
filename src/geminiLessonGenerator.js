import { GoogleGenAI, Type } from "@google/genai";
import { CDN_LESSONS } from "./cdnLessons.js";

export async function generateGeminiLesson() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log("ℹ️ GEMINI_API_KEY not provided. Using pre-curated CDN curriculum lesson...");
    return null;
  }

  console.log("🤖 Generating fresh, unique CDN concept using Google Gemini AI...");

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an expert Web Infrastructure & CDN Engineer.
Generate a brand-new, engaging, daily educational lesson explaining a Content Delivery Network (CDN), Edge Computing, Web Infrastructure, Caching, or Web Security concept.

Make it beginner-friendly, high impact, and educational with a fun real-world analogy and a practical code example.

Select from topics such as: Edge Workers, Stale-While-Revalidate, HTTP/3 QUIC, Brotli Compression, Geo-DNS, DDoS Protection, Origin Shield, TLS Offloading, ETag Caching, Image Optimization, Byte Range Requests, Private vs Public Cache, Serverless at the Edge, Web Application Firewall (WAF), or Cache Revalidation.

Return a valid JSON object following this schema:
- title: Short, catchy lesson title (e.g. "Stale-While-Revalidate Caching")
- badge: Category tag (e.g. "Cache Strategy", "Edge Computing", "Security", "Networking")
- analogy: Relatable real-world analogy title with emoji (e.g. "🗞️ Newspaper Subscription Delivery")
- analogyText: 1-2 sentence real-life analogy explaining the concept
- explanation: 2-3 sentence clear, technical yet simple explanation
- codeSnippet: Realistic code snippet (HTTP header, Node.js code, cURL command, or HTML script tag)
- takeaway: 1-sentence memorable key takeaway`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
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
  } catch (err) {
    console.warn("⚠️ Gemini AI generation error:", err.message);
    console.log("🔄 Falling back to pre-curated CDN curriculum lesson...");
  }

  return null;
}
