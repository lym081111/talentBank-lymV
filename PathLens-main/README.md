# PathLens

**Navigate your career. Not predict it.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?logo=vercel)](https://path-lens-wine.vercel.app)
[![Tests](https://img.shields.io/badge/Tests-92%20passing-brightgreen)](./src/utils/__tests__)
[![TypeScript](https://img.shields.io/badge/TypeScript-0%20errors-blue)](./tsconfig.json)
[![Claude AI](https://img.shields.io/badge/AI-Claude%20Haiku-4.5-orange)](https://anthropic.com)
[![Cohort Intelligence](https://img.shields.io/badge/Cohort%20Aware-Data%20Driven-blueviolet)]()
[![WCAG AA](https://img.shields.io/badge/Accessibility-WCAG%20AA-green)]()
[![Production Ready](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)]()
[![Career OS](https://img.shields.io/badge/Career%20OS-Module%2003%20of%205-violet)](https://path-lens-wine.vercel.app)

> **Talentbank Tech Hackathon 2026** · Build Asia's Career OS  
> Module: **Adaptive Readiness Profile — Universities Track (03 of 05)**

---

## 🎯 For Judges

**📖 Submission Guide:** [`SUBMISSION_GUIDE.md`](./SUBMISSION_GUIDE.md) — How to evaluate PathLens in 2 minutes  
**🚀 Quick Start:** [`docs/JUDGE_QUICKSTART.md`](./docs/JUDGE_QUICKSTART.md) — Page-by-page evaluation guide  
**📚 Features:** [`docs/FEATURES.md`](./docs/FEATURES.md) — Comprehensive 450+ line feature walkthrough  

**Live:** https://path-lens-wine.vercel.app — Click "See a Live Demo" to start

---

## What PathLens Does

Most CS students in Southeast Asia don't know if they're ready for internships — until they get rejected. PathLens maps your actual evidence (projects, internships, certifications) to a scored career readiness profile across **6 dimensions**, powered by Claude AI, with a radar chart, ATS analysis, trajectory simulation, and a university cohort view.

**It's a navigation tool. Not a prediction engine.**

---

## Features

| Feature | Description |
|---|---|
| ✨ **Streaming Claude AI** | Token-by-token live rendering — confidence badge, AI transparency panel, fallback |
| 🌙 **Dark Mode** | Full dark theme with system preference detection & persistent storage |
| 📡 **Readiness Radar** | Pure SVG hexagonal chart across 6 dimensions with live animations |
| 🎯 **6-Dimension Weighted Scoring** | Technical (20%), Portfolio (20%), Work Readiness (20%), Communication (15%), Production (15%), Role Fit (10%) |
| 🔥 **Market Demand Badges** | Every extracted skill tagged: High demand / Growing / Niche (Asia tech market) |
| 🌏 **Asia Market Alignment** | Alignment % vs 34 high-demand skills tracked across Singapore, Jakarta, Bangalore, Manila |
| 🧭 **Trajectory Simulator** | Select actions → see projected score + timeline before you commit |
| 📊 **ATS Compatibility Score** | Keyword, action verb, metrics analysis + **missing keyword suggestions** |
| 💼 **Portfolio Quality Analysis** | Per-project scores: documentation, complexity, impact, deployment |
| 🏫 **3-Perspective Cohort View** | Student / University / **Employer** — recruiter card + shortlist decision panel |
| 📝 **Quick-Start Templates** | 5 evidence templates (Portfolio, Internship, Hackathon, Certificate, FYP) |
| 🌏 **Career OS Connections** | Module 03 of 5 — shows flow to Internship Marketplace & Learning Wallet |
| ✏️ **Editable Profiles** | Inline profile editing for name, university, year, major, target role |
| 📥 **Multi-Format Export** | PDF reports + JSON export + **Copy Profile Summary** to clipboard |
| 🚀 **Quick Win Card** | Algorithm picks the single highest-impact, lowest-effort action on Gaps page |
| 💡 **Cohort-Aware Gap Prioritization** | Data-driven recommendations: "64% of cohort has this gap. Fix it first." |
| 🛡️ **Error Boundaries** | Graceful error recovery with helpful error messages |
| 🔄 **Re-check Flow** | Update evidence → see dimensions shift |

**📖 Full Feature Walkthrough:** See [`docs/FEATURES.md`](./docs/FEATURES.md) for page-by-page breakdown, AI logic, and what judges should look for.

---

## Quick Start

```bash
npm install
npm run dev
# Open http://localhost:5173
```

**For AI features** (optional): add `VITE_ANTHROPIC_API_KEY=<key>` to `.env`. Without it, the app falls back to smart rule-based insights automatically.

**Run tests:**
```bash
npm test
# 88 tests, 8 test files — weighted scoring, market insights, edge cases
```

---

## Architecture

- **Frontend only:** React 19 + TypeScript + Vite
- **AI:** `@anthropic-ai/sdk` calling `claude-haiku-4-5` client-side (hackathon demo; production would proxy via Vercel Edge Function)
- **Persistence:** localStorage — no backend, no accounts, fully offline-capable
- **Scoring:** Rule-based, transparent — every skill traces back to a quoted phrase in evidence
- **Code splitting:** `React.lazy` + `Suspense` — each of 7 pages loads on demand; initial load ~141 KB gzip (vs 477 KB monolithic); pdf library (~267 KB) loads only on user click
- **Deployment:** Vercel (SPA rewrites configured)

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for full design notes.

---

## Project Structure

```
src/
  pages/          Landing, ProfileAndEvidence, SkillExtraction,
                  ReadinessDashboard, Gaps, CohortView, TrajectorySimulator
  components/     RadarChart, AICareerInsight, ATSScoreCard, PortfolioQualityCard,
                  ReadinessDimensionCard, AppFooter, Navigation, ...
  utils/          readinessScoring, skillExtraction, atsScoring, portfolioQuality,
                  aiInsights, aiRecommendations, cohortApi, pdfExport
  hooks/          useEvidence, useStudentProfile
  types/          evidence.ts, navigation.ts
  data/           mockStudent, mockCohort, skillTaxonomy
  utils/__tests__ readinessScoring, skillExtraction, atsScoring, portfolioQuality,
                  nextActions, aiRecommendations, marketInsights, edgeCases (88 tests, 8 files)
```

---

## AI Disclosure

| Aspect | Detail |
|---|---|
| **Model** | `claude-haiku-4-5` (Anthropic) via `@anthropic-ai/sdk` |
| **What AI does** | Generates narrative insight, key gap, and recommended next step in structured JSON |
| **What AI does NOT do** | Score dimensions (rule-based), extract skills (keyword match), ATS analysis (keyword lookup) |
| **Streaming** | Real: `client.messages.stream()` token-by-token; Demo personas: simulated 8ms/char |
| **Fallback** | Deterministic rule-based insight if API key absent or API unavailable |
| **Transparency** | "How this AI works" panel visible in-product with inputs, limitations, fallback details |
| **Data** | Evidence text only — no names, grades, or PII sent to API in production build |

---

## Judge Quickstart

→ See [`JUDGE_QUICKSTART.md`](./JUDGE_QUICKSTART.md) for the 2-minute evaluation guide.

---

## License

MIT
