/**
 * Real translation — no API key needed.
 *
 * Chain (first success wins, results cached):
 *   1. Chrome/Edge on-device Translator API (`window.Translator`) — free,
 *      private, works offline after the language pack downloads.
 *   2. MyMemory (keyless, rate-limited) — demo-grade fallback.
 *
 * Direction rule for the demo pair: English -> Japanese, anything else -> English.
 * When a DeepL/Google key arrives, add it as entry #0 — callers are unaffected.
 * Returns null when nothing works; the UI treats null as "no translation line".
 */

declare global {
  interface Window {
    Translator?: {
      availability(opts: {
        sourceLanguage: string;
        targetLanguage: string;
      }): Promise<"available" | "downloadable" | "downloading" | "unavailable">;
      create(opts: {
        sourceLanguage: string;
        targetLanguage: string;
      }): Promise<{ translate(text: string): Promise<string> }>;
    };
  }
}

const cache = new Map<string, string>();

/** Demo-pair direction: en -> ja, everything else -> en. */
export function targetFor(code: string): string {
  return code === "en" ? "ja" : "en";
}

async function translateOnDevice(
  text: string,
  source: string,
  target: string
): Promise<string | null> {
  try {
    const T = window.Translator;
    if (!T) return null;
    const status = await T.availability({
      sourceLanguage: source,
      targetLanguage: target,
    });
    if (status === "unavailable") return null;
    const translator = await T.create({
      sourceLanguage: source,
      targetLanguage: target,
    });
    const out = (await translator.translate(text)).trim();
    return out && out !== text ? out : null;
  } catch {
    return null;
  }
}

async function translateMyMemory(
  text: string,
  source: string,
  target: string
): Promise<string | null> {
  try {
    const url =
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}` +
      `&langpair=${source}|${target}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const out = String(data?.responseData?.translatedText ?? "").trim();
    if (!out || out === text) return null;
    // MyMemory failure modes: echoes input, warns, or rate-limits.
    if (/MYMEMORY WARNING|QUERY LENGTH LIMIT|INVALID/i.test(out)) return null;
    return out;
  } catch {
    return null; // offline / blocked — UI simply shows no translation line
  }
}

export async function translateMessage(
  text: string,
  sourceLang: string
): Promise<string | null> {
  const trimmed = text.trim();
  // MyMemory caps queries at 500 chars — don't waste a request.
  if (trimmed.length === 0 || trimmed.length > 450) return null;
  const target = targetFor(sourceLang);
  const key = `${sourceLang}>${target}:${trimmed}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const out =
    (await translateOnDevice(trimmed, sourceLang, target)) ??
    (await translateMyMemory(trimmed, sourceLang, target));
  if (out) cache.set(key, out);
  return out;
}
