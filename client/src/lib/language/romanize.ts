/**
 * Romanization — kana -> romaji via wanakana (client-side, no key).
 *
 * Honest limitation: kanji has no reading without a dictionary, so it is
 * left as-is (option A): "おはよう、元気？" -> "ohayou,元気?".
 * Full kanji readings need a cloud API — see translate.ts.
 */

import { toRomaji } from "wanakana";

/** Romaji line, or null when there is nothing to romanize (already Latin). */
export function romanizeIfNeeded(text: string, code: string): string | null {
  if (code !== "ja") return null; // wanakana only handles Japanese
  try {
    const romaji = toRomaji(text);
    return romaji !== text ? romaji : null;
  } catch {
    return null;
  }
}
