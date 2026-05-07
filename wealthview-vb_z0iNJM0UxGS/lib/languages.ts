// Language configuration for multilingual support
export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
] as const

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"]

// Simple language detection based on character sets
export const detectLanguage = (text: string): LanguageCode => {
  // Arabic
  if (/[\u0600-\u06FF]/.test(text)) return "ar"
  // Chinese
  if (/[\u4E00-\u9FFF]/.test(text)) return "zh"
  // Japanese
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return "ja"
  // Korean
  if (/[\uAC00-\uD7AF]/.test(text)) return "ko"
  // Cyrillic (Russian)
  if (/[\u0400-\u04FF]/.test(text)) return "ru"
  // Hindi
  if (/[\u0900-\u097F]/.test(text)) return "hi"

  // Default to English for Latin scripts
  return "en"
}

// Translation API helper (uses a free translation service)
export const translateText = async (
  text: string,
  targetLanguage: LanguageCode,
  sourceLanguage?: LanguageCode,
): Promise<string> => {
  try {
    // Using MyMemory Translation API (free, no API key required)
    const sourceLang = sourceLanguage || detectLanguage(text)

    if (sourceLang === targetLanguage) {
      return text
    }

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLanguage}`

    const response = await fetch(url)
    const data = await response.json()

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText
    }

    // Fallback to original text if translation fails
    return text
  } catch (error) {
    console.error("[v0] Translation error:", error)
    return text
  }
}
