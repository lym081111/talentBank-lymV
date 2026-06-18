# Submission Notes

## Positioning

PathLens is **Career OS + Challenge Module**. The core product is an **Adaptive Readiness Profile** for the Universities track, wrapped inside a clickable Career OS prototype.

It is not a prediction engine. PathLens makes readiness visible from student evidence.

## Starter Kit Alignment

- **Career OS framing:** evidence-based profile, matching, candidate dashboard, employer brief, and application guidance.
- **Primary audience:** candidates and students.
- **Challenge module:** Universities Module 03, Adaptive Readiness Profile.
- **Related module coverage:** Career Path Navigator and Living Portfolio appear as dynamic Talent View pages powered by the same evidence.
- **Compulsory jobsite coverage:** local sign in/register, profile/resume builder, searchable job listings, job matching, mock applications, candidate dashboard, and employer dashboard.
- **Student value:** students understand what their evidence proves, what gaps remain, and what to build next.
- **University value:** universities see cohort-level gaps early enough to intervene.
- **Employer value:** employers get a lightweight role-specific shortlist brief and interview probes, not a full ATS.
- **AI craft:** transparent evidence extraction + AI-assisted explanation.
- **Completeness:** clickable prototype with local login/logout, job search, sample profile reset, and blank-profile path.
- **System integration:** the same readiness profile powers Talent View, Employer View, and University View without adding backend scope now.

## Stage 1 Scope Boundaries

PathLens does not include:

- backend
- production authentication or persistent accounts
- real university data integration
- employer job posting admin, applicant tracking, messaging, payment, or marketplace workflows
- real production APIs

All data in the prototype is local, simulated, or entered by the user.

## Suggested Intent Form Summary

PathLens is a Career OS prototype with an Adaptive Readiness Profile challenge module. Users can sign in locally, search mock job listings, filter roles by keyword and market, build an evidence-based profile, save mock applications, and inspect a candidate dashboard. Students add projects, internships, certificates, hackathons, FYPs, and resume items; PathLens converts them into an evidence profile, extracts skills with matched source phrases, scores six readiness dimensions, explains each score, and recommends next actions. The Talent View acts as the candidate dashboard and application workspace. It includes profile/resume building, proof passport, transparent skill extraction, readiness audit, gap sprint, career path guidance, job matching, and application targets. The Employer View is deliberately lightweight: it uses the same evidence to answer whether a candidate should be shortlisted for a selected role and what to ask during interview. The University View uses mock cohort data to recommend targeted interventions before internship application season. Stage 1 stays frontend-first and does not add backend identity, messaging, payments, or a full marketplace.
