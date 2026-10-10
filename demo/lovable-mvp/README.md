# RevealMe — A New Way to Connect

> Meet before you reveal.

RevealMe is a social/dating concept where profile photos start visually obscured and become clearer as two people interact. Connection first, appearance second.

**Status: MVP prototype running in demo mode.** All other people are fictional with generated photos.

## Current MVP scope
- Landing page with concept explainer
- Onboarding (name, 18+ age check, optional identity/preference, bio, photo upload, privacy note)
- Discover: blurred demo profiles with Pass / Connect
- Reveal Session: answer prompts together; each answer moves reveal 0 → 25 → 50 → 75 → 100
- Mutual connection state → Messages (simple chat, simulated replies)
- Profile: edit, privacy toggles, blocked list, reports, reset demo
- Report / Block / End session throughout

Not included (by design): payments, AI matching, video, push notifications, real auth.

## Architecture
- TanStack Start (React 19 + TypeScript), Tailwind v4, Vite
- `src/lib/reveal.ts` — reveal engine (stages, blur mapping, mutual rule). Swap for a rules engine later.
- `src/lib/demo-data.ts` — fictional profiles, prompts, seeded connection & messages. Demo only.
- `src/lib/store.tsx` — demo-mode state persisted to `localStorage`. Shape mirrors the planned DB tables.
- `docs/schema.sql` — planned data model (profiles, connections, reveal_sessions, interactions, messages, reports, blocks).
- `src/routes/` — one file per screen; `src/components/` — shared UI.

## Local development (demo / prototype only)
This is a **local demo prototype**, not a production app.

Prerequisites:
- [Bun](https://bun.sh) 1.3+ (package manager; lockfile is `bun.lock`)
- Node.js 22+ (some tooling runs on Node)

Commands:
```
bun install --frozen-lockfile   # install exact locked dependencies
bun run dev                     # start dev server
bun run lint                    # ESLint + Prettier check
bun run test                    # Vitest unit tests (incl. src/lib/reveal.test.ts)
bun run build                   # production build (no deployment)
```

CI: the repository workflow `.github/workflows/revealme-core-tests.yml` runs the reveal-engine tests on relevant pushes and pull requests. It does not deploy.

The original Lovable JPG portraits are not included in this GitHub snapshot. To keep the demo self-contained, this snapshot uses simple SVG portrait placeholders in `src/assets/`; these can be replaced with the original licensed/generated image assets later.

## Moving to a real backend
1. Enable a database + email/password auth.
2. Apply `docs/schema.sql` with GRANTs and RLS.
3. Replace `useStore` calls with server functions, keeping screen components unchanged.
4. Serve **server-side blurred** image variants per reveal level.

## Known limitations (privacy & security)
**Not production ready.** Do not use with real people or real photos.
- **The full image reaches the browser.** The blur is applied with CSS; anyone can view the original via dev tools. CSS blur is **not a security boundary**.
- **Demo data and local state only.** All other people are fictional; everything is stored in this browser's `localStorage`.
- **No production auth or backend.** There are no accounts, no real other users, no server.
- **Report and Block are not production services.** Reports are stored locally and never reviewed; blocks only hide people in this browser.
- Demo replies and "connects back" behaviour are simulated.