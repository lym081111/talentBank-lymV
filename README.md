# PathLens - Career OS Universities Module 03

**Navigate readiness. Do not predict careers.**

**Live Demo:** https://talentbank-lymv-career-os.vercel.app  
**Hackathon:** Talentbank Tech Hackathon 2026 - Build Asia's Career OS  
**Track:** Universities  
**Module:** 03 - Adaptive Readiness Profile

## What PathLens Does

PathLens turns student evidence - projects, internships, certificates, hackathons, final year projects, and resume items - into a transparent Adaptive Readiness Profile.

Not a prediction engine. PathLens makes readiness visible from student evidence.

The prototype helps students see what their evidence proves, helps universities identify cohort gaps early, and shows how this profile can later feed the wider Career OS marketplace layer without building a full marketplace in Stage 1.

## For Judges

**What this is:** an Adaptive Readiness Profile module for the Universities track of Talentbank Career OS.

**Student value:** students see extracted skills, source evidence, matched phrases, confidence, readiness score, gaps, and next actions.

**University value:** universities see cohort-level readiness gaps and recommended interventions before internship season.

**2-minute demo flow:** Evidence -> Extraction -> Readiness -> Gaps -> University Insight.

**AI craft:** transparent evidence extraction + AI-assisted explanation. Scoring, skill extraction, matched phrases, confidence, and university intervention priority are deterministic and auditable.

**Stage 1 scope:** frontend prototype only. No backend, authentication, real university integration, or real employer marketplace.

Supporting docs:

- `docs/DEMO_FLOW.md`
- `docs/ARCHITECTURE.md`
- `docs/SUBMISSION.md`

## Judge Quickstart

1. Open https://talentbank-lymv-career-os.vercel.app
2. Click **Try the 2-minute demo**.
3. Choose a sample candidate: Priya Sharma, Kai Chen, or Aisha Patel.
4. Review the candidate pages: Profile, Evidence, Skills, Trajectory, Matches.
5. Click **Open full OS demo**.
6. Continue through Evidence -> Extraction -> Readiness.
7. On the dashboard, inspect the 6 dimension cards. Each shows score, status, why this score, evidence source, and matched signals.
8. Click **View Paths Forward** for gap actions.
9. Click **University Cohort View** for student, university, and employer perspectives. In University View, inspect recommended interventions based on top gaps.

## Architecture

```text
Student evidence
  -> skill extraction
  -> deterministic readiness scoring
  -> AI-assisted explanation
  -> gap action plan
  -> university cohort interventions
```

## Feature Map

| Feature | Description |
|---|---|
| Evidence Profile | Editable projects, internships, certificates, hackathons, FYPs, and resume proof |
| Skill Extraction | Shows extracted skill, evidence source, matched phrase, and confidence |
| 6-Dimension Scoring | Technical, Portfolio, Work Readiness, Communication, Production, Role Fit |
| Readiness Dashboard | Radar chart plus auditable dimension cards |
| AI Career Explanation | Narrative insight, key gap, and next step based on entered evidence |
| Gap Action Plan | Prioritized next actions with timeline and expected impact |
| University Cohort View | Student benchmark, university interventions, employer-facing summary |
| Career OS Bridge | Lightweight demo of how readiness can feed future marketplace matching |

## AI Tooling Disclosure

| Tool | Provider | How Used | What It Does Not Decide |
|---|---|---|---|
| Claude claude-haiku-4-5 | Anthropic | Narrative explanation, key gap wording, next-step coaching | Scores, extracted skills, matched phrases, confidence, intervention priority |
| Claude Sonnet / Codex | OpenAI / Anthropic tooling during development | Coding assistance, refactoring, documentation support | Runtime decisions inside the product |
| Deterministic scoring engine | Custom | 6-dimension readiness, ATS, portfolio quality, skill taxonomy | N/A |

Design decision: every score can be verified without trusting AI output. AI explains the evidence trail; it does not predict a student's future.

## Local Setup

```bash
git clone https://github.com/lym081111/talentBank-lymV
cd talentBank-lymV
npm install
npm run dev
```

Open http://localhost:5173

Optional live AI explanation:

```bash
VITE_ANTHROPIC_API_KEY=your_key_here
```

Without a key, the app uses deterministic fallback insights.

## Build and Test

```bash
npm run build
npm run test
```

Tests cover readiness scoring, skill extraction, portfolio quality, ATS scoring, AI recommendations, market insights, next actions, and marketplace matching.

## Deployment

Deployed on Vercel.

Build command: `npm run build`  
Output directory: `dist`

## Module Selection Rationale

Primary module: **Universities Track - Module 03: Adaptive Readiness Profile**.

Why: many students do not know whether they are internship-ready until rejection arrives. PathLens surfaces evidence-backed readiness early enough for students and universities to act.

Career OS connection: the readiness profile becomes a structured input layer for future internship marketplace matching, while the Stage 1 prototype remains focused and frontend-first.
