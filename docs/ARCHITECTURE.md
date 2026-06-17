# Architecture

PathLens is a frontend-first Stage 1 prototype for Talentbank Career OS.

## Scope

Included:

- Adaptive Readiness Profile for students
- Evidence intake and editing
- Skill extraction from evidence text
- Deterministic 6-dimension readiness scoring
- AI-assisted narrative explanation
- Gap action plan
- University cohort dashboard with recommended interventions
- Lightweight employer hiring brief generated from the same evidence

Not included:

- Backend
- Authentication
- Real university integration
- Employer login, job posting, applicant tracking, candidate comparison, messaging, or marketplace workflows
- Production data ingestion

## Data Flow

```text
Student evidence
  -> skill extraction
  -> 6-dimension readiness scoring
  -> dashboard audit trail
  -> gap actions
  -> university cohort interventions
```

## Scoring Model

Scoring is deterministic and rule-based. The readiness score is a weighted sum across six dimensions:

- Technical Skills
- Portfolio Evidence
- Work Readiness
- Communication & Documentation
- Production Practices
- Role-Specific Fit

Each dimension card shows:

- score
- status
- why this score
- evidence source
- matched signals

## AI Craft

AI is used for explanation, not decision-making.

The product wording is: **transparent evidence extraction + AI-assisted explanation**.

AI does not decide:

- readiness score
- extracted skill
- matched phrase
- confidence
- university intervention priority

If the AI API is unavailable, deterministic fallback text is used.

## User-Facing Views

PathLens fits Career OS as the readiness input layer and a focused frontend prototype for the compulsory jobsite surfaces.

- Talent View: full interactive workspace for the student or candidate. It covers profile/resume building, proof passport, skill extraction, readiness dashboard, path guidance, and application targets.
- Employer View: lightweight hiring brief generated from the same evidence. It answers whether to shortlist a candidate for a selected role and what to ask in interview.
- University View: lightweight intervention board using mock cohort data. It answers which cohort gaps need action.

The prototype maps to the Starter Kit jobsite examples without becoming a backend product: profile builder, job matching, candidate dashboard, employer dashboard, applications, and discovery are all represented as evidence-backed UI flows.

This prototype intentionally avoids building a separate employer system or full marketplace in Stage 1.
