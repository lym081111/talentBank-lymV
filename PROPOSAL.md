# PathLens: Adaptive Readiness Profile for Asia's Career OS

**Talentbank Tech Hackathon 2026**  
**Track:** Universities Track  
**Career OS module focus:** Module 03 - Adaptive Readiness Profile
**Prototype:** https://talentbank-lymv-career-os.vercel.app

## Problem

University students often build useful evidence before they know how to explain it: projects, internships, hackathons, certificates, final-year projects, and informal technical work. The problem is not only that students lack skills. It is that students, universities, and employers cannot clearly see which skills have already been demonstrated, which readiness gaps still matter, and what action would improve a student's career position next.

Career support also tends to arrive late. By the time students apply for internships, the gaps are already visible to employers but not always visible to the student or university. A student may have strong technical skills but weak production evidence. Another may have good data work but no public portfolio. A university may know placement outcomes after the fact, but not know which cohort gaps to fix early enough.

PathLens addresses that visibility gap.

## Solution

PathLens is an evidence-based readiness navigator. It turns a student's actual work into a structured profile:

1. Evidence: projects, internships, certificates, hackathons, and FYPs.
2. Extracted skills: source-traced skills matched from the evidence.
3. Readiness dimensions: six weighted dimensions that describe internship readiness.
4. Gaps and next actions: concrete steps the student can take in the next 30-90 days.
5. Application next steps: role targets, evidence story, and improvement blockers.

The key product principle is: **navigation, not prediction**. PathLens does not claim to know a student's future. It shows the current landscape, the routes open now, and the evidence needed to unlock stronger routes.

## Career OS Fit

PathLens is strongest as **Module 03: Adaptive Readiness Profile**. It is the profile layer that makes student readiness visible and portable across the rest of the Career OS.

For students, PathLens answers:

- What have I actually demonstrated?
- Which internship paths am I closest to?
- What is blocking stronger matches?
- What should I build next?

For universities, PathLens answers:

- Which readiness dimensions are weak across a cohort?
- What interventions should we run before internship season?
- Did workshops or curriculum changes improve readiness?
- Which student groups need early support?

For employers, PathLens provides a lightweight hiring brief generated from the same evidence:

- Extracted skills with evidence source.
- Readiness dimensions and score thresholds.
- Top blockers to probe in interviews.
- Role fit explanations instead of self-rated buzzwords.

This keeps the prototype focused: one evidence profile, three readouts. The Talent View is the deep workspace; Employer View is a hiring brief; University View is a mock cohort intervention board.

## What Is Implemented

The prototype is a frontend-first React and TypeScript app with a complete judge flow:

- Landing page with three demo personas.
- Profile and evidence entry with reusable templates.
- Transparent skill extraction from evidence.
- Six-dimension readiness dashboard.
- Claude-powered narrative insight, with deterministic fallback.
- ATS score and portfolio quality analysis.
- Gap page with quick-win recommendation and trajectory thinking.
- Application target page using simulated role-readiness targets.
- Employer brief that answers whether to shortlist the candidate and what to ask in interview.
- University cohort view using mock cohort data and recommended interventions.
- Export and sharing utilities.

Scoring, skill extraction, ATS analysis, and recommended actions are deterministic. Claude is used only for narrative coaching: career story, key gap, and next step. This is intentional because readiness scoring in education should be explainable.

## Why It Is Different

Many career tools start with resumes or job boards. PathLens starts earlier: the student's evidence. This makes it useful before the student applies, when action is still possible.

The university angle is also central. A single student profile is helpful, but cohort patterns are more powerful. If many students are weak in production practices, that is not only an individual problem. It is a curriculum and intervention signal.

The employer and university readouts make the Career OS connection concrete without turning the prototype into a job board or applicant tracking system. The same evidence powers student coaching, shortlist questions, and cohort interventions.

## Technical Approach

PathLens is built with React, TypeScript, Vite, CSS Modules, and localStorage. It is frontend-first for the hackathon prototype, with clear seams for a future backend:

- Evidence can move from localStorage to an API.
- Cohort submissions can move from local mock data to database-backed aggregation.
- Learning Wallet snapshots can store verified evidence over time.

The implementation includes unit tests for scoring, extraction, recommendations, market insights, edge cases, ATS scoring, and portfolio quality.

## Next Roadmap

For Stage 1, PathLens should focus on a reliable live prototype and clear submission narrative. For final submission, the strongest improvements are:

- Add a backend or mocked API boundary for evidence profiles and cohort aggregation.
- Improve the employer brief with stronger interview-question generation.
- Add historical snapshots so students can compare readiness over time.
- Improve evidence verification for certificates, GitHub links, and deployed projects.
- Record a short judge walkthrough that demonstrates the full 2-minute flow.

PathLens proves a practical starting point for Asia's Career OS: make readiness visible, make gaps actionable, and make evidence useful to students, employers, and universities without expanding Stage 1 into a separate hiring system.
