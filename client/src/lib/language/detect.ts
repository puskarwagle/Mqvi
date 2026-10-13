/**
 * Language detection for chat messages — client-side only, no API key.
 *
 * tinyld (statistical trigrams) handles everything we need, verified:
 *   "Hello how are you" -> "en"   "Bonjour…" -> "fr"   "ok" -> "" (unknown)
 *   "おはよう元気？" -> "ja" (even kanji-only "元気" -> "ja")
 *   "안녕하세요" -> "ko"   "你好吗" -> "zh"   "Привет…" -> "ru"
 *
 * Returns an ISO 639-1 code ("en", "ja", …) or null when undetectable.
 */

import { detect } from "tinyld";

/** ISO 639-1 code or null (empty/emoji-only text, detector unsure). */
export function detectLanguage(text: string): string | null {
  const trimmed = text.trim();
  // No letters = no language (emoji-only, numbers, punctuation).
  if (trimmed.length === 0 || !/\p{L}/u.test(trimmed)) return null;
  // Short all-Latin text ("hello", "ok") is statistically unguessable —
  // tinyld called "hello" Italian. Default to English instead of a wrong badge.
  // Non-Latin scripts (kana, hangul, han…) always go to the detector.
  if (trimmed.length < 12 && /^[\p{Script=Latin}\p{N}\p{P}\p{Z}]+$/u.test(trimmed)) {
    return "en";
  }
  try {
    const code = detect(trimmed);
    return code || null; // tinyld returns "" when it can't tell
  } catch {
    return null;
  }
}
