import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

// Serverless function to generate professional summaries using Google Gemini AI
export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // Only allow POST requests
  if (request.method !== "POST") {
    return response.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { currentRole, experience, skills } = request.body;

    // Validate required fields
    if (!currentRole || !experience || !skills) {
      return response.status(400).json({
        message: "Missing required fields: currentRole, experience, skills",
      });
    }

    // Initialize Gemini AI
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return response
        .status(500)
        .json({ message: "Gemini API key not configured" });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an expert resume writer. Generate a professional resume summary (max 3-4 sentences) for a ${currentRole}.

Key skills: ${skills.join(", ")}

Experience highlights:
${experience.join("\n")}

The tone should be professional, impactful, and concise. Focus on achievements and value proposition. Return only the summary text without any additional formatting or labels.`;

    // Call Gemini AI
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const summary = result.text || "Could not generate summary.";

    return response.status(200).json({ summary });
  } catch (error) {
    console.error("Error:", error);
    return response.status(500).json({
      message: "Failed to generate summary",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
