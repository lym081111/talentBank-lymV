# PathLens — Career OS · Universities Module 03

**Navigate your career. Not predict it.**

**Live Demo:** https://talentbank-lymv-career-os.vercel.app
**Hackathon:** Talentbank Tech Hackathon 2026 — Build Asia's Career OS
**Track:** Universities
**Module:** 03 — Adaptive Readiness Profile + Career Marketplace Bridge

---

## What PathLens Does

PathLens turns a student's actual evidence (projects, internships, certificates, hackathons, FYPs) into a transparent career readiness profile — then bridges directly into Career OS marketplace matching so employers can find candidates at the right moment, before applications.

**Design Principle:** Navigation, not prediction. PathLens shows where you stand and what paths exist — it never declares a permanent outcome. Careers are too complex for deterministic claims.

---

## Judge Quickstart (Under 5 Minutes)

1. Open https://talentbank-lymv-career-os.vercel.app
2. Click **✨ See a Live Demo**
3. Choose a persona: **Priya Sharma** (Senior SWE), **Kai Chen** (Data Eng), or **Aisha Patel** (PM)
4. Click through Evidence → Skills → Readiness Dashboard
5. On the Dashboard: see Radar Chart, 6 Dimension Scores, Career Marketplace Bridge, AI Insight, Learning Road
6. Click **View Paths Forward** for gap actions
7. Click **University Cohort View** for student / university / employer perspectives

---

## Career OS Architecture

```
Student Evidence
      │
      ▼
┌─────────────────────────────────┐
│  PathLens: Adaptive Readiness   │
│  Profile (Universities Module)  │
│                                 │
│  • Skill Extraction (34 skills) │
│  • 6-Dimension Scoring          │
│  • Portfolio Quality Analysis   │
│  • ATS Compatibility Check      │
│  • Gap Action Plan              │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  Career OS Marketplace Bridge   │
│                                 │
│  Candidate ◄──────► Employer   │
│  • Match tier visibility        │
│  • Employer network (10,000+)   │
│  • Pre-application discovery    │
│  • Gap-to-unlock signals        │
└─────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  University Cohort Dashboard    │
│                                 │
│  Student / University /         │
│  Employer perspective toggle    │
│  • Cohort benchmarking          │
│  • Shortlist signal             │
│  • Outcome tracking             │
└─────────────────────────────────┘
```

---

## Feature Map

| Feature | Description |
|---|---|
| Evidence Profile | Projects, internships, certificates, hackathons, FYPs |
| Skill Extraction | Maps evidence to 34 skills with demand levels (High / Growing / Niche) |
| 6-Dimension Scoring | Technical, Portfolio, Work Readiness, Communication, Production, Role Fit |
| Radar Chart | Visual comparison across all 6 dimensions |
| Career Marketplace Bridge | Shows employer visibility by tier (Unicorns → MNCs → Startups → Grad Programs) |
| AI Career Insight | Claude-generated narrative, key gap, and next step |
| Learning Road | Visual SVG road showing skill priority: main road (high) → branches (medium) |
| Portfolio Quality | Per-project scoring: Documentation × Complexity × Impact × Deployment |
| ATS Compatibility | Resume keyword and structure analysis |
| Gap Action Plan | Priority gaps with projected score impact and timeline |
| Trajectory Simulator | What-if scoring based on adding new skills |
| University Cohort View | Student / University / Employer perspective toggle |
| PDF & JSON Export | Portable career proof for applications and career services |

---

## AI Tooling Disclosure

> Required by Talentbank Tech Hackathon 2026 rules. Submitting wholly AI-generated work without disclosure = disqualification.

| Tool | Provider | How Used | Why |
|---|---|---|---|
| **Claude claude-haiku-4-5** | Anthropic | Live career insight generation: narrative, key gap, next step | Best structured JSON output with low latency; streaming token-by-token rendering |
| **Claude Sonnet (Claude Code)** | Anthropic | Development: component scaffolding, TypeScript fixes, refactoring, UI iteration | Accelerated 28-day build phase significantly |
| **Deterministic Scoring Engine** | Custom | All 6-dimension scoring, ATS, portfolio quality, skill taxonomy | Explainable without trusting AI output; aligns with navigation-not-prediction principle |
| **Skill Taxonomy (34 skills)** | Custom dataset | Maps evidence text to market-demand categories for SE Asia tech hiring | Grounds extraction in real Asia market data |

**Design decision:** Scoring is 100% deterministic and rule-based. Claude is used only for narrative generation. Every score can be verified by a judge without trusting any AI output.

---

## Local Setup

```bash
git clone https://github.com/lym081111/talentBank-lymV
cd talentBank-lymV
npm install
npm run dev
```

Open http://localhost:5173

**Optional — Live Claude AI insights:**
```bash
# Create .env file
VITE_ANTHROPIC_API_KEY=your_key_here
```

Without a key, the app uses deterministic fallback insights. Demo personas use pre-generated insights for zero-latency judge evaluation.

---

## Deployment

Deployed on Vercel. Auto-deploys on push to `main`.

Build command: `npm run build`  
Output directory: `dist`

---

## Test Coverage

```bash
npm run test
```

Tests cover: `readinessScoring`, `skillExtraction`, `portfolioQuality`, `atsScoring`, `aiRecommendations`, `marketInsights`, `nextActions`

---

## Module Selection Rationale

**Primary:** Universities Track — Module 03: Adaptive Readiness Profile

**Why:** Most Malaysian/SEA university students don't know if they're internship-ready until rejection. PathLens surfaces that gap while universities and students still have time to act.

**Career OS Connection:** The Marketplace Bridge directly implements the Career OS mandate — candidates discoverable at right moments; employers find talent pre-application. The Cohort View gives universities the employer-facing signal to validate curriculum against real hiring outcomes.

---

Built for Talentbank Tech Hackathon 2026.
