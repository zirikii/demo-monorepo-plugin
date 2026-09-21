# apps/gopay

Unofficial GoPay self-serve ReKYC demo. Vite + React 19 + Tailwind v4. Port **5184**.

- Class joiner: `cn` in `src/lib/cn.ts`
- Tokens live in `src/index.css` `@theme` (do not import other apps’ palettes)
- No real KYC vendors — `src/lib/rekyc-engine.ts` is the source of truth for PRD rules
