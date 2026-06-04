import { useState, useRef, useEffect } from 'react';
import { StudentProfile } from '../types/evidence';
import { priyaSharmaProfile, kaiChenProfile, aishaPatelProfile } from '../data/mockStudent';

interface Props {
  onViewDemo: (profile: StudentProfile) => void;
  onBuildOwn: () => void;
}

// ── Design System Tokens (Fix #8 — unified across all sections) ──────────────
// bg-[#0a0f1e]  = page base
// bg-[#0d1117]  = section alt
// bg-[#060b14]  = section dark
// bg-[#080d18]  = section deeper
// emerald-400/500 = primary accent
// blue-400/500    = secondary accent
// purple-400      = infra accent
// border-white/10 = default card border
// rounded-2xl     = card radius
// font-black      = headlines
// transition-all duration-300 hover:-translate-y-1 hover:shadow-xl = card hover (Fix #7)

const DEMO_PERSONAS = [
  { profile: priyaSharmaProfile, emoji: '🚀', role: 'Senior SWE', company: 'Grab · KL / Singapore', salary: 'MYR 45,000/mo' },
  { profile: kaiChenProfile,    emoji: '📊', role: 'Senior Data Eng', company: 'ByteDance · Singapore', salary: 'MYR 38,000/mo' },
  { profile: aishaPatelProfile, emoji: '📈', role: 'Senior PM', company: 'Lazada · Malaysia', salary: 'MYR 28,000/mo' },
];

const MILESTONES = [
  { year: 'Year 1', role: 'SWE Intern',     salary: 'MYR 3,500–5,500/mo', skill: 'Python · REST APIs · Git' },
  { year: 'Year 2', role: 'Junior SWE',     salary: 'MYR 6,000–9,000/mo', skill: '+ CI/CD · API ownership' },
  { year: 'Year 4', role: 'Mid SWE',        salary: 'MYR 11,000–18,000/mo', skill: '+ Distributed systems' },
  { year: 'Year 7', role: 'Staff Engineer', salary: 'MYR 22,000+/mo', skill: '+ Cross-team influence' },
];

// Fix #3 — Enriched path data with clearer specialisation vs ownership framing
const TRADEOFFS = {
  corporate: {
    badge: '🏢 Specialisation & Scale',
    label: 'Large Company Path',
    tagline: 'Go deep. Move predictably. Own a domain.',
    route: 'Junior SWE → Senior SWE → Tech Lead → Staff',
    timeline: '5–8 years',
    color: 'blue',
    why: 'Production Practices gap (36/100) closes 2× faster inside a large org with structured on-call rotations, code review culture, and mentorship programmes.',
    evidence: '1,240 profiles on this path — 68% reached Senior SWE by year 5.',
    pros: [
      { label: 'Technical depth', desc: 'Become a domain expert in one stack — highly valued by recruiters' },
      { label: 'Predictable growth', desc: 'Clear levelling rubrics (L3→L4→L5) with transparent salary bands' },
      { label: 'Team infrastructure', desc: 'Work with dedicated QA, DevOps, design — you ship without wearing every hat' },
      { label: 'Brand on CV', desc: 'Grab/Shopee/DBS on your résumé opens doors for 10+ years' },
    ],
    cons: [
      { label: 'Stack lock-in', desc: 'Go/Java dominant — Python/TypeScript skills may stagnate' },
      { label: 'Slow yr 1–3 pay', desc: 'Graduate bands compressed vs startup; equity minimal' },
      { label: 'Process overhead', desc: 'Sprints, approvals, and meetings before shipping anything meaningful' },
    ],
    salaryRows: [
      { yr: 'Yr 1', sal: 'MYR 60,000–84,000/yr', note: 'Intern → Junior', w: '30%' },
      { yr: 'Yr 3', sal: 'MYR 108,000–156,000/yr', note: 'Mid SWE', w: '55%' },
      { yr: 'Yr 5', sal: 'MYR 144,000–192,000/yr', note: 'Senior SWE', w: '75%' },
      { yr: 'Yr 7', sal: 'MYR 180,000–250,000/yr', note: 'Tech Lead / Staff', w: '100%' },
    ],
  },
  startup: {
    badge: '🚀 Ownership & Breadth',
    label: 'Startup Path',
    tagline: 'Own everything. Move fast. Build equity.',
    route: 'Full-Stack → Founding Eng → CTO Track',
    timeline: '3–5 years (high variance)',
    color: 'emerald',
    why: 'Communication score (80/100) is unusually high for this level. Startups reward cross-functional communication immediately — large orgs won\'t deploy it until year 5+.',
    evidence: '847 profiles on this path — 40% equity event within 5 years, 35% company failure.',
    pros: [
      { label: 'Full ownership', desc: 'You own the infra, the product, the roadmap — from day one' },
      { label: 'Equity upside', desc: 'CTO/Founding Eng title + equity accessible in 3–4 years' },
      { label: 'Skill breadth', desc: 'Ship across frontend, backend, data, infra — CV becomes generalist-strong' },
      { label: 'Fast feedback', desc: 'User feedback in hours, not sprint cycles' },
    ],
    cons: [
      { label: 'No safety net', desc: 'No structured mentorship — you learn by breaking production things' },
      { label: 'Resume risk', desc: 'Thin evidence if startup fails at year 2–3 with nothing shipped' },
      { label: 'High burn rate', desc: 'Erratic hours, no dedicated QA or DevOps support' },
    ],
    salaryRows: [
      { yr: 'Yr 1', sal: 'MYR 48,000–72,000/yr', note: 'Early employee', w: '25%' },
      { yr: 'Yr 2', sal: 'MYR 84,000–120,000/yr', note: 'Founding Eng', w: '45%' },
      { yr: 'Yr 4', sal: 'MYR 120,000–180,000/yr + equity', note: 'CTO Track', w: '70%' },
      { yr: 'Yr 5', sal: 'MYR 200,000–400,000+ exit', note: 'Equity event (40%)', w: '100%' },
    ],
  },
};

export function Landing({ onViewDemo, onBuildOwn }: Props) {
  const [showPersonas, setShowPersonas] = useState(false);
  const [activePath, setActivePath] = useState<'corporate' | 'startup'>('corporate');
  const [scoutQuery, setScoutQuery] = useState(''); // Fix #2
  const [showDemoModal, setShowDemoModal] = useState(false); // Fix #6

  // Refs for smooth scroll (Fix #1 & #6)
  const section2Ref = useRef<HTMLElement>(null);
  const scoutRef = useRef<HTMLElement>(null);
  const scoutInputRef = useRef<HTMLInputElement>(null);

  const scrollToNext = () => section2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const scrollToScout = () => {
    scoutRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => scoutInputRef.current?.focus(), 600);
  };

  const path = TRADEOFFS[activePath];

  // Close modal on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowDemoModal(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="bg-[#0a0f1e] min-h-screen text-white overflow-x-hidden">

      {/* ── SECTION 1: HERO ──────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* Grid bg */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        {/* Orbs */}
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
              explains every trade-off in plain language, and connects
              the right people — before anyone sends a résumé.
            </p>

            {/* Dual CTA — Fix #7: hover lift on all buttons */}
            {!showPersonas ? (
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => setShowPersonas(true)}
                  className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/25 active:scale-95"
                >
                  🎓 Map My Career Path →
                </button>
                <button
                  onClick={scrollToScout}
                  className="px-8 py-4 border border-white/20 hover:border-blue-400/50 text-white font-bold text-sm rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 hover:bg-white/5"
                >
                  🏢 Scout Without the Noise →
                </button>
              </div>
            ) : (
              <div className="mb-8">
                <p className="text-sm text-white/50 font-bold mb-4 uppercase tracking-wider">Choose a real career profile:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  {DEMO_PERSONAS.map(({ profile, emoji, role, company, salary }) => (
                    <button
                      key={profile.id}
                      onClick={() => onViewDemo(profile)}
                      className="bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-400/40 rounded-xl p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
                    >
                      <div className="text-2xl mb-2">{emoji}</div>
                      <div className="text-white font-black text-sm group-hover:text-emerald-400 transition-colors">{profile.name}</div>
                      <div className="text-white/40 text-xs mt-1">{role}</div>
                      <div className="text-white/30 text-xs">{company}</div>
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
              No black-box scores · No AI hallucinations · Every recommendation cites its source
            </p>
          </div>

          {/* Right: Journey card — Fix #7: hover lift */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/5 hover:border-emerald-400/20">
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
            <p className="mt-6 text-xs text-white/20 italic border-t border-white/10 pt-4">
              Based on 10,000+ verified progressions in Malaysia &amp; SEA. Your path will differ — we show you exactly how and why.
            </p>
          </div>
        </div>

        {/* Fix #1 — Scroll indicator */}
        <button
          onClick={scrollToNext}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 hover:text-emerald-400 transition-colors duration-300 group z-10"
          aria-label="Scroll to next section"
        >
          <span className="text-xs font-bold uppercase tracking-widest">Explore</span>
          <div className="w-6 h-10 border-2 border-white/20 group-hover:border-emerald-400/50 rounded-full flex items-start justify-center pt-1.5 transition-colors duration-300">
            <div className="w-1 h-2 bg-white/40 group-hover:bg-emerald-400 rounded-full animate-bounce transition-colors duration-300" />
          </div>
        </button>
      </section>

      {/* Stats strip */}
      <div className="border-y border-white/10 bg-white/[0.02] py-6">
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

      {/* ── SECTION 2: CANDIDATE — TRADE-OFF NAVIGATOR ───────────────── */}
      <section ref={section2Ref} className="py-24 px-6 bg-[#0d1117]">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-14">
            <span className="text-xs text-emerald-400 font-black uppercase tracking-widest border border-emerald-400/30 px-3 py-1 rounded-full">For Candidates</span>
            <h2 className="text-4xl lg:text-5xl font-black text-white mt-6 mb-4 leading-tight">
              Your next move isn't obvious.
              <span className="block text-emerald-400">Neither should our advice be.</span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto text-lg text-center">
              Every path has real trade-offs. We name them honestly — so you can choose with eyes open.
            </p>
          </div>

          {/* Fix #3 — Side-by-side path comparison toggle */}
          <div className="flex justify-center gap-3 mb-10">
            {(['corporate', 'startup'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setActivePath(p)}
                className={`px-6 py-3 rounded-xl text-sm font-black transition-all duration-300 ${
                  activePath === p
                    ? 'bg-emerald-500 text-black scale-105 shadow-lg shadow-emerald-500/25'
                    : 'border border-white/20 text-white/50 hover:border-white/40 hover:text-white hover:-translate-y-0.5'
                }`}
              >
                {p === 'corporate' ? '🏢 Large Company Path' : '🚀 Startup Path'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Left: Path detail card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-emerald-400/20">

              {/* Badge + headline */}
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-xs font-black px-3 py-1 rounded-full border ${
                  activePath === 'corporate'
                    ? 'bg-blue-400/10 text-blue-400 border-blue-400/30'
                    : 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30'
                }`}>
                  {path.badge}
                </span>
              </div>
              <div className="text-white font-black text-2xl mb-1">{path.route}</div>
              <div className="text-white/30 text-sm mb-1">⏱ {path.timeline}</div>
              <div className="text-white/50 text-sm italic mb-6">"{path.tagline}"</div>

              {/* Explainable AI reasoning */}
              <div className="bg-emerald-400/10 border border-emerald-400/20 rounded-xl p-4 mb-6">
                <p className="text-xs text-emerald-400 font-black uppercase mb-2">Why it fits your profile</p>
                <p className="text-sm text-white/80 leading-relaxed">{path.why}</p>
                <p className="text-xs text-white/30 mt-3 italic">— {path.evidence}</p>
              </div>

              {/* Fix #3 — Pros with descriptors */}
              <div className="space-y-1 mb-4">
                <p className="text-xs text-emerald-400 font-black uppercase tracking-wider mb-3">✓ Advantages</p>
                {path.pros.map((item) => (
                  <div key={item.label} className="flex items-start gap-3 py-1.5 border-b border-white/5">
                    <span className="text-emerald-400 font-black mt-0.5 flex-shrink-0">✓</span>
                    <div>
                      <span className="text-white/80 text-sm font-bold">{item.label}</span>
                      <span className="text-white/40 text-xs block">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Fix #3 — Cons with descriptors */}
              <div className="space-y-1">
                <p className="text-xs text-red-400/80 font-black uppercase tracking-wider mb-3">✗ Trade-offs</p>
                {path.cons.map((item) => (
                  <div key={item.label} className="flex items-start gap-3 py-1.5 border-b border-white/5">
                    <span className="text-red-400 font-black mt-0.5 flex-shrink-0">✗</span>
                    <div>
                      <span className="text-white/60 text-sm font-bold">{item.label}</span>
                      <span className="text-white/30 text-xs block">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Salary timeline */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-blue-400/20">
              <div>
                <p className="text-xs text-white/30 font-black uppercase tracking-wider mb-6">
                  MYR Salary Progression · {activePath === 'corporate' ? 'Large Corp Track' : 'Startup Track'}
                </p>
                {path.salaryRows.map((row) => (
                  <div key={row.yr} className="mb-4">
                    <div className="flex justify-between text-xs text-white/50 mb-1">
                      <span className="font-bold">{row.yr} · <span className="text-white/30">{row.note}</span></span>
                      <span className="font-black text-white">{row.sal}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-blue-400 rounded-full transition-all duration-700" style={{ width: row.w }} />
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowPersonas(true)}
                className="mt-6 w-full py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-400/20 hover:border-emerald-400/40 text-emerald-400 font-black text-sm rounded-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                See a real person who took this path →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: EMPLOYER — ZERO-NOISE SCOUT ───────────────────── */}
      <section ref={scoutRef} className="py-24 px-6 bg-[#060b14]">
        <div className="max-w-6xl mx-auto">

          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-16 max-w-3xl mx-auto text-center">
            <p className="text-red-400 font-black text-xs uppercase tracking-widest mb-3">The Real Problem With Hiring in 2025</p>
            <p className="text-white text-xl font-bold leading-relaxed">
              "Your ATS was built to filter.
              <span className="text-white/40"> Filtering optimises for résumés that game the ATS.
              This is how you end up interviewing people who can't actually code."</span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <span className="text-xs text-blue-400 font-black uppercase tracking-widest">For Hiring Teams</span>
              <h2 className="text-4xl lg:text-5xl font-black text-white mt-3 mb-6 leading-tight">
                Stop filtering noise.
                <span className="block text-blue-400">Start spotting signal.</span>
              </h2>
              <p className="text-white/40 text-lg leading-relaxed mb-10">
                The average job post in 2025 receives 847 applications. Fewer than 12 are worth reading.
                We fix the root cause — not the symptom.
              </p>

              {/* Fix #2 — Scout search input */}
              <div className="mb-8">
                <label className="text-xs text-blue-400 font-black uppercase tracking-widest mb-3 block">
                  🔍 Try Silent Scouting
                </label>
                <div className="relative">
                  <input
                    ref={scoutInputRef}
                    type="text"
                    value={scoutQuery}
                    onChange={(e) => setScoutQuery(e.target.value)}
                    placeholder="Search hidden tech talents in Malaysia..."
                    className="w-full bg-white/5 border border-white/20 hover:border-blue-400/40 focus:border-blue-400/60 focus:outline-none text-white placeholder-white/25 text-sm font-medium rounded-xl px-4 py-3.5 pr-12 transition-all duration-300"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20">
                    {scoutQuery.length > 0
                      ? <span className="text-blue-400 text-xs font-black cursor-pointer hover:text-blue-300" onClick={() => setScoutQuery('')}>✕</span>
                      : <span className="text-lg">🔍</span>
                    }
                  </div>
                </div>
                {scoutQuery.length > 0 && (
                  <div className="mt-2 bg-[#0a0f1e] border border-white/10 rounded-xl p-4">
                    <div className="text-xs text-blue-400 font-black mb-2">Scanning verified trajectories for "{scoutQuery}"...</div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-emerald-400 flex items-center justify-center text-black font-black text-xs flex-shrink-0">
                        {scoutQuery[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <div className="text-white text-xs font-black">{scoutQuery} · Profile found</div>
                        <div className="text-emerald-400 text-xs">System Design +22 pts · 90d · Not job-hunting yet</div>
                      </div>
                      <span className="ml-auto text-xs bg-emerald-400/20 text-emerald-400 px-2 py-1 rounded-full border border-emerald-400/20 font-bold flex-shrink-0">● Match</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { num: '12×', label: 'signal-to-noise ratio' },
                  { num: '0', label: 'AI-generated résumés accepted' },
                  { num: '100%', label: 'verified evidence, not self-reported' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/5 rounded-xl p-4 text-center border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/20">
                    <div className="text-2xl font-black text-blue-400">{stat.num}</div>
                    <div className="text-xs text-white/30 mt-1 leading-snug">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Silent Scout demo card — Fix #7: hover lift */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-blue-400/20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-blue-400 font-black uppercase tracking-widest">Silent Scouting · Live View</span>
                <span className="text-xs bg-emerald-400/20 text-emerald-400 px-3 py-1 rounded-full font-bold border border-emerald-400/20">● Trajectory Match</span>
              </div>
              <div className="bg-[#0a0f1e] rounded-xl p-5 mb-4">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-emerald-400 flex items-center justify-center text-black font-black text-sm flex-shrink-0">P</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-black text-sm">Priya S. · Kuala Lumpur</div>
                    <div className="text-white/30 text-xs">UTM Computer Science · Year 4</div>
                  </div>
                  <div className="text-xs bg-white/5 text-white/30 border border-white/10 px-2 py-1 rounded flex-shrink-0">Not job-hunting yet</div>
                </div>
                {[
                  { skill: 'System Design', score: 82, delta: '+18 pts · 90d', color: 'bg-emerald-400' },
                  { skill: 'Production CI/CD', score: 74, delta: '+31 pts · 90d', color: 'bg-emerald-400' },
                  { skill: 'Distributed Sys', score: 68, delta: '+22 pts · 90d', color: 'bg-blue-400' },
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
              </div>
              <p className="text-xs text-white/20 italic">
                Candidate has not applied. You're seeing verified evidence trajectory — not their pitch.
              </p>
            </div>
          </div>

          {/* 3-step process */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Set a growth profile', sub: 'Not a job description', body: 'Define the skills trajectory you need, not keywords to keyword-match against.' },
              { step: '02', title: 'We surface candidates silently', sub: 'No noise, no spam', body: 'Only aligned trajectories appear. Unqualified hundreds never reach your inbox.' },
              { step: '03', title: 'Reach out at the right moment', sub: "Before they're Open to Work", body: "We flag trajectory alignment before they update LinkedIn — so you're first, not 847th." },
            ].map((item) => (
              <div key={item.step} className="bg-white/[0.03] border border-white/10 hover:border-blue-400/30 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-white/[0.05]">
                <div className="text-5xl font-black text-blue-400/20 mb-4">{item.step}</div>
                <div className="font-black text-white text-lg mb-1">{item.title}</div>
                <div className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">{item.sub}</div>
                <p className="text-white/40 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: CAREER OS INFRASTRUCTURE ─────────────────────── */}
      {/* Fix #4 — Perfect centering using flex flex-col items-center text-center mx-auto */}
      <section className="py-24 px-6 bg-[#080d18]">
        <div className="max-w-6xl mx-auto">

          {/* Fix #4 — Centered header block */}
          <div className="flex flex-col items-center text-center mx-auto max-w-2xl mb-16">
            <span className="text-xs text-purple-400 font-black uppercase tracking-widest border border-purple-400/30 px-3 py-1 rounded-full mb-6">
              System Architecture
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
              Not a job board. Not an ATS.
              <span className="block text-white/30">The connective tissue between them.</span>
            </h2>
            <p className="text-white/40 text-lg leading-relaxed text-center">
              Career OS is the layer existing tools were never designed to be:
              continuous, bilateral, and intelligent across a 40-year horizon.
            </p>
          </div>

          {/* Central OS node */}
          <div className="flex justify-center mb-12">
            <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-2xl px-12 py-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="text-4xl mb-2">⚙️</div>
              <div className="text-white font-black text-xl">Career OS</div>
              <div className="text-white/30 text-xs mt-1">Intelligence Layer · 40-Year Horizon</div>
            </div>
          </div>

          {/* 2×2 grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: '⚡', title: 'Auto-Updating Career Evidence', sub: 'Living Portfolio Sync', body: 'GitHub commits, deployments, and certifications auto-logged. Every skill gained is captured — no manual updating.', badges: ['GitHub', 'Vercel', 'Coursera', 'AWS Certs'] },
              { icon: '📅', title: 'Career Moments, Not Job Alerts', sub: 'Calendar Intelligence', body: 'Knows when your skills are becoming market-rare, or when a pivot costs 3 years vs. 6 months. Proactive — not reactive.', badges: ['Google Calendar', 'Outlook', 'Workday'] },
              { icon: '🔗', title: "Plays Well With What You Already Use", sub: 'ATS Bridge (Enterprise)', body: 'Career OS feeds your existing ATS richer signal. Pre-qualified candidates arrive at Greenhouse with verified evidence scores.', badges: ['Greenhouse', 'Lever', 'Workday', 'SAP'] },
              { icon: '🎓', title: 'Real Graduate ROI — Not Survey Data', sub: 'University Outcome Loop', body: 'Anonymised cohort outcomes at 1, 3, and 10 years post-grad. Actual trajectories — letting curriculum teams fix what matters.', badges: ['100+ institutions · Malaysia'] },
            ].map((card) => (
              <div key={card.title} className="group bg-white/[0.03] border border-white/10 hover:border-purple-400/30 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-white/[0.05]">
                <div className="text-3xl mb-4">{card.icon}</div>
                <div className="text-xs text-purple-400 font-black uppercase tracking-widest mb-2">{card.sub}</div>
                <h3 className="text-white font-black text-lg mb-3">{card.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-5">{card.body}</p>
                <div className="flex flex-wrap gap-2">
                  {card.badges.map((b) => (
                    <span key={b} className="text-xs px-2 py-1 bg-white/10 text-white/40 rounded-md font-semibold">{b}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: TRUST & FAIR PAY ENGINE ───────────────────────── */}
      <section className="py-24 px-6 bg-[#0a0f1e]">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Careers involve money and risk.
              <span className="block text-emerald-400">We handle both honestly.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">

            {/* Stealth Mode */}
            <div className="bg-gradient-to-br from-slate-900 to-[#0d1117] border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/20 hover:shadow-xl">
              <span className="text-xs text-purple-400 font-black uppercase tracking-widest block mb-4">🔒 Privacy Architecture</span>
              <h3 className="text-2xl font-black text-white mb-2">
                Looking while employed?
                <span className="block text-white/40 font-bold text-xl mt-1">We built this for you.</span>
              </h3>
              <p className="text-white/40 text-sm leading-relaxed mb-6">
                84% of employed professionals explore opportunities silently. Stealth Mode was designed from day one.
              </p>
              <div className="space-y-3">
                {[
                  'Current employer is auto-blocked. Always.',
                  'No suspicious "profile view" activity signals',
                  'Visibility toggled per company — not platform-wide',
                  'Delete everything, instantly. Zero data retention.',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 transition-all duration-300 hover:border-purple-400/20">
                    <span className="text-purple-400 font-black text-lg">→</span>
                    <span className="text-white/60 text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fix #5 — Fair Pay Engine with MYR */}
            <div className="bg-gradient-to-br from-[#0d1a0d] to-[#0d1117] border border-emerald-400/20 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:shadow-xl">
              <span className="text-xs text-emerald-400 font-black uppercase tracking-widest block mb-4">💰 Fair Pay Engine · 10,000+ Malaysian Employers</span>
              <h3 className="text-2xl font-black text-white mb-2">
                The salary range they gave you
                <span className="block text-emerald-400">isn't real. This is.</span>
              </h3>
              <p className="text-white/40 text-sm leading-relaxed mb-6">
                Live MYR compensation data from 10,000+ active employers across MNCs, GLCs, large locals, tech/SaaS. No surveys. Actual offer data.
              </p>
              {/* Fix #5 — MYR salary bars */}
              <div className="bg-black/30 rounded-xl p-5 mb-6">
                <div className="text-xs text-white/30 mb-4 font-bold">Senior SWE · Kuala Lumpur · 5 YOE · Real-time</div>
                {[
                  { label: 'P25  Low offer',  value: 'MYR 96,000/yr',  width: '40%', color: 'bg-red-400' },
                  { label: 'P50  Median',     value: 'MYR 132,000/yr', width: '60%', color: 'bg-yellow-400' },
                  { label: 'P90  Top offer',  value: 'MYR 216,000/yr', width: '90%', color: 'bg-emerald-400' },
                ].map((row) => (
                  <div key={row.label} className="mb-3">
                    <div className="flex justify-between text-xs text-white/40 mb-1">
                      <span>{row.label}</span>
                      <span className="font-black text-white">{row.value}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${row.color} rounded-full`} style={{ width: row.width }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['Know Before You Negotiate', 'Underpayment Alert', 'Negotiation Timing'].map((f) => (
                  <div key={f} className="text-xs px-3 py-2 bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 rounded-lg font-bold text-center leading-snug transition-all duration-300 hover:bg-emerald-400/20 hover:border-emerald-400/40 cursor-default">
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fix #6 — Bottom CTA with working Demo button */}
          <div className="text-center border border-white/10 rounded-2xl p-12 bg-white/[0.02] transition-all duration-300 hover:border-emerald-400/20">
            <div className="text-xs text-white/30 font-black uppercase tracking-widest mb-4">
              🏆 Talentbank Tech Hackathon 2026 · Universities Track · Module 03
            </div>
            <h3 className="text-3xl font-black text-white mb-4">See it working on a real profile</h3>
            <p className="text-white/40 mb-8 max-w-md mx-auto text-center">
              Three real Malaysian professionals. Real MYR salary journeys. Real trade-offs. No prediction — just navigation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Fix #6 — View Live Demo scrolls back to demo section */}
              <button
                onClick={() => {
                  setShowPersonas(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/25 active:scale-95"
              >
                🎓 View Live Demo →
              </button>
              <button
                onClick={onBuildOwn}
                className="px-10 py-4 border border-white/20 hover:border-emerald-400/40 text-white font-bold text-sm rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-white/5"
              >
                Build My Own Profile →
              </button>
            </div>
            <p className="text-xs text-white/20 mt-6">No account needed · Free · Powered by Claude AI</p>
          </div>
        </div>
      </section>

      {/* Fix #6 — Demo modal overlay (opens persona selector elegantly) */}
      {showDemoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowDemoModal(false)}
        >
          <div
            className="bg-[#0d1117] border border-white/10 rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-black text-xl">Choose a Live Demo Profile</h3>
              <button onClick={() => setShowDemoModal(false)} className="text-white/30 hover:text-white/60 transition-colors text-2xl leading-none">×</button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {DEMO_PERSONAS.map(({ profile, emoji, role, company, salary }) => (
                <button
                  key={profile.id}
                  onClick={() => { setShowDemoModal(false); onViewDemo(profile); }}
                  className="flex items-center gap-4 bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-400/40 rounded-xl p-4 text-left transition-all duration-300 hover:-translate-y-0.5 group"
                >
                  <span className="text-3xl">{emoji}</span>
                  <div className="flex-1">
                    <div className="text-white font-black group-hover:text-emerald-400 transition-colors">{profile.name}</div>
                    <div className="text-white/40 text-xs">{role} · {company}</div>
                  </div>
                  <div className="text-emerald-400 text-sm font-black">{salary}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
