import { config } from "@/lib/config";
import { AI_AGENT_SYSTEM_PROMT } from "@/lib/constant";
import { CompanyInfo } from "@/types/CompanyInfo";
import axios from "axios";

export async function getCompanyInfoGemini(input: string): Promise<CompanyInfo | CompanyInfo[]> {
  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          { text: `${AI_AGENT_SYSTEM_PROMT}\n\nUser input: ${input}` }
        ]
      }
    ]
  };

  const res = await axios.post(config.GEMINI_API_KEY, payload, {
    headers: {
      "Content-Type": "application/json"
    }
  });

  const candidates = res.data?.candidates;
  if (!candidates || candidates.length === 0) {
    throw new Error("No response from Gemini.");
  }

  const text = candidates[0].content.parts[0].text.trim();

  // Remove markdown formatting if present
  const cleanText = text.replace(/^```json\n?|\n?```$/g, "").trim();

  return JSON.parse(cleanText);
}