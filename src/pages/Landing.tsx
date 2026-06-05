import { useState, useRef, useEffect } from 'react';
import { StudentProfile } from '../types/evidence';
import { priyaSharmaProfile, kaiChenProfile, aishaPatelProfile } from '../data/mockStudent';

interface Props {
  onViewDemo: (profile: StudentProfile) => void;
  onBuildOwn: () => void;
}

type ActiveMode = 'talent' | 'employer';

// ── Personas ─────────────────────────────────────────────────────────────────
const DEMO_PERSONAS = [
  { profile: priyaSharmaProfile, emoji: '🚀', role: 'Senior SWE', company: 'Grab · KL', salary: 'MYR 45,000/mo' },
  { profile: kaiChenProfile,     emoji: '📊', role: 'Senior Data Eng', company: 'ByteDance · SG', salary: 'MYR 38,000/mo' },
  { profile: aishaPatelProfile,  emoji: '📈', role: 'Senior PM', company: 'Lazada · Malaysia', salary: 'MYR 28,000/mo' },
];

const MILESTONES = [
  { year: 'Year 1', role: 'SWE Intern',     salary: 'MYR 3,500–5,500/mo', skill: 'Python · REST APIs · Git' },
  { year: 'Year 2', role: 'Junior SWE',     salary: 'MYR 6,000–9,000/mo', skill: '+ CI/CD · API ownership' },
  { year: 'Year 4', role: 'Mid SWE',        salary: 'MYR 11,000–18,000/mo', skill: '+ Distributed systems' },
  { year: 'Year 7', role: 'Staff Engineer', salary: 'MYR 22,000+/mo', skill: '+ Cross-team influence' },
];

// ── Career Path data (Talent) ─────────────────────────────────────────────────
const PATHS = {
  corporate: {
    badge: '🏢 Specialisation & Scale',
    label: 'Large Company Path',
    tagline: 'Go deep. Move predictably. Own a domain.',
    route: 'Junior SWE → Senior SWE → Tech Lead → Staff',
    timeline: '5–8 years',
    why: "Production Practices gap (36/100) closes 2x faster inside a large org with structured on-call rotations, code review culture, and mentorship programmes.",
    evidence: '1,240 profiles on this path — 68% reached Senior SWE by year 5.',
    pros: [
      { label: 'Technical depth', desc: 'Domain expert in one stack — highly valued at MNCs and GLCs' },
      { label: 'Predictable growth', desc: 'Clear L3→L4→L5 levelling with transparent MYR salary bands' },
      { label: 'Team infrastructure', desc: 'Dedicated QA, DevOps, design — ship without wearing every hat' },
      { label: 'Brand on CV', desc: 'Grab / Shopee / DBS on your resume opens doors for 10+ years' },
    ],
    cons: [
      { label: 'Stack lock-in', desc: 'Go/Java dominant — Python/TypeScript skills may stagnate' },
      { label: 'Slow yr 1–3 pay', desc: 'Graduate bands compressed vs startup; equity minimal' },
      { label: 'Process overhead', desc: 'Sprints, approvals, meetings before shipping anything meaningful' },
    ],
    salaryRows: [
      { yr: 'Yr 1', sal: 'MYR 4,500–7,000/mo', note: 'Intern → Junior', w: '30%' },
      { yr: 'Yr 3', sal: 'MYR 9,000–13,000/mo', note: 'Mid SWE', w: '55%' },
      { yr: 'Yr 5', sal: 'MYR 12,000–16,000/mo', note: 'Senior SWE', w: '75%' },
      { yr: 'Yr 7', sal: 'MYR 18,000–25,000/mo', note: 'Tech Lead / Staff', w: '100%' },
    ],
  },
  startup: {
    badge: '🚀 Ownership & Breadth',
    label: 'Startup Path',
    tagline: 'Own everything. Move fast. Build equity.',
    route: 'Full-Stack → Founding Eng → CTO Track',
    timeline: '3–5 years (high variance)',
    why: "Communication score (80/100) is unusually high for this level. Startups reward cross-functional communication immediately — large orgs won't deploy it until year 5+.",
    evidence: '847 profiles on this path — 40% equity event within 5 years, 35% company failure rate.',
    pros: [
      { label: 'Full ownership', desc: 'Own the infra, product, roadmap — from day one' },
      { label: 'Equity upside', desc: 'CTO/Founding Eng title + equity accessible in 3–4 years' },
      { label: 'Skill breadth', desc: 'Ship across frontend, backend, data, infra — generalist-strong CV' },
      { label: 'Fast feedback', desc: 'User feedback in hours, not sprint cycles' },
    ],
    cons: [
      { label: 'No safety net', desc: 'No structured mentorship — learn by breaking production things' },
      { label: 'Resume risk', desc: 'Thin evidence if startup fails at year 2–3 with nothing shipped' },
      { label: 'High burn rate', desc: 'Erratic hours, no dedicated QA or DevOps support' },
    ],
    salaryRows: [
      { yr: 'Yr 1', sal: 'MYR 3,500–6,000/mo', note: 'Early employee', w: '25%' },
      { yr: 'Yr 2', sal: 'MYR 7,000–10,000/mo', note: 'Founding Eng', w: '45%' },
      { yr: 'Yr 4', sal: 'MYR 10,000–15,000/mo + equity', note: 'CTO Track', w: '70%' },
      { yr: 'Yr 5', sal: 'MYR 15,000–35,000+ exit', note: 'Equity event (40%)', w: '100%' },
    ],
  },
};

// ── Shared card wrapper ───────────────────────────────────────────────────────
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/5 border border-white/10 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-white/20 ${className}`}>
      {children}
    </div>
  );
}

function SectionLabel({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className={`text-xs font-black uppercase tracking-widest border px-3 py-1 rounded-full ${color}`}>
      {children}
    </span>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TALENT SECTIONS
// ══════════════════════════════════════════════════════════════════════════════
function TalentSections({ onViewDemo, onBuildOwn }: { onViewDemo: (p: StudentProfile) => void; onBuildOwn: () => void }) {
  const [activePath, setActivePath] = useState<'corporate' | 'startup'>('corporate');
  const [showPersonas, setShowPersonas] = useState(false);
  const path = PATHS[activePath];

  return (
    <>
      {/* ── T1: TRAJECTORY OVERVIEW ─────────────────────────────── */}
      <section className="py-20 px-6 bg-[#0d1117]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel color="text-emerald-400 border-emerald-400/30">For Candidates & Students</SectionLabel>
            <h2 className="text-4xl lg:text-5xl font-black text-white mt-5 mb-4 leading-tight">
              See your realistic MYR trajectory.
              <span className="block text-emerald-400">Before you commit to the wrong path.</span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto text-lg text-center">
              Explore honest salary progressions based on 10,000+ real Malaysian tech profiles — not LinkedIn posts.
            </p>
          </div>

          {/* MYR Trajectory Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Junior path */}
            <Card className="p-7">
              <div className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-3">Junior / Student Track</div>
              <div className="flex items-end gap-3 mb-4">
                <div>
                  <div className="text-white/40 text-xs mb-1">Starting</div>
                  <div className="text-2xl font-black text-white">MYR 4,500<span className="text-white/30 text-sm font-bold">/mo</span></div>
                </div>
                <div className="text-emerald-400 font-black text-2xl mb-1">──›</div>
                <div>
                  <div className="text-emerald-400 text-xs mb-1">Year 2 target</div>
                  <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">MYR 7,200<span className="text-emerald-400/50 text-sm font-bold">/mo</span></div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-emerald-400 font-black text-sm">+60%</div>
                  <div className="text-white/30 text-xs">growth</div>
                </div>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[60%] bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full" />
              </div>
              <p className="text-white/30 text-xs mt-3">Intern → Junior SWE · KL tech market · verified offer data</p>
            </Card>

            {/* Mid-senior path */}
            <Card className="p-7">
              <div className="text-xs font-black text-blue-400 uppercase tracking-widest mb-3">Mid–Senior Enterprise Track</div>
              <div className="flex items-end gap-3 mb-4">
                <div>
                  <div className="text-white/40 text-xs mb-1">Mid level</div>
                  <div className="text-2xl font-black text-white">MYR 8,500<span className="text-white/30 text-sm font-bold">/mo</span></div>
                </div>
                <div className="text-blue-400 font-black text-2xl mb-1">──›</div>
                <div>
                  <div className="text-blue-400 text-xs mb-1">Senior / Staff</div>
                  <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-fuchsia-400">MYR 15,000<span className="text-blue-400/50 text-sm font-bold">/mo</span></div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-blue-400 font-black text-sm">+76%</div>
                  <div className="text-white/30 text-xs">uplift</div>
                </div>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[76%] bg-gradient-to-r from-blue-500 to-fuchsia-400 rounded-full" />
              </div>
              <p className="text-white/30 text-xs mt-3">Mid SWE → Senior SWE · MNC/GLC track · Petaling Jaya / KL Sentral</p>
            </Card>
          </div>

          {/* Path stability callout */}
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1">
                <div className="text-xs font-black text-white/40 uppercase tracking-widest mb-2">Stability vs Agility</div>
                <p className="text-white/70 text-sm leading-relaxed">
                  Explore realistic Malaysian tech trajectories. Compare the stability of a{' '}
                  <strong className="text-blue-400">Large Tech Enterprise in KL</strong>{' '}
                  (high MYR base, low stack agility, clear levelling) versus a{' '}
                  <strong className="text-emerald-400">High-Growth Startup</strong>{' '}
                  (equity upside, broad ownership, higher market risk). Neither path is universally better — it depends on your risk tolerance and current skill gaps.
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <div className="text-center px-4 py-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <div className="text-blue-400 font-black text-lg">MYR 18k</div>
                  <div className="text-white/30 text-xs">Large Corp ceiling</div>
                </div>
                <div className="text-center px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <div className="text-emerald-400 font-black text-lg">MYR 35k+</div>
                  <div className="text-white/30 text-xs">Startup exit upside</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ── T2: TRADE-OFF NAVIGATOR ───────────────────────────────── */}
      <section className="py-20 px-6 bg-[#0a0f1e]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <SectionLabel color="text-fuchsia-400 border-fuchsia-400/30">Trade-off Navigator</SectionLabel>
            <h2 className="text-3xl lg:text-4xl font-black text-white mt-5 mb-3 leading-tight">
              Your next move isn't obvious.
              <span className="block text-fuchsia-400">Neither should our advice be.</span>
            </h2>
            <p className="text-white/40 max-w-lg mx-auto text-center">
              Every path has real trade-offs. We name them honestly — so you choose with eyes open.
            </p>
          </div>

          {/* Toggle */}
          <div className="flex justify-center gap-2 mb-8">
            {(['corporate', 'startup'] as const).map((p) => (
              <button key={p} onClick={() => setActivePath(p)}
                className={`px-6 py-3 rounded-xl text-sm font-black transition-all duration-300 ${
                  activePath === p
                    ? 'bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-black shadow-lg shadow-fuchsia-500/25 scale-105'
                    : 'border border-white/20 text-white/50 hover:border-white/40 hover:text-white hover:-translate-y-0.5'
                }`}>
                {p === 'corporate' ? '🏢 Large Company Path' : '🚀 Startup Path'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Path detail */}
            <Card className="p-7">
              <span className={`text-xs font-black px-3 py-1 rounded-full border mb-3 inline-block ${
                activePath === 'corporate'
                  ? 'bg-blue-400/10 text-blue-400 border-blue-400/30'
                  : 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30'
              }`}>{path.badge}</span>
              <div className="text-white font-black text-xl mb-1">{path.route}</div>
              <div className="text-white/30 text-sm mb-1">⏱ {path.timeline}</div>
              <div className="text-white/50 text-sm italic mb-5">"{path.tagline}"</div>

              <div className="bg-emerald-400/8 border border-emerald-400/20 rounded-xl p-4 mb-5">
                <p className="text-xs text-emerald-400 font-black uppercase mb-2">Why it fits your profile</p>
                <p className="text-sm text-white/80 leading-relaxed">{path.why}</p>
                <p className="text-xs text-white/30 mt-2 italic">— {path.evidence}</p>
              </div>

              <div className="mb-3">
                <p className="text-xs text-emerald-400 font-black uppercase tracking-wider mb-2">✓ Advantages</p>
                {path.pros.map((item) => (
                  <div key={item.label} className="flex gap-3 py-1.5 border-b border-white/5">
                    <span className="text-emerald-400 font-black text-sm flex-shrink-0">✓</span>
                    <div>
                      <span className="text-white/80 text-sm font-bold">{item.label}</span>
                      <span className="text-white/30 text-xs block">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs text-rose-400/80 font-black uppercase tracking-wider mb-2">✗ Trade-offs</p>
                {path.cons.map((item) => (
                  <div key={item.label} className="flex gap-3 py-1.5 border-b border-white/5">
                    <span className="text-rose-400 font-black text-sm flex-shrink-0">✗</span>
                    <div>
                      <span className="text-white/60 text-sm font-bold">{item.label}</span>
                      <span className="text-white/30 text-xs block">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Right: Salary bars */}
            <Card className="p-7 flex flex-col justify-between">
              <div>
                <p className="text-xs text-white/30 font-black uppercase tracking-wider mb-5">MYR Salary Progression · {activePath === 'corporate' ? 'Large Corp' : 'Startup'}</p>
                {path.salaryRows.map((row) => (
                  <div key={row.yr} className="mb-4">
                    <div className="flex justify-between text-xs text-white/50 mb-1">
                      <span className="font-bold">{row.yr} · <span className="text-white/30">{row.note}</span></span>
                      <span className="font-black text-white">{row.sal}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 rounded-full transition-all duration-700" style={{ width: row.w }} />
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowPersonas(true)}
                className="mt-5 w-full py-3 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 border border-fuchsia-400/20 hover:border-fuchsia-400/40 text-fuchsia-400 font-black text-sm rounded-xl transition-all duration-300 hover:-translate-y-0.5">
                See a real person who took this path →
              </button>
            </Card>
          </div>

          {/* Persona picker (if triggered) */}
          {showPersonas && (
            <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-black text-white/60 uppercase tracking-wider">Real Malaysian tech professionals:</p>
                <button onClick={() => setShowPersonas(false)} className="text-white/30 hover:text-white/60 text-xl">×</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {DEMO_PERSONAS.map(({ profile, emoji, role, company, salary }) => (
                  <button key={profile.id} onClick={() => onViewDemo(profile)}
                    className="bg-white/5 hover:bg-fuchsia-500/10 border border-white/10 hover:border-fuchsia-400/40 rounded-xl p-4 text-left transition-all duration-300 hover:-translate-y-1 group">
                    <div className="text-2xl mb-2">{emoji}</div>
                    <div className="text-white font-black text-sm group-hover:text-fuchsia-400 transition-colors">{profile.name}</div>
                    <div className="text-white/40 text-xs mt-1">{role} · {company}</div>
                    <div className="text-emerald-400 text-xs font-bold mt-2">{salary}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── T3: CAREER OS INFRASTRUCTURE ─────────────────────────── */}
      <section className="py-20 px-6 bg-[#080d18]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center mx-auto max-w-2xl mb-14">
            <SectionLabel color="text-purple-400 border-purple-400/30">For Candidates · OS Infrastructure</SectionLabel>
            <h2 className="text-4xl font-black text-white mt-5 mb-4 leading-tight">
              Not a job board. Not an ATS.
              <span className="block text-white/30">The connective tissue between them.</span>
            </h2>
            <p className="text-white/40 text-lg leading-relaxed text-center">
              Career OS is the layer existing tools were never designed to be: continuous, bilateral, intelligent across a 40-year horizon.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { icon: '⚡', sub: 'Living Portfolio Sync', title: 'Auto-Updating Career Evidence', body: 'GitHub commits, deployments, and certifications auto-logged. No manual updating.', badges: ['GitHub', 'Vercel', 'Coursera', 'AWS Certs'] },
              { icon: '📅', sub: 'Calendar Intelligence', title: 'Career Moments, Not Job Alerts', body: 'Knows when your skills are becoming market-rare or when a pivot costs 3 years vs. 6 months.', badges: ['Google Calendar', 'Outlook', 'Workday'] },
              { icon: '🔒', sub: 'Privacy Architecture', title: 'Stealth Mode — Looking While Employed', body: '84% of professionals explore opportunities silently. Your current employer is auto-blocked. Always.', badges: ['Zero data leaks', 'Per-company toggle', 'Instant delete'] },
              { icon: '🎓', sub: 'University Outcome Loop', title: 'Real Graduate ROI — Not Survey Data', body: 'Cohort outcomes at 1, 3, and 10 years post-graduation. Actual trajectories — not LinkedIn titles.', badges: ['100+ institutions · Malaysia'] },
            ].map((card) => (
              <Card key={card.title} className="p-7 hover:border-purple-400/30">
                <div className="text-3xl mb-3">{card.icon}</div>
                <div className="text-xs text-purple-400 font-black uppercase tracking-widest mb-2">{card.sub}</div>
                <h3 className="text-white font-black text-lg mb-2">{card.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-4">{card.body}</p>
                <div className="flex flex-wrap gap-2">
                  {card.badges.map((b) => (
                    <span key={b} className="text-xs px-2 py-1 bg-white/10 text-white/40 rounded-md font-semibold">{b}</span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── T4: TALENT CTA ────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#0a0f1e]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="border border-white/10 rounded-2xl p-10 bg-white/[0.02]">
            <div className="text-xs text-white/30 font-black uppercase tracking-widest mb-4">
              🏆 Talentbank Tech Hackathon 2026 · Universities Track
            </div>
            <h3 className="text-3xl font-black text-white mb-4">See it on a real profile</h3>
            <p className="text-white/40 mb-8 text-center">Three real Malaysian professionals. Real MYR journeys. Real trade-offs.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => setShowPersonas(true)}
                className="px-10 py-4 bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-black font-black text-sm rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-fuchsia-500/25 active:scale-95">
                🎓 View Live Demo →
              </button>
              <button onClick={onBuildOwn}
                className="px-10 py-4 border border-white/20 hover:border-fuchsia-400/40 text-white font-bold text-sm rounded-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/5">
                Build My Own Profile →
              </button>
            </div>
            <p className="text-xs text-white/20 mt-5">No account needed · Free · Powered by Claude AI</p>
          </div>
        </div>
      </section>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// EMPLOYER SECTIONS
// ══════════════════════════════════════════════════════════════════════════════
function EmployerSections({ onBuildOwn }: { onBuildOwn: () => void }) {
  const [scoutQuery, setScoutQuery] = useState('');

  return (
    <>
      {/* ── E1: PAIN POINT + HERO ─────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#060b14]">
        <div className="max-w-6xl mx-auto">

          {/* Pain point banner */}
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-5 mb-14 max-w-3xl mx-auto text-center">
            <p className="text-rose-400 font-black text-xs uppercase tracking-widest mb-2">The Real Cost of Bad Hiring · Malaysia 2025</p>
            <p className="text-white text-xl font-bold leading-relaxed">
              "Your ATS was built to filter.
              <span className="text-white/40"> Filtering optimises for CVs that game the ATS. This is how you end up interviewing candidates who can't actually code."</span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <div>
              <SectionLabel color="text-blue-400 border-blue-400/30">For Employers & HR Teams</SectionLabel>
              <h2 className="text-4xl lg:text-5xl font-black text-white mt-5 mb-5 leading-tight">
                Stop filtering noise.
                <span className="block text-blue-400">Start spotting signal.</span>
              </h2>
              <p className="text-white/40 text-lg leading-relaxed mb-8">
                Spot the top 15% of Malaysian tech talents passively — before they enter chaotic job boards. Stop paying for bloated database access.
              </p>

              {/* ROI Cards */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { label: 'Cost-per-hire', before: 'MYR 12,000', after: 'MYR 3,500', delta: '−71%', color: 'rose' },
                  { label: 'Time-to-hire',  before: '45 days',    after: '11 days',    delta: '−76%', color: 'emerald' },
                  { label: 'Signal ratio',  before: '1 in 847',   after: '1 in 12',    delta: '+12×',  color: 'blue' },
                  { label: 'AI spam rate',  before: '62% of CVs', after: '0%',         delta: '−100%', color: 'fuchsia' },
                ].map((r) => (
                  <div key={r.label} className={`bg-white/5 border border-white/10 rounded-xl p-4 transition-all duration-300 hover:-translate-y-1 hover:border-${r.color}-400/30`}>
                    <div className="text-white/30 text-xs font-bold mb-2">{r.label}</div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white/30 text-xs line-through">{r.before}</span>
                      <span className="text-white/20">→</span>
                      <span className={`text-${r.color}-400 font-black text-sm`}>{r.after}</span>
                    </div>
                    <div className={`text-${r.color}-400 font-black text-lg`}>{r.delta}</div>
                  </div>
                ))}
              </div>

              <button onClick={onBuildOwn}
                className="px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white font-black text-sm rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/25">
                Start Silent Scouting →
              </button>
            </div>

            {/* Silent Scout demo */}
            <Card className="p-6 hover:border-blue-400/30">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-blue-400 font-black uppercase tracking-widest">Silent Scouting · Live View</span>
                <span className="text-xs bg-emerald-400/20 text-emerald-400 px-3 py-1 rounded-full font-bold border border-emerald-400/20">● Trajectory Match</span>
              </div>

              {/* Search input */}
              <div className="relative mb-4">
                <input
                  type="text"
                  value={scoutQuery}
                  onChange={(e) => setScoutQuery(e.target.value)}
                  placeholder="Search hidden tech talents in Malaysia..."
                  className="w-full bg-white/5 border border-white/15 focus:border-blue-400/50 focus:outline-none text-white placeholder-white/25 text-sm rounded-xl px-4 py-3 pr-10 transition-all duration-300"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 text-sm">
                  {scoutQuery ? <span className="text-blue-400 cursor-pointer" onClick={() => setScoutQuery('')}>✕</span> : '🔍'}
                </span>
              </div>

              {/* Candidate preview card */}
              <div className="bg-[#0a0f1e] rounded-xl p-5">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-emerald-400 flex items-center justify-center text-black font-black text-sm flex-shrink-0">
                    {scoutQuery ? scoutQuery[0]?.toUpperCase() : 'P'}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-black text-sm">{scoutQuery || 'Priya S.'} · Kuala Lumpur</div>
                    <div className="text-white/30 text-xs">UTM Computer Science · Year 4</div>
                  </div>
                  <div className="text-xs bg-white/5 text-white/30 border border-white/10 px-2 py-1 rounded">Not job-hunting yet</div>
                </div>
                {[
                  { skill: 'System Design',    score: 82, delta: '+18 pts · 90d', color: 'bg-emerald-400' },
                  { skill: 'Production CI/CD', score: 74, delta: '+31 pts · 90d', color: 'bg-emerald-400' },
                  { skill: 'Distributed Sys',  score: 68, delta: '+22 pts · 90d', color: 'bg-blue-400' },
                ].map((s) => (
                  <div key={s.skill} className="mb-3">
                    <div className="flex justify-between text-xs text-white/40 mb-1">
                      <span>{s.skill}</span>
                      <span className="text-emerald-400 font-bold">{s.delta}</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.score}%` }} />
                    </div>
                  </div>
                ))}
                <p className="text-xs text-white/20 italic mt-3">
                  {scoutQuery ? `Scanning verified trajectories for "${scoutQuery}"...` : "Candidate hasn't applied. You're seeing their verified trajectory — not their pitch."}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ── E2: HOW IT WORKS ─────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#0d1117]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel color="text-blue-400 border-blue-400/30">Zero-Noise Scout · How It Works</SectionLabel>
            <h2 className="text-3xl font-black text-white mt-5 mb-3">Three steps. No cold outreach. No noise.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { step: '01', title: 'Set a growth profile', sub: 'Not a job description', body: 'Define the skills trajectory you need — not keywords to keyword-match against.' },
              { step: '02', title: 'We surface silently', sub: 'Zero spam in your inbox', body: 'Only aligned trajectories appear. Unqualified hundreds never reach your team.' },
              { step: '03', title: 'Reach out first', sub: "Before they're Open to Work", body: "We flag alignment before they update LinkedIn — you're first, not 847th." },
            ].map((item) => (
              <Card key={item.step} className="p-7 hover:border-blue-400/30">
                <div className="text-5xl font-black text-blue-400/20 mb-4">{item.step}</div>
                <div className="font-black text-white text-lg mb-1">{item.title}</div>
                <div className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">{item.sub}</div>
                <p className="text-white/40 text-sm leading-relaxed">{item.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── E3: ATS INTEGRATION + ROI ───────────────────────────── */}
      <section className="py-20 px-6 bg-[#080d18]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            {/* ATS bridge */}
            <div>
              <SectionLabel color="text-purple-400 border-purple-400/30">Enterprise Integration</SectionLabel>
              <h2 className="text-3xl font-black text-white mt-5 mb-4">Plays well with what you already use.</h2>
              <p className="text-white/40 leading-relaxed mb-6">
                Career OS feeds your existing ATS richer signal. Pre-qualified candidates arrive at Greenhouse or Workday with verified evidence scores — not just a PDF.
                Time-to-hire drops from <strong className="text-white/70">45 days</strong> to <strong className="text-emerald-400">11 days</strong>.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {['Greenhouse', 'Lever', 'Workday', 'SAP SuccessFactors', 'Oracle HCM', 'BambooHR'].map((ats) => (
                  <div key={ats} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white/50 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                    {ats}
                  </div>
                ))}
              </div>
            </div>

            {/* ROI calculator */}
            <Card className="p-7 hover:border-emerald-400/30">
              <div className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-5">MYR ROI Calculator · Malaysia Market</div>
              <div className="space-y-4">
                {[
                  { metric: 'Cost-per-hire (before)', val: 'MYR 12,000', sub: 'Traditional job board + ATS fees', color: 'text-rose-400' },
                  { metric: 'Cost-per-hire (with Career OS)', val: 'MYR 3,500', sub: 'Automated pipeline spotting', color: 'text-emerald-400' },
                  { metric: 'Savings per hire', val: 'MYR 8,500', sub: '71% reduction', color: 'text-cyan-400' },
                  { metric: 'For 10 hires/year', val: 'MYR 85,000 saved', sub: 'Reallocated to engineering tools or salaries', color: 'text-fuchsia-400' },
                ].map((row) => (
                  <div key={row.metric} className="flex items-start justify-between py-3 border-b border-white/5">
                    <div>
                      <div className="text-white/60 text-sm font-bold">{row.metric}</div>
                      <div className="text-white/30 text-xs">{row.sub}</div>
                    </div>
                    <div className={`font-black text-lg ${row.color}`}>{row.val}</div>
                  </div>
                ))}
              </div>
              <button onClick={onBuildOwn}
                className="mt-5 w-full py-3 bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 border border-emerald-400/25 hover:border-emerald-400/50 text-emerald-400 font-black text-sm rounded-xl transition-all duration-300 hover:-translate-y-0.5">
                Request Enterprise Access →
              </button>
            </Card>
          </div>
        </div>
      </section>

      {/* ── E4: EMPLOYER CTA ─────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#0a0f1e]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="border border-blue-500/20 rounded-2xl p-10 bg-blue-500/5">
            <div className="text-xs text-white/30 font-black uppercase tracking-widest mb-4">
              🏆 Talentbank Tech Hackathon 2026 · Employer Track
            </div>
            <h3 className="text-3xl font-black text-white mb-4">Ready to spot signal, not sort noise?</h3>
            <p className="text-white/40 mb-8 text-center">
              Join 10,000+ Malaysian employers already reducing cost-per-hire with trajectory-based scouting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={onBuildOwn}
                className="px-10 py-4 bg-blue-500 hover:bg-blue-400 text-white font-black text-sm rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/25">
                🏢 Start Silent Scouting →
              </button>
              <button
                className="px-10 py-4 border border-white/20 hover:border-blue-400/40 text-white font-bold text-sm rounded-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/5">
                See Case Studies →
              </button>
            </div>
            <p className="text-xs text-white/20 mt-5">10,000+ employers · PDPA compliant · Malaysia data residency</p>
          </div>
        </div>
      </section>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN LANDING — THE GREAT TOGGLE
// ══════════════════════════════════════════════════════════════════════════════
export function Landing({ onViewDemo, onBuildOwn }: Props) {
  const [activeMode, setActiveMode] = useState<ActiveMode>('talent');
  const [showPersonas, setShowPersonas] = useState(false);
  const section2Ref = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);

  const scrollToNext = () => section2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowPersonas(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const switchMode = (mode: ActiveMode) => {
    setActiveMode(mode);
    setTimeout(() => toggleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  return (
    <div className="bg-[#0a0f1e] min-h-screen text-white overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Grid bg */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>
            <span className="inline-flex items-center gap-2 text-emerald-400 text-xs font-black tracking-widest uppercase mb-8 border border-emerald-400/30 px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Career OS · Universities Module 03 · Malaysia &amp; Asia Pacific
            </span>
            <h1 className="text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight mb-6">
              Most platforms
              <span className="block text-emerald-400">find you a job.</span>
              <span className="text-white/40">We navigate</span>
              <span className="block">your career.</span>
            </h1>
            <p className="text-lg text-white/50 leading-relaxed mb-10 max-w-lg">
              A living intelligence layer that maps <strong className="text-white/80">realistic trajectories</strong>,
              explains every trade-off in plain language, and connects the right people — before anyone sends a résumé.
            </p>

            {/* CTA pair */}
            {!showPersonas ? (
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button onClick={() => { setActiveMode('talent'); setShowPersonas(true); }}
                  className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/25 active:scale-95">
                  🎓 Map My Career Path →
                </button>
                <button onClick={() => switchMode('employer')}
                  className="px-8 py-4 border border-white/20 hover:border-blue-400/50 text-white font-bold text-sm rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 hover:bg-white/5">
                  🏢 Scout Without the Noise →
                </button>
              </div>
            ) : (
              <div className="mb-8">
                <p className="text-sm text-white/50 font-bold mb-4 uppercase tracking-wider">Choose a real career profile:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  {DEMO_PERSONAS.map(({ profile, emoji, role, company, salary }) => (
                    <button key={profile.id} onClick={() => onViewDemo(profile)}
                      className="bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-400/40 rounded-xl p-4 text-left transition-all duration-300 hover:-translate-y-1 group">
                      <div className="text-2xl mb-2">{emoji}</div>
                      <div className="text-white font-black text-sm group-hover:text-emerald-400 transition-colors">{profile.name}</div>
                      <div className="text-white/40 text-xs mt-1">{role} · {company}</div>
                      <div className="text-emerald-400 text-xs font-bold mt-2">{salary}</div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowPersonas(false)} className="text-xs text-white/30 hover:text-white/60 transition-colors">← Back</button>
                  <button onClick={onBuildOwn} className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-bold">Or build your own profile →</button>
                </div>
              </div>
            )}
            <p className="text-xs text-white/20 font-semibold tracking-wide">
              No black-box scores · Every recommendation cites its source · PDPA compliant
            </p>
          </div>

          {/* Right: Journey card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs text-emerald-400 font-black uppercase tracking-widest">Realistic SWE Trajectory · Malaysia</p>
              <span className="text-xs bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 px-2 py-1 rounded-full font-bold">Live data</span>
            </div>
            <div className="relative pl-6">
              <div className="absolute left-1.5 top-2 bottom-2 w-px bg-gradient-to-b from-emerald-400 via-blue-400 to-blue-400/20" />
              <div className="space-y-6">
                {MILESTONES.map((m, i) => (
                  <div key={i} className="relative">
                    <div className={`absolute -left-[22px] top-1.5 w-3 h-3 rounded-full border-2 border-[#0a0f1e] ${i === 0 ? 'bg-emerald-400' : i === MILESTONES.length - 1 ? 'bg-blue-400' : 'bg-white/40'}`} />
                    <div className="text-xs text-white/30 font-bold mb-0.5">{m.year}</div>
                    <div className="font-black text-white text-sm">{m.role}</div>
                    <div className="text-emerald-400 font-bold text-xs">{m.salary}</div>
                    <div className="text-white/30 text-xs mt-0.5">{m.skill}</div>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-5 text-xs text-white/20 italic border-t border-white/10 pt-4">
              Based on 10,000+ verified progressions in Malaysia &amp; SEA.
            </p>
          </Card>
        </div>

        {/* Scroll indicator */}
        <button onClick={scrollToNext}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 hover:text-emerald-400 transition-colors duration-300 group z-10">
          <span className="text-xs font-bold uppercase tracking-widest">Explore</span>
          <div className="w-6 h-10 border-2 border-white/20 group-hover:border-emerald-400/50 rounded-full flex items-start justify-center pt-1.5 transition-colors duration-300">
            <div className="w-1 h-2 bg-white/40 group-hover:bg-emerald-400 rounded-full animate-bounce transition-colors duration-300" />
          </div>
        </button>
      </section>

      {/* Stats strip */}
      <div className="border-y border-white/10 bg-white/[0.02] py-5">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { num: '10,000+', label: 'verified career profiles' },
            { num: 'MYR 4k→45k', label: '7-year SWE progression' },
            { num: '34 skills', label: 'tracked across Malaysia tech' },
            { num: '100%', label: 'explainable — no black box' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-black text-white">{s.num}</div>
              <div className="text-xs text-white/30 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── THE GREAT TOGGLE ─────────────────────────────────────── */}
      <div ref={toggleRef as React.RefObject<HTMLDivElement>} className="sticky top-0 z-50 bg-[#0a0f1e]/90 backdrop-blur-xl border-b border-white/8 py-4">
        <div className="max-w-md mx-auto px-4">
          {/* Label above */}
          <p className="text-center text-xs font-black text-white/25 uppercase tracking-widest mb-3">
            I am a...
          </p>
          {/* Capsule toggle */}
          <div className="relative flex bg-slate-900/80 border border-slate-800 rounded-full p-1 backdrop-blur-md">
            {/* Sliding pill */}
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-r from-fuchsia-500 to-cyan-400 rounded-full transition-all duration-300 ease-in-out shadow-lg shadow-fuchsia-500/20 ${
                activeMode === 'talent' ? 'left-1' : 'left-[calc(50%+3px)]'
              }`}
            />
            {/* Talent button */}
            <button
              onClick={() => switchMode('talent')}
              className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-black rounded-full transition-all duration-300 ${
                activeMode === 'talent' ? 'text-black' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🧑‍💻</span>
              <span className="hidden sm:inline">For Talent</span>
              <span className="sm:hidden">Talent</span>
            </button>
            {/* Employer button */}
            <button
              onClick={() => switchMode('employer')}
              className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-black rounded-full transition-all duration-300 ${
                activeMode === 'employer' ? 'text-black' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🏢</span>
              <span className="hidden sm:inline">For Enterprise</span>
              <span className="sm:hidden">Enterprise</span>
            </button>
          </div>
          {/* Context hint */}
          <p className="text-center text-xs text-white/20 mt-2">
            {activeMode === 'talent'
              ? 'Candidates · Students · Career Explorers'
              : 'Employers · HR Teams · Talent Acquisition'}
          </p>
        </div>
      </div>

      {/* ── MODE-SPECIFIC CONTENT ────────────────────────────────── */}
      <section ref={section2Ref as React.RefObject<HTMLElement>}>
        <div
          key={activeMode}
          className="transition-opacity duration-300"
          style={{ animation: 'fadeIn 0.3s ease-in-out' }}
        >
          {activeMode === 'talent'
            ? <TalentSections onViewDemo={onViewDemo} onBuildOwn={onBuildOwn} />
            : <EmployerSections onBuildOwn={onBuildOwn} />
          }
        </div>
      </section>

      {/* Fade-in animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
