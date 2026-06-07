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
- Lightweight Career OS bridge to show how profiles can feed marketplace matching later

Not included:

- Backend
- Authentication
- Real university integration
- Real employer marketplace
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

## Integration Direction

PathLens fits Career OS as the readiness input layer. Module 04 or future marketplace work can consume the readiness profile, extracted skills, gaps, and evidence audit trail. This prototype intentionally avoids building a full marketplace in Stage 1.
