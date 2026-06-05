# PROJECT_HANDOFF.md

## Current Goal
PathLens — Career Readiness Navigator for Asia's Tech Market (Talentbank Tech Hackathon 2026).
Latest focus: interactive Career OS portal on the Landing page with cinematic animations.

## What Was Just Done (commit 29c8e1b)
Complete rewrite of `src/components/CareerOSPortal.tsx`:

### Animations
- **Mode toggle**: CSS `transition: left .32s cubic-bezier(.4,0,.2,1)` sliding pill between Talent OS and Recruiter Dashboard
- **Tag switch / mode switch**: `animKey` state increment forces grid re-mount → staggered `fadeInUp` per card (0ms, 60ms, 120ms, 180ms, 240ms)
- **Card hover**: `translateY(-3px)` + purple glow shadow via `.portal-card` CSS class
- **CTA hover**: `translateY(-2px)` + fuchsia/cyan glow via `.cta-glow`
- **Live badge**: pulsing neon dot via `.neon-dot` keyframe

### Data Coverage (all MYR, Malaysian market)
| Tag | Modules |
|-----|---------|
| 🎓 Final Year CS | Career Path (corporate vs startup), Living Portfolio, AI Coach, Fair Pay Engine, Life Chapter Designer |
| ⚡ 2 YOE Node.js | Salary ceiling analysis, Cloud upskill ROI, Fullstack vs specialize, Pay gap −MYR 3K/mo, AWS cert timeline |
| 🎨 Non-Tech UX Pivot | 3-path navigator, Case study audit, React bootcamp ROI, Pay gap vs PD, 9-month timeline |
| 💼 Next.js Dev (<7K) | Velocity matching, Retention signals, Silver medalist re-engagement, Day-32 onboarding panel, Supply forecast |
| 📊 Senior Data Eng (12K+) | PySpark matching, Stealth attrition risk, Rejected-then-qualified pipeline, Ramp predictor, 2028 scarcity |

### Technical
- Inline styles used for all accent colours (avoids Tailwind JIT purge on dynamic class names)
- `P` colour palette constant: fuchsia, cyan, emerald, amber, rose, blue — all with bg/border/text/bar values
- Micro-components: `Alert`, `SalBar`, `StatGrid`, `Row`, `Timeline`
- Props: `{ onViewDemo, onBuildOwn }` — unchanged from Landing.tsx usage at line 746

## Files Changed Since Session Start
| File | Commit | Description |
|------|--------|-------------|
| `src/components/CareerOSPortal.tsx` | 29c8e1b | Full rewrite (cinematic portal) |
| `src/pages/Landing.tsx` | c6660c1 | Restored new 818-line version from orphaned git blob |
| `src/App.css` | c6660c1 | Added `@tailwind` directives |
| `tailwind.config.js` | c6660c1 | NEW — Tailwind v3 |
| `postcss.config.js` | c6660c1 | NEW — PostCSS |
| `package.json` | c6660c1 | Added tailwindcss@3, postcss, autoprefixer |
| `.claude/launch.json` | c6660c1 | Fixed port 5174→5173 |

## Verified Working
- TypeScript: `npx tsc --noEmit` → clean
- Tests: `npx vitest run` → 92/92 pass
- Build: `npm run build` → succeeds
- Browser: mode toggle switches tags, `fadeInUp` stagger plays on each switch, employer modules load on tag click

## Architecture Notes
- Inner pages (ProfileAndEvidence, Dashboard, Gaps, etc.) still use CSS Modules — no conflict with Tailwind
- CareerOSPortal is a purely presentational component: no API calls, all data inline
- `onViewDemo` prop is accepted but not used inside CareerOSPortal (CTA calls `onBuildOwn` only)

## Potential Next Steps
1. Add scroll-triggered animation so CareerOSPortal fades in when it enters the viewport
2. Make the tag slider background also animate (pill-slide like the mode toggle) instead of instant switch
3. Wire up "Map My Career Path →" hero CTA to scroll to CareerOSPortal
4. Add keyboard navigation (Tab/Enter) for accessibility on tag chips
