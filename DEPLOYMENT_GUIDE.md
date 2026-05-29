# PathLens - One-Click Vercel Deployment

## Deploy to Vercel in 2 Minutes ⚡

### Option 1: Instant Deploy (Recommended)
Click the button below to deploy PathLens to Vercel with zero configuration:

**[Deploy to Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourrepo%2FPathLens&project-name=pathlens&repo-name=pathlens)**

### Option 2: Manual Vercel Deployment

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd TechHackathon
   vercel
   ```

3. **Follow prompts:**
   - Link existing project or create new
   - Accept defaults for all settings
   - Deploy completes in ~60 seconds

### Option 3: GitHub + Vercel Integration (Most Reliable)

1. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/yourusername/pathlens.git
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Select the `TechHackathon` repository
   - Click "Deploy"
   - Live in 2 minutes ✓

## What Judges Will See

After deployment:
- **Live URL:** `https://pathlens-[randomstring].vercel.app`
- **Demo Flow:** ~2 minutes to see full assessment
- **No Setup Required:** Just open the URL in browser
- **Mobile Ready:** Works on all devices

## Features Available to Judges

✅ Landing page with value prop
✅ Demo mode (Daniel Lee profile, 5 evidence items)
✅ Skill extraction (14 unique skills extracted)
✅ Readiness assessment (67/100 overall score)
✅ 6-dimension breakdown with explanations
✅ Portfolio quality feedback per project
✅ Production-readiness checklist (24 items)
✅ Mock interview practice (3 scenarios)
✅ Progress tracking visualization
✅ ATS resume compatibility scoring
✅ AI job recommendations
✅ Cohort comparison (peer benchmarking)
✅ Mobile responsive design

## Post-Deployment

### Update the Hackathon Submission
- Submission URL: `https://pathlens-[yourdeployment].vercel.app`
- No further setup needed - app is fully functional

### Monitor Deployment
```bash
vercel logs --follow
```

### Roll Back if Needed
```bash
vercel rollback
```

## Troubleshooting

**Build Fails:** Ensure `npm install` completes locally first
**Blank Page:** Check browser console (F12) for JS errors
**Slow Load:** First load may take 10-15 seconds (Vite build cache warming)

## Next Steps

1. Deploy using one of the 3 options above
2. Test the live URL on mobile and desktop
3. Share the live URL with judges
4. Monitor for any issues during the hackathon

---

**Time to Live:** ~2 minutes
**Cost:** Free (Vercel free tier covers this project)
**Downtime Risk:** None (Vercel infrastructure handles 99.9% uptime)
