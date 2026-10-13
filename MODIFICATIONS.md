# Modifications log (our fork vs upstream `akinalpfdn/Mqvi`)

Running list of every change we make. Newest entries go on top.
`git status` is the source of truth — this file is the *why*.

## 2026-10-13 — Real translation lines + Messenger bubbles (still no API key)

- `client/src/lib/language/translate.ts`: real chain — Chrome/Edge on-device
  `window.Translator` first (free/private/offline after pack download), MyMemory
  keyless API fallback (`ja|en` verified live from server). Direction rule:
  `en -> ja`, everything else -> `en` (`targetFor`). Module-level cache keyed
  `src>tgt:text`; skips empty / >450 chars (MyMemory cap); failure → null (no line).
- `client/src/components/chat/MessageLanguageLine.tsx`: third stacked line
  `.msg-lang-trans` with live translation (async, cancelled on unmount/text change).
- `client/src/lib/language/detect.ts`: short all-Latin text (<12 chars) → `en`
  (tinyld called `hello` Italian; statistically unguessable, English is the
  better default; non-Latin always goes to the detector).
- `client/src/components/chat/Message.tsx`: own DM messages get `dm-own` class
  (`isOwner && mode === "dm"` — channels untouched).
- `client/src/styles/globals.css`: Messenger layout for `.dm-own` — row reversed,
  own avatar/name hidden, own bubble `--primary` blue with white text, time right.
- Verified: `npx tsc -b` exit 0. Live MyMemory output for the demo sentences:
  `翻訳機能の最新状況はどうなっていますか？` → "What is the latest status of the
  translation function?"; the English reply → "難しい部分は、今すぐ翻訳APIキーが必要です".
  NOTE: screenshot will show genuine engine output — wording differs slightly from
  any hand-written script; that is the honest demo (romaji likewise comes from
  wanakana, no macrons).

## 2026-10-13 — DM language lines: detect + badge + romaji (no API key)

- Deps: `npm install wanakana tinyld` (`client/package.json`).
- `client/src/lib/language/` (NEW): `detect.ts` (`detectLanguage` via tinyld,
  ISO-639-1 or null; `""`/emoji-only/short text → null), `names.ts`
  (English + native display names, ~19 langs + raw-code fallback), `romanize.ts`
  (`romanizeIfNeeded` — wanakana kana→romaji for `ja` only, kanji left as-is,
  null when identical), `translate.ts` (STUB `translateMessage` → null, seam for
  DeepL/Google key later), `index.ts` re-exports. All client-side, works offline.
- `client/src/components/chat/MessageLanguageLine.tsx` (NEW): stacked muted lines
  (`Japanese · 日本語` / romaji); English → bare `English` badge; null → renders nothing.
- `client/src/components/chat/Message.tsx`: renders `<MessageLanguageLine/>` under
  `.msg-text` when `mode === "dm"` + has text content — channels untouched, no prop drilling.
- `client/src/styles/globals.css`: `.msg-lang` styles (11px muted, romaji block).
- Verified: `npx tsc -b` exit 0; tinyld/wanakana behavior spot-checked via node
  (incl. kanji-only `元気` → `ja`, `おはよう、元気？` → `ohayou,元気?`).

## 2026-10-13 — Main view: friends list replaces "Select a channel"

- `client/src/components/layout/PanelView.tsx`
  - No-open-tab empty state now renders `<FriendsView />` instead of the
    "Select a channel / Pick one from the channel list on the left" placeholder.
  - Removed the now-unused `useTranslation("chat")` import.
  - Reuses upstream `FriendsView` as-is (Online/All/Pending/Add tabs, search,
    DM + call buttons). Closing all tabs returns to the friends list = home screen.
  - Verified: `npx tsc -b` exit 0.

## 2026-10-13 — Left sidebar: `.ch-tree` removed, stub + frozen backup

- `client/src/components/layout/ChannelTree.original.tsx` (NEW)
  - Byte-identical backup of upstream `ChannelTree.tsx` (md5-verified).
  - Not imported anywhere. Do not edit — this is the restore point.
- `client/src/components/layout/ChannelTree.tsx`
  - Replaced 960-line upstream version with a ~30-line stub: same props
    (`onJoinVoice`) so `Sidebar.tsx` is untouched, renders a placeholder div,
    no `.ch-tree` element.
  - Consequence: no friends/DMs/servers/channels tree, no add-server /
    create-channel / invite modals (all lived inside `.ch-tree`). Collapsed
    52px icon strip still works. Only `Sidebar.tsx` imports this file, no tests.
  - Verified: `npx tsc -b` exit 0.

## 2026-10-13 — Sidebars collapsed by default

- `client/src/stores/sidebarStore.ts`
  - `isExpanded` default `true` → `false` (both fallback paths in
    `loadPersistedSidebar`). Expanded = 240px tree, collapsed = 52px icon strip.
- `client/src/stores/uiStore.ts`
  - `membersOpen: true` → `false` (right members panel, in-memory only).
- Gotcha: defaults apply to FRESH state only. Existing accounts still boot
  expanded because state is re-applied on login from `localStorage["mqvi_sidebar"]`
  and server prefs (`sidebar_expanded` via `preferencesStore.applyFromServer`).
  To see the new defaults: delete the `mqvi_sidebar` localStorage key and collapse
  the left sidebar once (persists `sidebar_expanded: false` to server prefs).

## 2026-10-13 — Local dev setup (Option A), UNCOMMITTED — do not push

- `client/vite.config.ts`
  - `/api` → `https://mqvi.net`, `/ws` → `wss://mqvi.net` (upstream: `localhost:9090`).
  - `secure: false` + `changeOrigin: true` on both entries: vite's Node ws-proxy
    fails with `unable to verify the first certificate` (quirk in vite's proxy path;
    direct Node TLS verifies fine; `NODE_OPTIONS=--use-system-ca` does NOT fix it).
    Dev-only, traffic stays encrypted. Caddy/Cloudflare needs `Host: mqvi.net` to route.
  - Marked with REVERT comment in the file.
- `client/src/App.tsx`
  - `/` route skips `LandingPage` → `<Navigate to="/login" />`; removed unused import.
  - `LandingPage.tsx` file itself untouched, just unrouted.

## 2026-10-13 — Docs

- `AGENTS.md` — trimmed to mqvi-only essentials + added Local-dev Option A section,
  TLS gotcha, corrected deploy firewall ports, translation goal/hook points.
- This file (`MODIFICATIONS.md`) — created as the change log.
