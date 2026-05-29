# PathLens Redesign Implementation Roadmap

## Phase 1: Data Layer - Realistic & Meaningful
**Focus:** Replace generic data with real Asia tech personas and market intelligence

### 1.1 Create Realistic Personas
Replace generic demo personas with real career trajectories:

**Persona 1: Priya Sharma**
- Title: Senior Software Engineer at Grab
- Location: Singapore
- Experience: 5 years
- Career Path: Internship (2021) → SWE II (2022) → Senior SWE (2024)
- Salary Progression:
  - Year 1 (Intern): SGD 3,500/month
  - Year 2 (SWE II): SGD 8,000/month
  - Year 5 (Senior): SGD 15,000/month + equity
- Key Skills: System Design, Distributed Systems, Python, Go, AWS
- Latest Achievement: Led 2 backend engineers, improved API latency by 40%

**Persona 2: Kai Chen**
- Title: Data Engineer at ByteDance
- Location: Singapore (reports to China team)
- Experience: 3 years
- Career Path: Analyst (2022) → Data Engineer (2023) → Senior Data Engineer (2024)
- Salary Progression:
  - Year 1: SGD 6,000/month
  - Year 3: SGD 12,000/month + RSU
- Key Skills: SQL, Python, Spark, ML Ops, Data Pipeline Architecture
- Latest Achievement: Built real-time data pipeline for 100M+ events/day

**Persona 3: Aisha Patel**
- Title: Product Manager at Lazada
- Location: India (base) → Singapore expansion
- Experience: 4 years
- Career Path: Associate PM (2020) → PM (2022) → Senior PM (2024)
- Salary Progression (India):
  - Year 1: INR 18L/year
  - Year 4: INR 45L/year
- Key Skills: Product Strategy, Market Analysis, A/B Testing, Roadmap Planning
- Latest Achievement: Launched new category generating 25% revenue uplift

### 1.2 Real Market Data for Asia Tech
**High-Demand Skills & Salary Impact:**
- System Design: +20-30% salary premium
- Cloud Architecture (AWS/GCP/Azure): +15-25%
- ML/AI (TensorFlow, PyTorch): +25-40%
- Leadership (managing people): +30-50%
- Full-stack (frontend + backend): +10-20%

**Role Demand Trends (Real Data):**
- Software Engineer: HIGH (5-8% YoY growth)
- Data Engineer: VERY HIGH (12-15% YoY growth)
- Product Manager: MEDIUM (3-5% YoY growth, competitive)
- DevOps/Cloud: HIGH (8-12% YoY growth)

**Regional Salary Ranges (2026 estimates):**
```
Software Engineer (3+ years):
- Singapore: SGD 120k-180k/year
- India: INR 25L-40L/year
- Malaysia: MYR 120k-180k/year
- Philippines: PHP 1.2M-1.8M/year

Senior/Staff Engineer:
- Singapore: SGD 200k-350k/year + equity
- India: INR 40L-80L/year
- Malaysia: MYR 250k-400k/year

Data Engineer:
- Singapore: SGD 140k-200k/year
- India: INR 30L-50L/year (high demand premium)

Product Manager:
- Singapore: SGD 180k-280k/year
- India: INR 30L-60L/year
```

---

## Phase 2: Design Overhaul - Professional & Consistent

### 2.1 Design System
**Color Palette (Professional):**
- Primary: Deep Blue (#1E40AF) - trust, professional
- Accent: Vibrant Green (#10B981) - growth, success
- Neutral: Clean Grays (#F3F4F6, #6B7280, #1F2937)
- Success: Green (#10B981)
- Warning: Amber (#F59E0B)
- Danger: Red (#EF4444)

**Typography:**
- H1: 32px, 700 weight, Dark Gray
- H2: 24px, 700 weight, Dark Gray
- H3: 18px, 600 weight, Dark Gray
- Body: 14px, 400 weight, Text Gray
- Small: 12px, 400 weight, Muted Gray

**Spacing:**
- Consistent 8px base unit
- Cards: 24px padding
- Sections: 32px gap
- Buttons: 12px padding

### 2.2 Landing Page Redesign
**Current Issues:**
- Generic value props
- No real data/credibility
- Unclear positioning

**New Design:**
```
Header:
  - Logo + "PathLens Career Readiness"
  - Tagline: "See Your Realistic Career Future Based on 10,000+ Asia Tech Profiles"

Hero Section:
  - Large number: "10,000+ verified career profiles analyzed"
  - Subheading: "See salary progressions, skill premiums, and realistic paths"

Social Proof:
  - Company logos: Grab, ByteDance, Lazada, Shopee, etc.
  - Quick stats: "Avg salary growth: 18% YoY" | "Avg skill-up time: 2.5 years"

CTA Section:
  - Primary: "See Your Market Position"
  - Secondary: "Browse Real Careers"

Value Props (with real data):
  1. "Evidence-Based Progression"
     - See actual salary progressions over time
     - Real timelines (not generic "1-2 years")
  
  2. "Market Intelligence"
     - Skills worth SGD 20k-30k salary premium
     - Demand trends in your region
  
  3. "Realistic Guidance"
     - Not predictions, but navigation based on similar profiles
     - Transparent about luck, timing, market factors

Success Stories:
  - "Priya: Intern → Senior Engineer in 4 years" (with data)
  - "Kai: Analyst → Data Eng in 2 years" (with salary numbers)
```

### 2.3 ReadinessDashboard Redesign
**Current Layout Issues:**
- Too many sections
- Unclear hierarchy
- Information overload

**New Structure:**
1. **Your Career Position** (Top)
   - Big number: Your score (X/100)
   - Subtitle: What this means for your market positioning
   - Similar profiles nearby (Priya at 78, Kai at 82, etc.)

2. **Market Comparison** (Below)
   - Your score vs. median in your region/role
   - Where you stand (25th / 50th / 75th percentile)

3. **Your Strengths** (Visual)
   - Radar chart (6 dimensions)
   - Clear color coding: Green (strong), Yellow (developing), Red (gap)

4. **Portfolio Quality** (Clear Scoring)
   - One number: Your portfolio quality score
   - Breakdown by project (documentation, complexity, impact)
   - Specific improvements for each project

5. **Top Skills** (With Value)
   - Your detected skills
   - Salary impact of each skill
   - Market demand level (high/medium/low)

6. **Next Steps** (Clear Actions)
   - "Skill gaps costing you ~SGD 25k/year"
   - "Top 3 highest-ROI skills to learn"
   - Timeline and resources

### 2.4 Portfolio Quality Card Redesign
**Current Issues:**
- Duplicate/confusing scores
- Unclear what's being measured
- Generic feedback

**New Design:**
```
Portfolio Card:
┌─────────────────────────────────────┐
│ Project: "E-commerce Platform"      │ Score: 78/100 ⭐⭐⭐⭐
├─────────────────────────────────────┤
│ Dimensions:                          │
│ • Documentation: 8/10 ✓ (Good)       │
│ • Complexity: 7/10 ✓ (Solid)        │
│ • Impact: 8/10 ✓ (Real Users)       │
│ • Deployment: 6/10 ⚠ (Basic)        │
│                                     │
│ What's Strong:                      │
│ ✓ Clean README with setup guide     │
│ ✓ Used modern tech (React, Node)    │
│ ✓ Shipped to 500+ users             │
│                                     │
│ To Improve (+10 points):            │
│ • Add architecture diagrams         │
│ • Include performance metrics       │
│ • Deploy to production domain       │
└─────────────────────────────────────┘
```

### 2.5 Visualization Improvements
**Better Readiness Radar:**
- Clear color zones (green/yellow/red)
- Compare to reference profiles
- Show salary impact of each dimension

**Salary Progression Chart:**
- X-axis: Years of experience
- Y-axis: Salary (SGD/INR)
- Show your trajectory vs. median vs. top performers
- Highlight skill inflection points

**Skill Demand Heat Map:**
- Skills by demand level
- Color intensity = demand strength
- Size = salary impact

---

## Phase 3: Content & Presentation - Meaningful & Clear

### 3.1 Scoring Explanations
**Portfolio Quality Score (Current: Confusing)**
→ **New (Clear):**
```
Your portfolio is strong for a 2nd-year engineer (78/100).

You're above median for:
✓ Project complexity (you use modern tech)
✓ Documentation (you explain your work)
✓ Real users (you shipped something people use)

Your main gap:
⚠ Deployment maturity (basic hosting vs. production practices)
  Impact: Affects ~10% of salary offers

To reach 85+:
• Add CI/CD pipeline (GitHub Actions)
• Document architecture decisions
• Add performance metrics

Timeline: 2-3 weeks, can add 8-10 points
```

### 3.2 Dimension Explanations (Current: 6 circles, confusing)
→ **New (Clear):**
```
6 Readiness Dimensions (What Hiring Managers Check):

1. Technical Skills (20%)
   Your score: 72/100
   What this means: Good fundamentals, need specialized depth
   Gap: System design concepts (worth +25% salary at senior level)

2. Portfolio Evidence (20%)
   Your score: 78/100
   What this means: Projects show real ability
   Gap: Missing production deployment experience

3. Work Readiness (20%)
   Your score: 68/100
   What this means: You can work in a team, learning collaborative skills
   Gap: Limited team project experience

4. Communication (15%)
   Your score: 75/100
   What this means: Can explain your work clearly
   Gap: Missing technical documentation examples

5. Production Practices (15%)
   Your score: 62/100
   What this means: You understand deployment and monitoring
   Gap: No CI/CD or testing experience yet

6. Role Fit (10%)
   Your score: 80/100
   What this means: Well-aligned with your target (SWE)
   Gap: Missing systems-level thinking
```

### 3.3 Gap Analysis (Actionable)
**Current: Generic recommendations**
→ **New: Specific, Prioritized**
```
Your Top 3 Highest-Impact Improvements:

#1: System Design Skills (Impact: +28% salary potential)
   Why: Every senior role requires this
   Timeline: 6-8 weeks
   Resources:
   • "System Design Interview Course" (2 weeks, 10 hours)
   • Build: Distributed cache system (3 weeks)
   • Interview prep: 2 weeks
   Cost: ~USD 50 for course
   Expected salary uplift: SGD 30k+ (from 120k to 150k range)

#2: Production Deployment (Impact: +15% salary potential)
   Why: Separates mid from senior engineers
   Timeline: 3-4 weeks
   Resources:
   • Docker + Kubernetes basics (1 week)
   • Deploy your best project to production (2 weeks)
   • Add monitoring (1 week)
   Cost: Free (use AWS free tier)
   Expected salary uplift: SGD 15k+

#3: Test Automation (Impact: +12% salary potential)
   Why: Shows professionalism to employers
   Timeline: 2-3 weeks
   Resources:
   • Test writing workshop (3 hours)
   • Add tests to existing project (2 weeks)
   Cost: Free
   Expected salary uplift: SGD 10k+
```

### 3.4 Success Stories (Real Data)
Replace generic "Success" with real progressions:

```
Case Study: Priya Sharma (Senior Engineer at Grab)

Year 1 (2021): Internship
├─ Readiness Score: 45/100
├─ Portfolio: 1 college project
├─ Skills: Basic Python, Web basics
└─ Salary: SGD 3,500/month

Year 2 (2022): SWE II
├─ Readiness Score: 68/100
├─ Portfolio: 2 intern projects + 1 shipped feature
├─ Skills: Python, JavaScript, SQL, Docker
├─ Gap Improvements: Added system design, learned testing
└─ Salary: SGD 8,000/month (+128%)

Year 5 (2024): Senior Engineer
├─ Readiness Score: 88/100
├─ Portfolio: Led 10+ major systems
├─ Skills: System Design, Leadership, Distributed Systems, Ops
├─ Key Inflection Point: Year 3 → System Design skills (added +20% salary)
└─ Salary: SGD 15,000/month + equity (+300% from year 1)

Timeline: 4 years
Average skill acquisition: 1 major skill per 6-9 months
Salary growth: ~18% YoY
Key success factor: Consistent upskilling in high-impact areas
```

---

## Phase 4: Implementation Order

**Week 1: Data & Content**
- [ ] Create 3+ realistic personas with real data
- [ ] Compile real market salary data by region/role
- [ ] Document skill salary premiums
- [ ] Write clear scoring explanations

**Week 2: Landing Page Design**
- [ ] Redesign landing page with new copy
- [ ] Add company logos (social proof)
- [ ] Add real stats and data
- [ ] Better CTA buttons

**Week 3: ReadinessDashboard Redesign**
- [ ] Simplify layout (remove clutter)
- [ ] Improve "Your Position" section
- [ ] Better visualizations
- [ ] Clear dimension explanations

**Week 4: Polish & Consistency**
- [ ] Consistent design language throughout
- [ ] Professional typography and spacing
- [ ] Better color usage
- [ ] Meaningful feedback copy

---

## Success Metrics

✅ **Design Consistency:**
- Same color palette throughout
- Consistent typography hierarchy
- Uniform spacing and alignment
- Professional appearance

✅ **Meaningful Presentation:**
- Users understand their score in 10 seconds
- Gap analysis is actionable (not generic)
- Data feels real and credible
- Clear progression paths visible

✅ **User Understanding:**
- No confusing duplicate cards
- Clear explanations of what each metric means
- Real examples and comparisons
- Transparent about methodology

---

## NOT doing yet (Phase 5)

Career OS Integration will come AFTER design is solid:
- Module 04 (Internship Marketplace) connection
- Module 05 (Learning Wallet) connection
- Unified Career OS navigation
- Cross-module data flow

We'll ensure design consistency first, THEN integrate seamlessly.
