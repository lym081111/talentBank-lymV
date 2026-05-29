# PathLens

**Navigate your career. Do not just predict it.**

**Live demo:** https://talentbank-lymv-career-os.vercel.app  
**Hackathon:** Talentbank Tech Hackathon 2026 - Build Asia's Career OS  
**Module:** Adaptive Readiness Profile - Universities Track, with a Career Marketplace bridge

PathLens turns a student's actual evidence into a transparent readiness profile. Students add projects, internships, certificates, hackathons, or FYPs; PathLens extracts skills, scores readiness across six weighted dimensions, identifies gaps, and previews how the profile could feed Career OS marketplace matching.

## Why It Exists

Many students do not know whether they are internship-ready until rejection makes the gaps obvious. PathLens makes those gaps visible earlier, while students and universities still have time to act.

The product principle is simple: **navigation, not prediction**. PathLens does not declare a permanent outcome. It shows the student's current landscape, realistic paths, blockers, and next evidence to build.

## Core Features

| Feature | What it does |
|---|---|
| Evidence profile | Collects projects, internships, certificates, hackathons, and final-year projects |
| Transparent skill extraction | Maps evidence text to 34 skills with source phrases |
| Six-dimension readiness score | Scores Technical, Portfolio, Work Readiness, Communication, Production, and Role Fit |
| Claude career insight | Generates narrative coaching, key gap, and next step only |
| Deterministic scoring | Keeps scores, skills, ATS analysis, and marketplace matching explainable |
| Gap action plan | Shows priority gaps, quick win, projected impact, timeline, and effort |
| Career Marketplace preview | Uses mock roles to show match fit, blockers, and next move |
| University cohort view | Shows Student, University, and Employer perspectives |
| Export tools | Supports PDF, JSON, and copyable profile summaries |

## Judge Flow

1. Open the live demo or run locally.
2. Click **See a Live Demo**.
3. Choose a student persona.
4. Review evidence and continue to skill extraction.
5. Open the dashboard for readiness, AI insight, ATS, and portfolio quality.
6. Visit **Paths Forward** for gaps and the Career Marketplace bridge.
7. Open **University Cohort View** to see university and employer perspectives.

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

For optional live Claude calls, create `.env`:

```bash
VITE_ANTHROPIC_API_KEY=your_key_here
```

Without an API key, the app uses deterministic fallback insights.

## Verification

```bash
npm test
npm run build
```

On Windows PowerShell with restricted script execution, use:

```bash
npm.cmd test
npm.cmd run build
```

## Architecture

- React 19 + TypeScript + Vite.
- CSS Modules with custom properties.
- localStorage persistence for prototype evidence and cohort submissions.
- Deterministic utilities for scoring, skill extraction, ATS, portfolio quality, recommendations, and marketplace matching.
- Claude `claude-haiku-4-5` is used only for narrative career insight.
- Production path: move evidence, cohort, and marketplace data from local/static sources to backend APIs.

## Important Files

- `PROPOSAL.md` - concise concept brief.
- `ARCHITECTURE.md` - technical design notes.
- `JUDGE_QUICKSTART.md` - demo walkthrough.
- `docs/FEATURES.md` - detailed feature guide.
- `src/utils/marketplaceMatching.ts` - Module 04 marketplace bridge logic.

## Career OS Handoff

PathLens produces a profile that future modules can consume:

- Module 04 Career Marketplace: `overall`, `dimensions`, `allExtractedSkills`, target role, and blockers.
- Module 05 Learning Wallet: evidence items, score snapshots, and timestamps.

The current marketplace roles are mock data, clearly marked in-product.
