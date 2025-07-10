import { config } from "@/lib/config";
import {
  AI_AGENT_SYSTEM_PROMT,
  CHAT_BOT_SYSTEM_PROMT,
  GEMINI_API_URL,
} from "@/lib/constant";
import { CompanyInfo } from "@/types/CompanyInfo";
import axios from "axios";

export async function getCompanyInfoGemini(
  input: string,
  type: string,
  isChatBot: boolean = false
): Promise<CompanyInfo | CompanyInfo[]> {
  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `${
              isChatBot ? CHAT_BOT_SYSTEM_PROMT : AI_AGENT_SYSTEM_PROMT
            }\n\nUser input: ${input}`,
          },
        ],
      },
    ],
  };

  const res = await axios.post(GEMINI_API_URL, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const candidates = res.data?.candidates;
  if (!candidates || candidates.length === 0) {
    throw new Error("No response from Gemini.");
  }

  const text = candidates[0].content.parts[0].text.trim();

  // Remove markdown formatting if present
  const cleanText = text.replace(/^```json\n?|\n?```$/g, "").trim();
  // console.log(`company info: ${isChatBot ? cleanText : JSON.parse(cleanText)}`);
  return isChatBot ? cleanText : JSON.parse(cleanText);
}

export async function getInfoByChatBot(messages: any[]): Promise<string> {
  // Filter out bot messages and only keep user messages for context
  const userMessages = messages.filter(msg => msg.role === "user");
  
  // Limit to last 10 messages to prevent token overflow
  const recentMessages = userMessages.slice(-10);
  
  // Create the payload with system prompt as first user message
  const geminiMessages = [
    {
      role: "user",
      parts: [
        {
          text: CHAT_BOT_SYSTEM_PROMT
        }
      ]
    },
    ...recentMessages.map((msg) => ({
      role: "user",
      parts: [
        {
          text: msg.content
        }
      ]
    }))
  ];

  const payload = {
    contents: geminiMessages
  };

    const res = await axios.post(GEMINI_API_URL, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = res.data;

  // // Log the request payload for debugging
  // console.log("Gemini API Request:", JSON.stringify(payload, null, 2));
  // console.log("Gemini API Response:", JSON.stringify(data, null, 2));

  if (data.error) {
    console.error("Gemini API Error:", data.error);
    throw new Error(data.error.message || "Gemini API error");
  }

  const candidates = data?.candidates;
  if (!candidates || candidates.length === 0) {
    throw new Error("No response from Gemini.");
  }

  const output = candidates[0].content.parts[0].text.trim();
  return output || "Sorry, I couldn't generate a response.";
}
