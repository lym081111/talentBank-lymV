# PathLens — Judge Quickstart

**Live deployment:** https://talentbank-lymv-career-os.vercel.app
**Module:** Adaptive Readiness Profile — Universities Track (Module 03)
**Hackathon:** Talentbank Tech Hackathon 2026 · Build Asia's Career OS

---

## Fastest Path: 2-Minute Demo

1. Open **https://talentbank-lymv-career-os.vercel.app**
2. Click **"Try the 2-minute demo"** → opens the Talent View
3. **Daniel Lee is selected by default** (the student — Universities Module 03 subject)
4. Click **"Open full OS demo for Daniel Lee"** — loads his evidence instantly
5. Watch **streaming Claude AI insights** render live on the Readiness Dashboard
6. Navigate to **Paths Forward** - see application targets + top readiness blockers
7. From Talent View, also try the alumni personas (Priya/Kai/Aisha) to see the post-graduation trajectory
8. From landing, also try **Employer View** and **University View** directly (auto-seeds Priya's profile)

---

## What to Evaluate on Each Screen

### Landing Page
- "Turn student evidence into career readiness" — Universities Module 03 framing
- 3-view selector: Talent · Employer · University (same evidence, different question)
- Scope map showing the 4-step evidence → readiness pipeline
- "2-minute judge flow" breadcrumb strip

### Talent View (TalentPortal)
- **Student persona (primary):** Daniel Lee — Year 4 CS at Universiti Malaya. FYP + internship + hackathon. Typical readiness gap: no CI/CD, no production deployment. This is the Universities Module 03 subject.
- **Alumni trajectories (3 examples):** Priya Sharma (SWE, Grab), Kai Chen (Data Eng, ByteDance), Aisha Patel (PM, Lazada) — showing where students land post-graduation when they do close the gaps
- 5 sub-tabs per persona: Profile / Evidence / Skills / Trajectory / Applications
- Evidence cards highlight keywords, salary signals (MYR), and impact metrics
- "Open full OS demo" button loads the persona into the full pipeline (works for all 4)

### Evidence Page
- Pre-loaded evidence blocks with descriptions, technologies, outcomes, links
- Editable — click any field to update
- Quick-start templates for blank profiles
- Export buttons (PDF & JSON)

### Skill Extraction
- 14+ skills extracted from evidence text, each traced to source phrase
- Confidence breakdown (high / medium)
- Asia tech market demand badges (🔥 High / 📈 Growing / ⚠ Niche)

### Readiness Dashboard (main feature)
- **Career OS module breadcrumb** at the top: Module 03: Adaptive Readiness Profile → Career Path Navigator → Smart Talent Matching → University Cohort Insight
- **Streaming Claude AI insight** — narrative, key gap, next step render token-by-token
  - Pre-built insights for all 4 demo personas (instant, no API latency)
  - Falls back to rule-based engine if API key absent
  - "How this AI works" transparency panel
- **6 Dimension Cards** — shown immediately after the AI insight (top of dashboard). Each card shows: score, status, "Why this score" (evidence explanation), evidence source, matched signal phrases. Target 75+ per dimension.
- **Radar chart** across 6 weighted dimensions (shown after dimension cards)
- **3 Career OS module tabs**: Career Path Navigator · Living Portfolio · AI Career Coach — each generated from the candidate's evidence, target role, and readiness gaps
- **30-Day Action Sprint** preview (top 3 blockers with sprint focus labels)
- **Evolving Profile Timeline** — shows Daniel's readiness history: Year 2 (27/100) → Year 3 (44/100) → Year 4 (current live score). Auto-seeded on first demo load.
- ATS Compatibility Score and Portfolio Quality scores (below the fold — supporting detail)

### Paths Forward (Gaps)
- Top 3 readiness blockers with concrete 30–90 day actions
- **Application target guidance:** 3 mock role targets scored against the readiness profile, showing what the candidate can credibly claim and what blocks a stronger application
- Shared evidence flow: readiness profile -> application targets -> university intervention
- "Update Evidence & Re-check" closes the loop

### University View (CohortView)
- Cohort snapshot: readiness distribution, top gap, student count
- 3 recommended interventions with owner, measure, and gap context
- **Cohort data layer** — anonymous submit button wired to localStorage (shows the production API seam)
- Works from landing without requiring a full evidence flow

### Employer View (EmployerPortal)
- Shortlist decision: ✅ Shortlist / 🟡 Phone Screen / ❌ Not Yet — scored from readiness profile
- 4 evidence-backed interview probe questions
- Strongest evidence block highlighted
- Works from landing without requiring a full evidence flow

---

## Running Locally

```bash
git clone https://github.com/lym081111/talentBank-lymV.git
cd talentBank-lymV
npm install
npm run dev
# Open http://localhost:5173
```

**For live AI features:** create `.env` with `VITE_ANTHROPIC_API_KEY=<your-key>` — without it, the app falls back to smart rule-based insights automatically.

**To run tests:**
```bash
npm test
# 9 test files, 111 tests — application target matching, weighted scoring, skill extraction, market insights, ATS scoring, portfolio quality, edge cases
```

---

## Architecture in 3 Lines

- **Frontend only:** React 19 + TypeScript + Vite, deployed on Vercel
- **AI:** Claude claude-haiku-4-5 via `@anthropic-ai/sdk` (client-side for demo; `aiInsights.ts` documents production proxy pattern)
- **Persistence:** localStorage (evidence, cohort submissions, student profile) — `cohortApi.ts` shows the swap-to-API seam

---

## Key Differentiators vs Competitors

| Feature | PathLens | Typical Competitor |
|---|---|---|
| Real Claude AI streaming | ✅ (+ rule-based fallback) | ❌ or generic |
| Transparent skill extraction | ✅ (every skill traced to evidence) | ❌ black box |
| 3 distinct audience views | ✅ Talent · Employer · University | Student only |
| Application target guidance | Yes (mock application targets) | No |
| Cohort API seam | ✅ (localStorage → real API swap) | ❌ |
| Works offline / no account | ✅ | Usually requires sign-up |
| 0 TypeScript errors | ✅ | — |

---

## Scoring Rubric Alignment

| Criterion | Weight | PathLens Implementation |
|---|---|---|
| Product & UX | 30% | Dark palette, animations, radar chart, 3 audience views, application target cards, employer brief |
| System Design | 25% | 6-dimension scoring, transparent extraction, cohort API seam, application target matching engine, Career OS module connections |
| Completeness | 20% | All views functional, AI insight, export, cohort submit, application targets, trajectory simulator |
| AI Craft | 15% | Streaming Claude AI, pre-built insights for all 4 personas, transparency panel, rule-based fallback |
| Code Quality | 10% | TypeScript 0 errors, 9 test files (111 tests), React.lazy code splitting, modular CSS Modules, clean hooks |

---

*PathLens — Navigate your career. Not predict it.*
