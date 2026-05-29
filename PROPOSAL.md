# PathLens: Adaptive Readiness Profile for Asia's Career OS

**Talentbank Tech Hackathon 2026**  
**Track:** Universities Track  
**Career OS module focus:** Module 03 - Adaptive Readiness Profile, with a lightweight Module 04 Career Marketplace bridge  
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
5. Marketplace signals: a preview of how Module 04 could match the student to internships.

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

For employers and the Career Marketplace, PathLens provides structured candidate signals:

- Extracted skills with evidence source.
- Readiness dimensions and score thresholds.
- Top blockers to probe in interviews.
- Role fit explanations instead of self-rated buzzwords.

This keeps the prototype focused while still showing how the profile feeds Module 04 Career Marketplace and Module 05 Learning Wallet.

## What Is Implemented

The prototype is a frontend-first React and TypeScript app with a complete judge flow:

- Landing page with three demo personas.
- Profile and evidence entry with reusable templates.
- Transparent skill extraction from evidence.
- Six-dimension readiness dashboard.
- Claude-powered narrative insight, with deterministic fallback.
- ATS score and portfolio quality analysis.
- Gap page with quick-win recommendation and trajectory thinking.
- Career Marketplace preview using simulated internship roles.
- University cohort view with Student, University, and Employer perspectives.
- Export and sharing utilities.

Scoring, skill extraction, ATS analysis, and marketplace matching are deterministic. Claude is used only for narrative coaching: career story, key gap, and next step. This is intentional because readiness scoring in education should be explainable.

## Why It Is Different

Many career tools start with resumes or job boards. PathLens starts earlier: the student's evidence. This makes it useful before the student applies, when action is still possible.

The university angle is also central. A single student profile is helpful, but cohort patterns are more powerful. If many students are weak in production practices, that is not only an individual problem. It is a curriculum and intervention signal.

The marketplace bridge makes the Career OS connection concrete without turning the prototype into a full job board. Mock roles show how readiness profiles can power matching, blockers, and next-step guidance.

## Technical Approach

PathLens is built with React, TypeScript, Vite, CSS Modules, and localStorage. It is frontend-first for the hackathon prototype, with clear seams for a future backend:

- Evidence can move from localStorage to an API.
- Cohort submissions can move from local mock data to database-backed aggregation.
- Marketplace roles can move from static mock roles to Talentbank or employer feeds.
- Learning Wallet snapshots can store verified evidence over time.

The implementation includes unit tests for scoring, extraction, recommendations, market insights, edge cases, ATS scoring, portfolio quality, and marketplace matching.

## Next Roadmap

For Stage 1, PathLens should focus on a reliable live prototype and clear submission narrative. For final submission, the strongest improvements are:

- Add a real backend or mocked API boundary for cohort and marketplace data.
- Expand marketplace matching with more role types.
- Add historical snapshots so students can compare readiness over time.
- Improve evidence verification for certificates, GitHub links, and deployed projects.
- Record a short judge walkthrough that demonstrates the full 2-minute flow.

PathLens proves a practical starting point for Asia's Career OS: make readiness visible, make gaps actionable, and make career matching evidence-backed.
