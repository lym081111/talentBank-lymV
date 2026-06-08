# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**PathLens** is a Career Readiness Navigator for Asia's tech market, built for the Talentbank Tech Hackathon 2026 (Universities Track, Module 03 - Adaptive Readiness Profile). It's a frontend-only prototype that helps students see evidence-backed readiness and helps universities identify cohort gaps early.

Key principle: **Transparent evidence extraction + AI-assisted explanation**. AI is used for narrative insights only; scoring, skill extraction, and confidence scoring are deterministic and auditable.

## Quick Commands

```bash
# Development server (runs on localhost:5173)
npm run dev

# Type checking and production build
npm run build

# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch

# Preview production build locally
npm run preview
```

## Project Architecture

### Data Flow

```
Student evidence
  → skill extraction
  → deterministic 6-dimension readiness scoring
  → AI-assisted narrative explanation
  → gap action plan
  → university cohort interventions
```

### Scoring Model (Deterministic)

Six dimensions, each scored independently and visible on the dashboard with:
- Score and status
- Why this score (evidence source and matched signals)
- Contributing evidence

Dimensions:
1. **Technical Skills** — language proficiency, framework familiarity, tool mastery
2. **Portfolio Evidence** — quality and diversity of project work
3. **Work Readiness** — internship/employment history, production practices
4. **Communication & Documentation** — README quality, written communication clarity
5. **Production Practices** — deployment, testing, CI/CD, monitoring evidence
6. **Role-Specific Fit** — alignment with target job description signals

### AI Integration

- **Provider:** Anthropic Claude (Haiku 4.5 for explanations)
- **Usage:** narrative insight, key gap wording, next-step coaching only
- **Fallback:** deterministic text if API is unavailable
- **Environment variable:** `VITE_ANTHROPIC_API_KEY` (optional; without it, the app uses fallback insights)

## Codebase Structure

```
src/
├── components/           # React components (evidence intake, dimension cards, charts)
├── pages/               # Page-level views (Talent, Employer, University)
├── utils/               # Deterministic scoring and skill extraction logic
│   └── __tests__/       # Unit tests for scoring and extraction
├── hooks/               # React hooks (state management, AI calls)
├── types/               # TypeScript type definitions
├── data/                # Mock data for demo (students, cohorts)
└── App.tsx              # Main app component
```

### Key Components

- **EvidenceForm.tsx** — Editable evidence intake (projects, internships, certificates, etc.)
- **DimensionScoreGauge.tsx** — Individual dimension cards with score, status, and audit trail
- **RadarChart.tsx** — 6-dimension readiness visualization
- **SkillExtractionCard.tsx** — Extracted skills with matched phrases and confidence
- **AICareerInsight.tsx** — AI-powered narrative explanation and next steps
- **GapActionCard.tsx** — Prioritized action plan from identified gaps

### Key Utilities

- **Scoring engine** — Deterministic rule-based scoring for all six dimensions
- **Skill extraction** — Pattern matching and taxonomy-based skill identification
- **ATS scoring** — Resume/application tracking system score
- **Portfolio quality assessment** — Evidence quality heuristics

## Tech Stack

- **Build:** Vite 8 + React 19 + TypeScript 6
- **Styling:** Tailwind CSS + PostCSS
- **AI:** Anthropic Claude SDK
- **Testing:** Vitest (with Vitest UI)
- **Deployment:** Vercel (auto-deployed from git)

## Testing

Tests are located in `src/utils/__tests__/` and match test files (`*.test.ts`). They cover:
- Readiness scoring for all six dimensions
- Skill extraction and taxonomy matching
- Portfolio quality scoring
- ATS scoring
- Deterministic fallback insights

Run single test file:
```bash
npm run test -- src/utils/__tests__/scoring.test.ts
```

## Important Design Decisions

1. **Scoring is deterministic** — no ML or AI for scores. Every readiness score can be verified by inspecting the evidence trail.
2. **AI is explanation-only** — if Claude API is unavailable, the app degrades gracefully to deterministic fallback insights.
3. **Frontend-first Stage 1** — no backend, authentication, or real employer/university integration. Uses mock data for demo.
4. **Evidence is the source of truth** — all insights are derived from student-entered evidence; nothing is predicted without evidence.

## Vercel Deployment

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Environment variable:** `VITE_ANTHROPIC_API_KEY` (optional)
- **Live demo:** https://talentbank-lymv-career-os.vercel.app

## Documentation

- `docs/ARCHITECTURE.md` — Detailed architectural decisions and scope
- `docs/DEMO_FLOW.md` — Judge demo walkthrough
- `docs/SUBMISSION.md` — Hackathon submission notes
- `JUDGE_QUICKSTART.md` — Quick start for evaluators
- `PROPOSAL.md` — Hackathon proposal
