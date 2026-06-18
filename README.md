# PathLens - Career OS Universities Module 03

**Navigate readiness. Do not predict careers.**

**Live Demo:** https://talentbank-lymv-career-os.vercel.app  
**Hackathon:** Talentbank Tech Hackathon 2026 - Build Asia's Career OS  
**Track:** Universities  
**Module:** 03 - Adaptive Readiness Profile

## What PathLens Does

PathLens turns student evidence - projects, internships, certificates, hackathons, final year projects, and resume items - into a transparent Adaptive Readiness Profile.

Not a prediction engine. PathLens makes readiness visible from student evidence.

The prototype helps students see what their evidence proves, helps employers read a lightweight evidence-backed hiring brief, and helps universities identify cohort gaps early.

## For Judges

**What this is:** an Adaptive Readiness Profile module inside a Career OS jobsite shell.

**Student value:** students see extracted skills, source evidence, matched phrases, confidence, readiness score, gaps, and next actions.

**University value:** universities see cohort-level readiness gaps and recommended interventions before internship season.

**Core product flow:** Login -> Career OS Home -> Job Search -> Profile Builder -> Extraction -> Readiness -> Applications -> Employer/University Readouts.

**AI craft:** transparent evidence extraction + AI-assisted explanation. Scoring, skill extraction, matched phrases, confidence, and university intervention priority are deterministic and auditable.

**Stage 1 scope:** frontend prototype only. It includes local mock login/logout, job search, profile building, matching, applications, candidate dashboard, employer brief, and university board. It does not include a backend, real identity/auth service, real job posting admin, messaging, payment, or real university integration.

## Starter Kit Alignment

PathLens is submitted as **Career OS + Challenge Module**. The compulsory Career OS layer is represented through a clickable frontend prototype:

| Starter Kit feature | PathLens implementation |
|---|---|
| Profile and resume builder | Students turn projects, internships, certificates, hackathons, and FYPs into an editable evidence profile |
| Job listings | Job Search shows mock Malaysia/Asia roles with salary bands, work mode, required skills, and evidence-backed fit |
| Keyword and job search | Search filters roles by title, company, skills, market, and work mode |
| Job matching | Roles compare readiness, skills, blockers, and evidence sources before recommending next action |
| Candidate dashboard | Talent View shows evidence, extracted skills, readiness dimensions, gaps, and application next steps |
| Employer dashboard | Employer View generates a lightweight hiring brief from the same evidence |
| Job applications | Candidates can save mock applications and generate evidence-backed application packs |
| Search and discovery | Employers switch hiring roles and see which candidate fits that role best |
| Sign up and register | Lightweight local prototype login/register gates the Career OS workspace |

The Challenge Module is **Adaptive Readiness Profile**. Career Path Navigator and Living Portfolio are represented inside the Talent workspace as evidence-backed paths, proof blocks, job matches, and application targets. The prototype intentionally avoids backend scope so Stage 1 stays focused on product clarity and explainable AI craft.

Supporting docs:

- `docs/DEMO_FLOW.md`
- `docs/ARCHITECTURE.md`
- `docs/SUBMISSION.md`

## Judge Quickstart

1. Open https://talentbank-lymv-career-os.vercel.app
2. Create a local prototype account or sign in.
3. From Career OS Home, open **Search jobs** to see listings, keyword search, role fit, salary bands, and saved mock applications.
4. Open **Build profile** to add evidence or use **Reset sample** to inspect a seeded student profile.
5. Continue through Profile -> Skills -> Dashboard -> Applications/Paths.
6. On the dashboard, inspect the 6 dimension cards. Each shows score, status, why this score, evidence source, and matched signals.
7. Open **Employer** to see a lightweight shortlist brief generated from the same evidence.
8. Open **University** to see cohort gaps and recommended interventions.

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
| Local Login Shell | Prototype sign in/register/logout so the Career OS feels like a real jobsite workspace |
| Job Search | Mock job listings with keyword filters, market filters, salary bands, and evidence-backed match status |
| Skill Extraction | Shows extracted skill, evidence source, matched phrase, and confidence |
| 6-Dimension Scoring | Technical, Portfolio, Work Readiness, Communication, Production, Role Fit |
| Readiness Dashboard | Radar chart plus auditable dimension cards |
| AI Career Explanation | Narrative insight, key gap, and next step based on entered evidence |
| Gap Action Plan | Prioritized next actions with timeline and expected impact |
| Employer View | Lightweight hiring brief that answers shortlist decision and interview questions |
| University Cohort View | Mock cohort gap board with recommended interventions |

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

Tests cover readiness scoring, skill extraction, portfolio quality, ATS scoring, AI recommendations, market insights, and next actions.

## Deployment

Deployed on Vercel.

Build command: `npm run build`  
Output directory: `dist`

## Module Selection Rationale

Primary module: **Universities Track - Module 03: Adaptive Readiness Profile**.

Why: many students do not know whether they are internship-ready until rejection arrives. PathLens surfaces evidence-backed readiness early enough for students and universities to act.

Career OS connection: the readiness profile becomes a structured evidence layer that can be read by the student workspace, employer hiring brief, and university intervention board while the Stage 1 prototype remains focused and frontend-first.
