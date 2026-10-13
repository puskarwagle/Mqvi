/**
 * MessageLanguageLine — under-message language info (DMs only).
 *
 * Stacked, muted lines (max three):
 *   Japanese · 日本語
 *   konnichiha
 *   Hello                  <- live translation (ja->en / en->ja rule)
 * English messages get a bare `English` badge; a translation to Japanese
 * appears under them once it loads. Renders nothing when undetectable.
 */

import { useEffect, useMemo, useState } from "react";
import {
  detectLanguage,
  languageName,
  romanizeIfNeeded,
  translateMessage,
} from "../../lib/language";

function MessageLanguageLine({ text }: { text: string }) {
  const info = useMemo(() => {
    const code = detectLanguage(text);
    if (!code) return null;
    return { code, name: languageName(code), romaji: romanizeIfNeeded(text, code) };
  }, [text]);

  const code = info?.code;

  // { text, value } pair: dropping the synchronous reset — a stale result for
  // an older text is ignored at render time instead of cleared in the effect.
  const [translation, setTranslation] = useState<{
    text: string;
    value: string | null;
  } | null>(null);
  useEffect(() => {
    if (!code) return;
    let cancelled = false;
    translateMessage(text, code).then((t) => {
      if (!cancelled) setTranslation({ text, value: t });
    });
    return () => {
      cancelled = true;
    };
  }, [text, code]);

  if (!info) return null;
  const shownTranslation =
    translation && translation.text === text ? translation.value : null;

  const label =
    info.name.native === info.name.en
      ? info.name.en
      : `${info.name.en} · ${info.name.native}`;

  return (
    <div className="msg-lang">
      <span className="msg-lang-name">{label}</span>
      {info.romaji && <span className="msg-lang-romaji">{info.romaji}</span>}
      {shownTranslation && (
        <span className="msg-lang-trans">{shownTranslation}</span>
      )}
    </div>
  );
}

export default MessageLanguageLine;
