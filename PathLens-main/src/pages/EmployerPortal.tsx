import { useState } from 'react';

interface Props {
  onBuildOwn: () => void;
  onBack: () => void;
}

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

function EmployerContent({ onBuildOwn }: { onBuildOwn: () => void }) {
  const [scoutQuery, setScoutQuery] = useState('');

  return (
    <>
      {/* ── E1: PAIN POINT + HERO ─────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#060b14]">
        <div className="max-w-6xl mx-auto">

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

              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { label: 'Cost-per-hire', before: 'MYR 12,000', after: 'MYR 3,500', delta: '−71%', color: 'rose' },
                  { label: 'Time-to-hire',  before: '45 days',    after: '11 days',    delta: '−76%', color: 'emerald' },
                  { label: 'Signal ratio',  before: '1 in 847',   after: '1 in 12',    delta: '+12×',  color: 'blue' },
                  { label: 'AI spam rate',  before: '62% of CVs', after: '0%',         delta: '−100%', color: 'fuchsia' },
                ].map((r) => (
                  <div key={r.label} className="bg-white/5 border border-white/10 rounded-xl p-4 transition-all duration-300 hover:-translate-y-1">
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

export function EmployerPortal({ onBuildOwn, onBack }: Props) {
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
            <span className="text-xl">🏢</span>
            <div>
              <div className="text-xs text-blue-400 font-black uppercase tracking-widest leading-none mb-0.5">Recruiter Dashboard</div>
              <div className="text-white font-black text-sm leading-none">Talent Intelligence for Employers</div>
            </div>
          </div>
          <div className="ml-auto">
            <span className="text-xs bg-blue-400/10 text-blue-400 border border-blue-400/20 px-3 py-1 rounded-full font-bold">
              Malaysia Market
            </span>
          </div>
        </div>
      </div>

      <EmployerContent onBuildOwn={onBuildOwn} />
    </div>
  );
}
