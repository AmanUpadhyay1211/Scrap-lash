import { AI_AGENT_SYSTEM_PROMT, GEMINI_API_URL } from "@/lib/constant";
import { CompanyInfo } from "@/types/CompanyInfo";
import axios from "axios";

export async function getCompanyInfoGemini(input: string,type: string): Promise<CompanyInfo | CompanyInfo[]> {
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

  const res = await axios.post(GEMINI_API_URL, payload, {
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
  console.log(`company info: ${JSON.parse(cleanText)}`);
  return JSON.parse(cleanText);
}