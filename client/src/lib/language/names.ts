/** Display names for detected language codes: English name + native name. */

const NAMES: Record<string, { en: string; native: string }> = {
  en: { en: "English", native: "English" },
  ja: { en: "Japanese", native: "日本語" },
  ko: { en: "Korean", native: "한국어" },
  zh: { en: "Chinese", native: "中文" },
  es: { en: "Spanish", native: "Español" },
  fr: { en: "French", native: "Français" },
  de: { en: "German", native: "Deutsch" },
  pt: { en: "Portuguese", native: "Português" },
  it: { en: "Italian", native: "Italiano" },
  nl: { en: "Dutch", native: "Nederlands" },
  ru: { en: "Russian", native: "Русский" },
  uk: { en: "Ukrainian", native: "Українська" },
  tr: { en: "Turkish", native: "Türkçe" },
  ar: { en: "Arabic", native: "العربية" },
  hi: { en: "Hindi", native: "हिन्दी" },
  th: { en: "Thai", native: "ไทย" },
  vi: { en: "Vietnamese", native: "Tiếng Việt" },
  id: { en: "Indonesian", native: "Bahasa Indonesia" },
  pl: { en: "Polish", native: "Polski" },
};

/** Unknown codes fall back to the raw code so the UI never breaks. */
export function languageName(code: string): { en: string; native: string } {
  return NAMES[code] ?? { en: code, native: code };
}
