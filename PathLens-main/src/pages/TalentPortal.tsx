import { useState } from 'react';
import { StudentProfile } from '../types/evidence';
import { priyaSharmaProfile, kaiChenProfile, aishaPatelProfile } from '../data/mockStudent';

interface Props {
  onViewDemo: (profile: StudentProfile) => void;
  onBuildOwn: () => void;
  onBack: () => void;
}

const DEMO_PERSONAS = [
  { profile: priyaSharmaProfile, emoji: '🚀', role: 'Senior SWE', company: 'Grab · KL', salary: 'MYR 45,000/mo' },
  { profile: kaiChenProfile,     emoji: '📊', role: 'Senior Data Eng', company: 'ByteDance · SG', salary: 'MYR 38,000/mo' },
  { profile: aishaPatelProfile,  emoji: '📈', role: 'Senior PM', company: 'Lazada · Malaysia', salary: 'MYR 28,000/mo' },
];

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

function TalentContent({ onViewDemo, onBuildOwn }: { onViewDemo: (p: StudentProfile) => void; onBuildOwn: () => void }) {
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
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

export function TalentPortal({ onViewDemo, onBuildOwn, onBack }: Props) {
  return (
    <div className="bg-[#0a0f1e] min-h-screen text-white overflow-x-hidden">
      {/* Page header */}
      <div className="border-b border-white/8 bg-[#06090f]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center gap-5">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/30 hover:text-white text-sm font-bold transition-colors duration-200"
          >
            ← Home
          </button>
          <div className="h-4 w-px bg-white/15" />
          <div className="flex items-center gap-3">
            <span className="text-xl">🧑‍💻</span>
            <div>
              <div className="text-xs text-emerald-400 font-black uppercase tracking-widest leading-none mb-0.5">Talent OS</div>
              <div className="text-white font-black text-sm leading-none">Career Intelligence for Candidates</div>
            </div>
          </div>
          <div className="ml-auto">
            <span className="text-xs bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 px-3 py-1 rounded-full font-bold">
              Malaysia &amp; Asia Pacific
            </span>
          </div>
        </div>
      </div>

      <TalentContent onViewDemo={onViewDemo} onBuildOwn={onBuildOwn} />
    </div>
  );
}
