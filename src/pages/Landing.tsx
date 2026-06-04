import { useState } from 'react';
import { StudentProfile } from '../types/evidence';
import { priyaSharmaProfile, kaiChenProfile, aishaPatelProfile } from '../data/mockStudent';

interface Props {
  onViewDemo: (profile: StudentProfile) => void;
  onBuildOwn: () => void;
}

const DEMO_PERSONAS = [
  { profile: priyaSharmaProfile, emoji: '🚀', role: 'Senior SWE', company: 'Grab · Singapore', salary: 'SGD 15k/mo' },
  { profile: kaiChenProfile,    emoji: '📊', role: 'Senior Data Eng', company: 'ByteDance · Singapore', salary: 'SGD 12k/mo' },
  { profile: aishaPatelProfile, emoji: '📈', role: 'Senior PM', company: 'Lazada · India', salary: 'INR 45L/yr' },
];

const MILESTONES = [
  { year: 'Year 1', role: 'SWE Intern',     salary: 'SGD 3–4k/mo',  skill: 'Python · REST APIs · Git' },
  { year: 'Year 2', role: 'Junior SWE',     salary: 'SGD 5–7k/mo',  skill: '+ CI/CD · API ownership' },
  { year: 'Year 4', role: 'Mid SWE',        salary: 'SGD 9–13k/mo', skill: '+ Distributed systems' },
  { year: 'Year 7', role: 'Staff Engineer', salary: 'SGD 18k+/mo',  skill: '+ Cross-team influence' },
];

const TRADEOFFS = {
  corporate: {
    label: 'Structured Growth',
    route: 'Mid SWE → Senior SWE → Tech Lead',
    timeline: '4–7 years',
    why: 'Your Production Practices gap (36/100) closes faster inside a large org with structured mentorship and on-call rotations than building alone.',
    evidence: '1,240 similar profiles — this path chosen by 68% of them.',
    pros: ['Faster skill depth in one specialisation', 'Internal mobility across teams', 'Structured mentorship & on-call rotation'],
    cons: ['Slower salary growth in years 1–3', 'Stack lock-in (Go/Java dominant)', 'Equity upside limited vs startup track'],
  },
  startup: {
    label: 'High-Variance Growth',
    route: 'Full-Stack → Founding Eng → CTO Track',
    timeline: '3–5 years (if it works)',
    why: 'Your Communication score (80/100) is unusually high for your level. Startups reward this early. Large companies won\'t let you use it until year 5+.',
    evidence: '847 similar profiles — 40% equity event rate within 5 years.',
    pros: ['Equity upside; CTO title accessible in 3–4 yrs', 'Full-stack breadth across infra + product', 'Communication skill rewarded immediately'],
    cons: ['No structured mentorship — learn by breaking things', 'Thin resume evidence if startup fails yr 2–3', 'Health insurance, stability trade-offs'],
  },
};

export function Landing({ onViewDemo, onBuildOwn }: Props) {
  const [showPersonas, setShowPersonas] = useState(false);
  const [activePath, setActivePath] = useState<'corporate' | 'startup'>('corporate');

  const path = TRADEOFFS[activePath];

  return (
    <div className="bg-[#0a0f1e] min-h-screen text-white">

      {/* ── SECTION 1: HERO ──────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Copy */}
          <div>
            <span className="inline-flex items-center gap-2 text-emerald-400 text-xs font-black tracking-widest uppercase mb-8 border border-emerald-400/30 px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Career OS · Universities Module 03 · Asia Pacific
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

            {/* Dual CTA */}
            {!showPersonas ? (
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => setShowPersonas(true)}
                  className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  🎓 Map My Career Path →
                </button>
                <button
                  onClick={onBuildOwn}
                  className="px-8 py-4 border border-white/20 hover:border-emerald-400/50 text-white font-bold text-sm rounded-xl transition-all duration-200 hover:bg-white/5"
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
                      className="bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-400/40 rounded-xl p-4 text-left transition-all duration-200 group"
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

          {/* Right: Career Journey Visualiser */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs text-emerald-400 font-black uppercase tracking-widest">
                Realistic SWE Trajectory · SEA Tech
              </p>
              <span className="text-xs bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 px-2 py-1 rounded-full font-bold">Live data</span>
            </div>

            <div className="relative pl-6">
              {/* Vertical line */}
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
              Based on 10,000+ verified career progressions. Your path will differ — we show you exactly how and why.
            </p>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <div className="border-y border-white/10 bg-white/[0.02] py-6">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { num: '10,000+', label: 'verified career profiles' },
            { num: 'SGD 3k→15k', label: '5-year SWE progression' },
            { num: '34 skills', label: 'tracked across SEA tech' },
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
      <section className="py-24 px-6 bg-[#0d1117]">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-14">
            <span className="text-xs text-emerald-400 font-black uppercase tracking-widest border border-emerald-400/30 px-3 py-1 rounded-full">For Candidates</span>
            <h2 className="text-4xl lg:text-5xl font-black text-white mt-6 mb-4 leading-tight">
              Your next move isn't obvious.
              <span className="block text-emerald-400">Neither should our advice be.</span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto text-lg">
              We don't match you to jobs. We map the terrain ahead —
              every path, every fork, every honest trade-off.
            </p>
          </div>

          {/* Toggle */}
          <div className="flex justify-center gap-3 mb-10">
            {(['corporate', 'startup'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setActivePath(p)}
                className={`px-6 py-3 rounded-xl text-sm font-black transition-all duration-200 ${
                  activePath === p
                    ? 'bg-emerald-500 text-black scale-105'
                    : 'border border-white/20 text-white/50 hover:border-white/40 hover:text-white'
                }`}
              >
                {p === 'corporate' ? '🏢 Large Company Path' : '🚀 Startup Path'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Left: Path card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-xs text-emerald-400 font-black uppercase tracking-widest mb-1">{path.label}</div>
                  <div className="text-white font-black text-xl">{path.route}</div>
                  <div className="text-white/30 text-sm mt-1">⏱ {path.timeline}</div>
                </div>
              </div>

              {/* Explainable AI reasoning */}
              <div className="bg-emerald-400/10 border border-emerald-400/20 rounded-xl p-4 mb-6">
                <p className="text-xs text-emerald-400 font-black uppercase mb-2">Why it fits your profile</p>
                <p className="text-sm text-white/80 leading-relaxed">{path.why}</p>
                <p className="text-xs text-white/30 mt-3 italic">— {path.evidence}</p>
              </div>

              {/* Trade-off table */}
              <div className="space-y-1">
                <p className="text-xs text-white/30 font-black uppercase tracking-wider mb-3">Honest trade-offs</p>
                {path.pros.map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm py-1">
                    <span className="text-emerald-400 font-black mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-white/70">{item}</span>
                  </div>
                ))}
                {path.cons.map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm py-1">
                    <span className="text-red-400 font-black mt-0.5 flex-shrink-0">✗</span>
                    <span className="text-white/40">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Salary timeline visual */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <p className="text-xs text-white/30 font-black uppercase tracking-wider mb-6">Salary progression · {activePath === 'corporate' ? 'Large Corp Track' : 'Startup Track'}</p>
                {(activePath === 'corporate' ? [
                  { yr: 'Yr 1', sal: 'SGD 60–84k', note: 'Intern → Junior', w: '30%' },
                  { yr: 'Yr 3', sal: 'SGD 108–156k', note: 'Mid SWE', w: '55%' },
                  { yr: 'Yr 5', sal: 'SGD 144–192k', note: 'Senior SWE', w: '75%' },
                  { yr: 'Yr 7', sal: 'SGD 180–250k', note: 'Tech Lead / Staff', w: '100%' },
                ] : [
                  { yr: 'Yr 1', sal: 'SGD 48–72k', note: 'Early employee', w: '25%' },
                  { yr: 'Yr 2', sal: 'SGD 84–120k', note: 'Founding Eng', w: '45%' },
                  { yr: 'Yr 4', sal: 'SGD 120–180k + equity', note: 'CTO Track', w: '70%' },
                  { yr: 'Yr 5', sal: 'SGD 200k–400k+ exit', note: 'Equity event (40%)', w: '100%' },
                ]).map((row) => (
                  <div key={row.yr} className="mb-4">
                    <div className="flex justify-between text-xs text-white/50 mb-1">
                      <span className="font-bold">{row.yr} · <span className="text-white/30">{row.note}</span></span>
                      <span className="font-black text-white">{row.sal}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-blue-400 rounded-full transition-all duration-500" style={{ width: row.w }} />
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowPersonas(true)}
                className="mt-6 w-full py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-400/20 hover:border-emerald-400/40 text-emerald-400 font-black text-sm rounded-xl transition-all duration-200"
              >
                See a real person who took this path →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: EMPLOYER — ZERO-NOISE SCOUT ───────────────────── */}
      <section className="py-24 px-6 bg-[#060b14]">
        <div className="max-w-6xl mx-auto">

          {/* Pain point banner */}
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
              <div className="grid grid-cols-3 gap-4 mb-10">
                {[
                  { num: '12×',   label: 'signal-to-noise ratio' },
                  { num: '0',     label: 'AI-generated résumés accepted' },
                  { num: '100%',  label: 'verified evidence, not self-reported' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                    <div className="text-2xl font-black text-blue-400">{stat.num}</div>
                    <div className="text-xs text-white/30 mt-1 leading-snug">{stat.label}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={onBuildOwn}
                className="px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white font-black text-sm rounded-xl transition-all duration-200 hover:scale-105"
              >
                Scout Without the Noise →
              </button>
            </div>

            {/* Silent Scout demo */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-blue-400 font-black uppercase tracking-widest">Silent Scouting · Live View</span>
                <span className="text-xs bg-emerald-400/20 text-emerald-400 px-3 py-1 rounded-full font-bold border border-emerald-400/20">● Trajectory Match</span>
              </div>

              <div className="bg-[#0a0f1e] rounded-xl p-5 mb-4">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-emerald-400 flex items-center justify-center text-black font-black text-sm flex-shrink-0">P</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-black text-sm">Priya S. · Singapore</div>
                    <div className="text-white/30 text-xs">NTU Computer Science · Year 4</div>
                  </div>
                  <div className="text-xs bg-white/5 text-white/30 border border-white/10 px-2 py-1 rounded flex-shrink-0">Not job-hunting yet</div>
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
              </div>

              <p className="text-xs text-white/20 italic">
                Candidate has not applied. You're seeing their verified evidence trajectory — not their pitch.
              </p>
            </div>
          </div>

          {/* 3-step process */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Set a growth profile', sub: 'Not a job description', body: 'Define the skills trajectory you need, not keywords to keyword-match against.' },
              { step: '02', title: 'We surface candidates silently', sub: 'No noise, no spam', body: 'Only aligned trajectories appear. Unqualified hundreds never reach your inbox.' },
              { step: '03', title: 'Reach out at the right moment', sub: "Before they\'re Open to Work", body: "We flag trajectory alignment before they update LinkedIn — so you're first, not 847th." },
            ].map((item) => (
              <div key={item.step} className="bg-white/[0.03] border border-white/10 hover:border-blue-400/30 rounded-2xl p-8 transition-colors duration-300">
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
      <section className="py-24 px-6 bg-[#080d18]">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-16">
            <span className="text-xs text-purple-400 font-black uppercase tracking-widest border border-purple-400/30 px-3 py-1 rounded-full">System Architecture</span>
            <h2 className="text-4xl lg:text-5xl font-black text-white mt-6 mb-4">
              Not a job board. Not an ATS.
              <span className="block text-white/30">The connective tissue between them.</span>
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto">
              Career OS is the layer existing tools were never designed to be:
              continuous, bilateral, and intelligent across a 40-year horizon.
            </p>
          </div>

          {/* Central OS node */}
          <div className="flex justify-center mb-12">
            <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-2xl px-12 py-6 text-center">
              <div className="text-4xl mb-2">⚙️</div>
              <div className="text-white font-black text-xl">Career OS</div>
              <div className="text-white/30 text-xs mt-1">Intelligence Layer · 40-Year Horizon</div>
            </div>
          </div>

          {/* 2×2 integration grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: '⚡',
                title: 'Auto-Updating Career Evidence',
                sub: 'Living Portfolio Sync',
                body: 'Connects to GitHub commits, deployments, and certifications. Every skill gained is logged automatically — no manual updating, no outdated CV.',
                badges: ['GitHub', 'Vercel', 'Coursera', 'AWS Certs'],
                color: 'emerald',
              },
              {
                icon: '📅',
                title: 'Career Moments, Not Job Alerts',
                sub: 'Calendar Intelligence',
                body: 'Knows when your skills are becoming market-rare, or when a trajectory shift costs 3 years vs. 6 months. Proactive signals — not reactive job pings.',
                badges: ['Google Calendar', 'Outlook', 'Workday'],
                color: 'blue',
              },
              {
                icon: '🔗',
                title: "Plays Well With What You Already Use",
                sub: 'ATS Bridge (Enterprise)',
                body: 'Career OS feeds your existing ATS richer signal. Pre-qualified candidates arrive at Greenhouse with verified evidence scores — not just a PDF.',
                badges: ['Greenhouse', 'Lever', 'Workday', 'SAP'],
                color: 'purple',
              },
              {
                icon: '🎓',
                title: 'Real Graduate ROI — Not Survey Data',
                sub: 'University Outcome Loop',
                body: 'Anonymised cohort outcomes at 1, 3, and 10 years post-graduation. Actual career trajectories — letting curriculum teams fix the gaps that matter.',
                badges: ['100+ institutions · Malaysia'],
                color: 'orange',
              },
            ].map((card) => (
              <div key={card.title} className="group bg-white/[0.03] border border-white/10 hover:border-purple-400/30 rounded-2xl p-8 transition-all duration-300 hover:bg-white/[0.05]">
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
            <div className="bg-gradient-to-br from-slate-900 to-[#0d1117] border border-white/10 rounded-2xl p-8">
              <span className="text-xs text-purple-400 font-black uppercase tracking-widest block mb-4">🔒 Privacy Architecture</span>
              <h3 className="text-2xl font-black text-white mb-2">
                Looking while employed?
                <span className="block text-white/40 font-bold text-xl mt-1">We built this for you.</span>
              </h3>
              <p className="text-white/40 text-sm leading-relaxed mb-6">
                84% of employed professionals explore opportunities silently.
                Stealth Mode was designed from day one — not as an afterthought.
              </p>
              <div className="space-y-3">
                {[
                  'Current employer is auto-blocked. Always.',
                  'No suspicious "profile view" activity signals',
                  'Visibility toggled per company — not platform-wide',
                  'Delete everything, instantly. Zero data retention.',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3">
                    <span className="text-purple-400 font-black text-lg">→</span>
                    <span className="text-white/60 text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fair Pay Engine */}
            <div className="bg-gradient-to-br from-[#0d1a0d] to-[#0d1117] border border-emerald-400/20 rounded-2xl p-8">
              <span className="text-xs text-emerald-400 font-black uppercase tracking-widest block mb-4">💰 Fair Pay Engine · 10,000+ Employer Network</span>
              <h3 className="text-2xl font-black text-white mb-2">
                The salary range they gave you
                <span className="block text-emerald-400">isn't real. This is.</span>
              </h3>
              <p className="text-white/40 text-sm leading-relaxed mb-6">
                Live compensation data from 10,000+ active employers — MNCs, GLCs, large locals, tech/SaaS.
                No surveys. Actual offer data.
              </p>

              {/* Salary bars */}
              <div className="bg-black/30 rounded-xl p-5 mb-6">
                <div className="text-xs text-white/30 mb-4 font-bold">Senior SWE · Singapore · 5 YOE · Real-time</div>
                {[
                  { label: 'P25  Low offer',  value: 'SGD 130k/yr', width: '52%', color: 'bg-red-400' },
                  { label: 'P50  Median',     value: 'SGD 165k/yr', width: '66%', color: 'bg-yellow-400' },
                  { label: 'P90  Top offer',  value: 'SGD 240k/yr', width: '96%', color: 'bg-emerald-400' },
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
                  <div key={f} className="text-xs px-3 py-2 bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 rounded-lg font-bold text-center leading-snug">
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom CTA — try the demo */}
          <div className="text-center border border-white/10 rounded-2xl p-12 bg-white/[0.02]">
            <div className="text-xs text-white/30 font-black uppercase tracking-widest mb-4">
              🏆 Talentbank Tech Hackathon 2026 · Universities Track · Module 03
            </div>
            <h3 className="text-3xl font-black text-white mb-4">
              See it working on a real profile
            </h3>
            <p className="text-white/40 mb-8 max-w-md mx-auto">
              Three real professionals. Real salary journeys. Real trade-offs.
              No prediction — just navigation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowPersonas(true)}
                className="px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm rounded-xl transition-all duration-200 hover:scale-105"
              >
                🎓 View Live Demo →
              </button>
              <button
                onClick={onBuildOwn}
                className="px-10 py-4 border border-white/20 hover:border-emerald-400/40 text-white font-bold text-sm rounded-xl transition-all duration-200 hover:bg-white/5"
              >
                Build My Own Profile →
              </button>
            </div>
            <p className="text-xs text-white/20 mt-6">No account needed · Free · Powered by Claude AI</p>
          </div>
        </div>
      </section>

    </div>
  );
}
