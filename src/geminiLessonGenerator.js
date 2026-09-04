import { GoogleGenAI, Type } from "@google/genai";
import { CDN_LESSONS } from "./cdnLessons.js";

export async function generateGeminiLesson() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log("ℹ️ GEMINI_API_KEY not provided. Using pre-curated CDN curriculum lesson...");
    return null;
  }

  const selectedModel = process.env.GEMINI_MODEL || "gemini-3.6-flash";
  console.log(`🤖 Generating fresh, unique CDN concept using Google Gemini AI (${selectedModel})...`);

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are a Principal Software Architect & Systems Engineer.
Generate a brand-new, engaging, daily technical educational lesson.

Topics can cover:
- CDN & Edge Computing (Stale-While-Revalidate, Geo-DNS, Edge Workers, Cache Invalidation, Origin Shield)
- System Design & Scalability (Load Balancers, Circuit Breakers, Rate Limiting, Message Queues, Database Sharding)
- Backend & Databases (Indexing, Redis Caching, Connection Pooling, ACID vs BASE, Connection Keep-Alive)
- Web Security & Protocols (OAuth2/JWT, CORS, Content Security Policy, TLS Handshakes, Webhooks, OWASP Top 10)
- Modern Web Performance & Networking (HTTP/3 QUIC, WebSockets, gRPC, Brotli Compression, Service Workers)
- Cloud & Infrastructure (Docker, Kubernetes Basics, Serverless Architecture, Event-Driven Architecture)

Make it beginner-friendly, high impact, and practical with a fun real-world analogy and a clear code or command example.

Return a valid JSON object following this schema:
- title: Short, catchy lesson title (e.g. "Circuit Breaker Pattern in Microservices")
- badge: Category tag (e.g. "System Design", "Security", "CDN & Edge", "Database", "Networking")
- analogy: Relatable real-world analogy title with emoji (e.g. "⚡ Electrical Fuse Box")
- analogyText: 1-2 sentence real-life analogy explaining the concept
- explanation: 2-3 sentence clear, technical yet simple explanation
- codeSnippet: Realistic code snippet, HTTP header, cURL command, or architecture config
- takeaway: 1-sentence memorable key takeaway`;

    const response = await ai.models.generateContent({
      model: selectedModel,
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
