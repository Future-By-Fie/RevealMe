# RevealMe MVP — Fix build errors and test every flow

Goal: get the preview loading again. Only type-safety fixes. No changes to the UI, behaviour, scope, or new features. No backend.

## Current errors (21 type errors in 6 files, all from strict settings `noPropertyAccessFromIndexSignature` + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes`)

| File | Line(s) | Cause | Smallest fix |
|---|---|---|---|
| src/components/ProfileForm.tsx | 34–38, 69–75, 92 | `err` is `Record<string,string>`, so `err.name` / `.age` / `.bio` is an index-signature access | Type it `type Errors = Partial<Record<"name" \| "age" \| "bio", string>>`; use it for `useState<Errors>` and the local `errors` |
| src/components/SafetyDialog.tsx | 8, 26 | `useState(REASONS[0])` infers `string \| undefined` | `useState<string>(REASONS[0] ?? "Something else")` |
| src/lib/demo-data.ts | 73 | `p.options[0]` may be undefined | `mine: p.options[0] ?? ""` |
| src/routes/index.tsx | 28 (used 52, 58) | `REVEAL_STAGES[i]` may be undefined | `const level = REVEAL_STAGES[i] ?? 0;` |
| src/routes/messages.$id.tsx | 43 | random `DEMO_REPLIES[...]` may be undefined | `text: DEMO_REPLIES[...] ?? "Ha, I like that."` |
| src/routes/session.$id.tsx | 49–50 | `s.connections[id]` may be undefined in `answer` | `if (!cur) return s;` before using it |
| src/routes/session.$id.tsx | 107 | spreading possibly-undefined connection for "End session" | `update((s) => { const cur = s.connections[id]; if (!cur) return s; return { ...s, connections: { ...s.connections, [id]: { ...cur, ended: true } } }; })` |

No tsconfig changes (keep strict mode). No casts or `!` assertions.

## Click-through test plan (after fix, fresh localStorage, 1280px and 390px)

1. Landing `/`: hero photo blur cycles, "How it works" scrolls, "Try RevealMe" goes to /onboarding.
2. Onboarding: empty submit shows name/age errors; age 17 shows 18+ error; bio >160 shows error; upload photo shows blurred preview; valid submit goes to /discover.
3. Discover: demo cards blurred; Pass hides a card; Connect opens the reveal session.
4. Reveal session: answer prompts; blur and meter step up each answer; "End session" returns to /connections with session marked ended.
5. Mutual connection: with Maya (connects back) reaching full reveal, mutual state shows and a link to messages; with Sam (does not connect back) the "hasn't connected back yet" message shows.
6. Messages: list shows Jonas seed chat; open, send a message, demo reply appears after ~1.5s; unknown id shows "This conversation isn't available".
7. Profile/privacy: edit and save profile; toggles (blur, show age, discoverable) persist after reload; reset demo restores seeds.
8. Report/Block: report from session and chat opens dialog, Escape/Cancel closes, Send saves; Block hides that person from discover, connections, messages; unblock in Profile restores them.
9. Check console and runtime logs for errors throughout.

## Consolidated build prompt (for implementation)

> Fix only the TypeScript strict-mode errors in RevealMe; do not change UI, copy, behaviour, tsconfig, or scope, and don't add a backend. Apply: (1) ProfileForm.tsx: type the errors state as `Partial<Record<"name"|"age"|"bio", string>>` for both `useState` and the local `errors` object. (2) SafetyDialog.tsx: `useState<string>(REASONS[0] ?? "Something else")`. (3) demo-data.ts seedConnections: `mine: p.options[0] ?? ""`. (4) routes/index.tsx: `const level = REVEAL_STAGES[i] ?? 0`. (5) messages.$id.tsx demo reply: `?? "Ha, I like that."` fallback. (6) session.$id.tsx: in `answer` and in the End session handler, read `const cur = s.connections[id]; if (!cur) return s;` before spreading. No casts or non-null assertions. Then run a type check until it's clean, check build-errors.log, and use Playwright to click through landing, onboarding (including validation), discover, connect, reveal session, mutual connection (Maya) and non-mutual (Sam), messages with demo reply, profile/privacy persistence, and report/block/unblock. Report anything that fails.