import { generateText } from "@rork-ai/toolkit-sdk";

export const SUPPORTED_LANGUAGES = [
  // Major World Languages
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "it", label: "Italian" },
  { code: "pt", label: "Portuguese" },
  { code: "pt-br", label: "Portuguese (Brazilian)" },
  { code: "nl", label: "Dutch" },
  { code: "pl", label: "Polish" },
  { code: "ru", label: "Russian" },
  { code: "uk", label: "Ukrainian" },
  { code: "cs", label: "Czech" },
  { code: "sk", label: "Slovak" },
  { code: "hu", label: "Hungarian" },
  { code: "ro", label: "Romanian" },
  { code: "bg", label: "Bulgarian" },
  { code: "hr", label: "Croatian" },
  { code: "sr", label: "Serbian" },
  { code: "sl", label: "Slovenian" },
  { code: "el", label: "Greek" },
  { code: "tr", label: "Turkish" },
  // Asian Languages
  { code: "zh", label: "Chinese (Simplified)" },
  { code: "zh-tw", label: "Chinese (Traditional)" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
  { code: "vi", label: "Vietnamese" },
  { code: "th", label: "Thai" },
  { code: "id", label: "Indonesian" },
  { code: "ms", label: "Malay" },
  { code: "tl", label: "Filipino (Tagalog)" },
  { code: "my", label: "Burmese" },
  { code: "km", label: "Khmer" },
  { code: "lo", label: "Lao" },
  // South Asian Languages
  { code: "hi", label: "Hindi" },
  { code: "bn", label: "Bengali" },
  { code: "ur", label: "Urdu" },
  { code: "pa", label: "Punjabi" },
  { code: "gu", label: "Gujarati" },
  { code: "mr", label: "Marathi" },
  { code: "ta", label: "Tamil" },
  { code: "te", label: "Telugu" },
  { code: "kn", label: "Kannada" },
  { code: "ml", label: "Malayalam" },
  { code: "si", label: "Sinhala" },
  { code: "ne", label: "Nepali" },
  // Middle Eastern Languages
  { code: "ar", label: "Arabic" },
  { code: "fa", label: "Persian (Farsi)" },
  { code: "he", label: "Hebrew" },
  { code: "ku", label: "Kurdish" },
  { code: "ps", label: "Pashto" },
  // African Languages
  { code: "sw", label: "Swahili" },
  { code: "am", label: "Amharic" },
  { code: "ha", label: "Hausa" },
  { code: "yo", label: "Yoruba" },
  { code: "ig", label: "Igbo" },
  { code: "zu", label: "Zulu" },
  { code: "xh", label: "Xhosa" },
  { code: "af", label: "Afrikaans" },
  { code: "so", label: "Somali" },
  // Nordic Languages
  { code: "sv", label: "Swedish" },
  { code: "no", label: "Norwegian" },
  { code: "da", label: "Danish" },
  { code: "fi", label: "Finnish" },
  { code: "is", label: "Icelandic" },
  // Baltic Languages
  { code: "lt", label: "Lithuanian" },
  { code: "lv", label: "Latvian" },
  { code: "et", label: "Estonian" },
  // Other European Languages
  { code: "ca", label: "Catalan" },
  { code: "gl", label: "Galician" },
  { code: "eu", label: "Basque" },
  { code: "cy", label: "Welsh" },
  { code: "ga", label: "Irish" },
  { code: "gd", label: "Scottish Gaelic" },
  { code: "mt", label: "Maltese" },
  { code: "sq", label: "Albanian" },
  { code: "mk", label: "Macedonian" },
  { code: "bs", label: "Bosnian" },
  { code: "be", label: "Belarusian" },
  // Central Asian Languages
  { code: "kk", label: "Kazakh" },
  { code: "uz", label: "Uzbek" },
  { code: "ky", label: "Kyrgyz" },
  { code: "tg", label: "Tajik" },
  { code: "mn", label: "Mongolian" },
  { code: "az", label: "Azerbaijani" },
  { code: "ka", label: "Georgian" },
  { code: "hy", label: "Armenian" },
  // Other Languages
  { code: "eo", label: "Esperanto" },
  { code: "la", label: "Latin" },
  { code: "haw", label: "Hawaiian" },
  { code: "mi", label: "Maori" },
  { code: "sm", label: "Samoan" },
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
