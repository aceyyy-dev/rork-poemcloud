import { generateText } from "@rork-ai/toolkit-sdk";

export const SUPPORTED_LANGUAGES = [
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "it", label: "Italian" },
  { code: "pt", label: "Portuguese" },
  { code: "nl", label: "Dutch" },
  { code: "pl", label: "Polish" },
  { code: "ru", label: "Russian" },
  { code: "ar", label: "Arabic" },
  { code: "ja", label: "Japanese" },
  { code: "zh", label: "Chinese" },
];

export async function translateWithAI(
  text: string,
  targetLanguage: string
): Promise<string> {
  console.log("[Translation] Starting AI translation to:", targetLanguage);
  
  try {
    const result = await generateText({
      messages: [
        {
          role: "user",
          content: `You are a translation engine for poetry.
Translate the following poem into ${targetLanguage}.
Rules:
- Output ONLY the translated poem text.
- Do NOT add titles, notes, explanations, or brackets.
- Keep line breaks and stanza spacing as close to original as possible.
- Preserve meaning first; keep tone and simplicity.
- Do not censor or rewrite content.
- Do not add extra punctuation.

Poem:
${text}`,
        },
      ],
    });

    console.log("[Translation] AI response received");

    let translatedText = result.trim();

    const prefixes = [
      "Here is the translation:",
      "Here's the translation:",
      "Translation:",
      "Translated poem:",
    ];
    for (const prefix of prefixes) {
      if (translatedText.toLowerCase().startsWith(prefix.toLowerCase())) {
        translatedText = translatedText.slice(prefix.length).trim();
      }
    }

    if (!translatedText) {
      console.log("[Translation] Empty result from AI");
      throw new Error("Translation returned empty result");
    }

    console.log("[Translation] Success, length:", translatedText.length);
    return translatedText;
  } catch (error) {
    console.error("[Translation] AI translation failed:", error);
    throw error;
  }
}
