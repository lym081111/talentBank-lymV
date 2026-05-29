# PathLens — Judge Quickstart

**Live deployment:** https://path-lens-wine.vercel.app  
**Module:** Adaptive Readiness Profile — Universities Track  
**Hackathon:** Talentbank Tech Hackathon 2026 · Build Asia's Career OS

**📖 Full Feature Reference:** See [`docs/FEATURES.md`](../docs/FEATURES.md) for comprehensive page-by-page breakdown and technical details.

---

## Fastest Path: 2-Minute Demo

1. Open **https://path-lens-wine.vercel.app**
2. Click **"✨ See a Live Demo"** — Choose from 3 personas (Daniel Lee, Sarah Tan, Ahmad Razif)
3. Click any persona card to load their profile (instant load, no latency)
4. Click **"See My Readiness"** — Watch streaming Claude AI insights render live
5. Explore the dashboard, toggle dark mode (🌙 top-right), simulate trajectory (🧭)
6. You're looking at the full product in 60 seconds

---

## What to Evaluate on Each Screen

### Landing Page
- Asia context ("🌏 Built for Asia's Tech Market")
- How It Works section (4-step explainer)
- **NEW:** Demo persona selector (click "See a Live Demo" to reveal 3 personas)
  - Daniel Lee (SWE track, 3rd year)
  - Sarah Tan (Data track, 3rd year)
  - Ahmad Razif (Full-Stack track, 2nd year)
- Competition module tag at the bottom
- **NEW:** Dark mode toggle (🌙) available after selecting a demo

### Evidence Page
- Demo banner: "You're viewing [Student] demo profile"
- Profile card with **NEW:** Edit button (✏️) to customize profile fields
- 4-5 pre-loaded evidence items with realistic descriptions and GitHub links
- University field, evidence progress bar
- Click any evidence card to edit
- **NEW:** Export buttons for PDF & JSON formats
- **NEW:** Quick-start templates on empty state — 5 template cards (Portfolio, Internship, Hackathon, Certificate, FYP) that pre-fill the form
- "See My Readiness" button to proceed to dashboard

### Skill Extraction
- 14+ skills extracted from evidence (34-skill taxonomy, 120+ keywords)
- High / medium confidence breakdown
- Transparent — every skill traces back to a quoted phrase in the evidence
- **Market demand badges** per skill — 🔥 High demand / 📈 Growing / ⚠️ Niche (based on Asia tech market)
- **Green callout:** "X high-demand skills detected" when you have strong market-relevant skills
- **🌏 Asia Tech Market Alignment panel** — alignment % vs 34 high-demand skills tracked across Singapore, Jakarta, Bangalore, Manila; skill category breakdown (Frontend, Backend, Cloud, etc.); missing high-demand skills; market recommendation paragraph

### Readiness Dashboard (the main feature)
- **✨ Career Intelligence** — **NEW: Live streaming Claude AI responses** (watch text render token-by-token)
  - Pulsing dot (•) in AI badge shows streaming in progress
  - Instant demo personas load without API latency
  - Fallback to rule-based insights if API unavailable
  - **NEW:** Confidence badge (High/Medium/Low) based on evidence count
  - **NEW:** "How this AI works ↓" transparency panel — model, inputs, limitations, fallback logic
- **Readiness Radar** — pure SVG hexagonal chart across 6 dimensions
- **Score counter** — animates from 0 to actual score with ease-out
- **6 Dimension Cards** — staggered fade-in, score/status/explanation per dimension; weighted: Technical 20%, Portfolio 20%, Work Readiness 20%, Communication 15%, Production 15%, Role Fit 10%
- **ATS Compatibility Score** — keyword/action verb/metrics analysis + **🔍 Missing keyword chips** showing exactly which high-value terms to add
- **Portfolio Quality** — per-project scores with strengths and improvements
- **Career Guidance** — role matches, skills to develop, interview prep
- Buttons: Export PDF · Share with Career Services · **🧭 Simulate Trajectory** · View Paths Forward

### Trajectory Simulator
- Select a target role (SWE / Data / PM)
- Check actions you plan to take
- See projected score and timeline update live
- Gap alerts vs role requirements shown

### Paths Forward (Gaps)
- Top-priority gaps with concrete 30–90 day actions
- **📊 Data-Driven Priority panel** — Shows gap frequency ("64% of cohort struggles with this"), dimension weight relevance, and why this gap matters
- **🎯 Recommended Action** — Algorithm picks the single highest-impact, lowest-effort action; highlighted in green with recommendation badge
- "📝 Update Evidence & Re-check" button closes the loop
- **NEW:** Career OS inter-module connections — 3-box flow showing PathLens (03) → Internship Marketplace (04) → Lifelong Learning Wallet (05)
- "See University Cohort View →" link

### Cohort View
- **Student View** toggle: your scores vs cohort averages, dimension bar comparison
- **University View** toggle: why universities care, intervention playbook
- **NEW: 🏢 Employer View** toggle:
  - Recruiter card showing candidate profile, top 3 strengths, gap alert
  - Shortlist decision panel (✅ Shortlist / 🟡 Phone Screen / ❌ Not Yet) with AI-generated reasons
  - Resume vs PathLens comparison showing evidence-backed advantage
- Anonymous cohort submit (localStorage-backed, works offline)

---

## Running Locally

```bash
git clone <repo-url>
cd TechHackathon
npm install
npm run dev
# Open http://localhost:5173
```

**For AI features:** create `.env` with `VITE_ANTHROPIC_API_KEY=<your-key>` — without it, the app falls back to smart rule-based insights automatically.

**To run tests:**
```bash
npm test
# 88 tests across 8 files — weighted scoring, market insights, edge cases — all pass
```

---

## Key Differentiators vs Competitors

| Feature | PathLens | Typical Competitor |
|---|---|---|
| Real Claude AI narrative | ✅ (+ rule-based fallback) | ❌ or generic |
| Transparent skill extraction | ✅ (every skill traced to evidence) | ❌ black box |
| Trajectory Simulator | ✅ (role-aware, live projection) | ❌ |
| Student + University view | ✅ (toggle) | Student only |
| ATS + Portfolio Quality | ✅ | Rarely both |
| Works offline / no account | ✅ | Usually requires sign-up |
| 0 TypeScript errors, 88 unit tests | ✅ | — |

---

## Architecture in 3 Lines

- **Frontend only:** React 19 + TypeScript + Vite, deployed on Vercel
- **AI:** Claude claude-haiku-4-5 via `@anthropic-ai/sdk` (client-side for demo; comment in aiInsights.ts explains production proxy pattern)
- **Persistence:** localStorage (evidence, cohort submissions, student profile) — no backend needed

Full architecture: see `ARCHITECTURE.md`

## Performance

| Metric | Value |
|---|---|
| Initial bundle (gzip) | ~141 KB (code-split; was 477 KB) |
| PDF library load | On-demand only (~267 KB, loads when user clicks Export) |
| Page load strategy | React.lazy + Suspense — 7 route chunks |
| Build time | ~1.6s |
| TypeScript errors | 0 |
| Unit tests | 88 passing (8 files) |

---

## Scoring Rubric Alignment

| Criterion | Weight | PathLens Implementation |
|---|---|---|
| Product & UX | 30% | Warm palette, dark mode, animations, radar chart, quick-start templates, employer view, mobile-responsive |
| System Design | 25% | 6-dimension scoring, transparent extraction, cohort data layer, Career OS 5-module architecture |
| Completeness | 20% | All 7 pages + employer view, AI insight, export, cohort, trajectory, market demand badges, Career OS connections |
| AI Craft | 15% | Real Claude AI streaming, confidence badge, AI transparency panel, demo fallback, rule-based fallback, **cohort-aware gap prioritization** with data-driven recommendations |
| Code Quality | 10% | TypeScript 0 errors, 92 unit tests (8 files), React.lazy code splitting, modular CSS Modules, clean hooks, DIMENSION_WEIGHTS single source of truth |

---

*PathLens — Navigate your career. Not predict it.*
