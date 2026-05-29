# Deploy PathLens

**Implementation folder:** `C:\Users\User\Downloads\PathLens-main\PathLens-career-os-implementation`  
**Current live demo:** https://talentbank-lymv-career-os.vercel.app

This copy contains the Career OS implementation update: sharper Adaptive Readiness Profile positioning, a Module 04 Career Marketplace preview, refreshed docs, and marketplace matching tests.

## 1. Verify Locally

```bash
npm.cmd test
npm.cmd run build
```

If the sandbox blocks Vite or Vitest with `spawn EPERM`, run the same commands in a normal terminal from this folder.

## 2. Push This Copy to GitHub

```bash
git init
git branch -M main
git add .
git commit -m "Add Career OS marketplace bridge"
git remote add origin https://github.com/YOUR_USERNAME/PathLens.git
git push -u origin main
```

If you already have a repository, copy these files into that repo or set the correct remote before pushing.

## 3. Deploy to Vercel

1. Open https://vercel.com/new.
2. Import the GitHub repository.
3. Keep the detected Vite settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy.
5. If the URL changes, update:
   - `README.md`
   - `PROPOSAL.md`
   - `JUDGE_QUICKSTART.md`
   - `SUBMISSION_GUIDE.md`
   - `SUBMISSION_READINESS_CHECKLIST.md`

## 4. Judge Smoke Test

Open the live URL and complete:

1. Landing.
2. See a Live Demo.
3. Choose a persona.
4. Evidence review.
5. Skill extraction.
6. Readiness dashboard.
7. Paths Forward.
8. Career Marketplace bridge.
9. University Cohort View.

Also check mobile at 375px width.

## Submission Snippet

```text
Live Demo: https://talentbank-lymv-career-os.vercel.app

How to evaluate:
1. Open the URL.
2. Click "See a Live Demo".
3. Choose any student persona.
4. Review evidence, extracted skills, readiness score, gaps, marketplace preview, and university cohort view.

Positioning:
PathLens is Module 03 of Asia's Career OS: an Adaptive Readiness Profile that turns student evidence into transparent readiness, gap, and marketplace-fit signals.
```
