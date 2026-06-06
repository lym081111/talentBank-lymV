import { Page } from '../types/navigation';
import { CareerOSPortal } from '../components/CareerOSPortal';

interface Props {
  onNavigate: (page: Page) => void;
}

const MILESTONES = [
  { year: 'Year 1', role: 'SWE Intern',     salary: 'MYR 3,500–5,500/mo', skill: 'Python · REST APIs · Git' },
  { year: 'Year 2', role: 'Junior SWE',     salary: 'MYR 6,000–9,000/mo', skill: '+ CI/CD · API ownership' },
  { year: 'Year 4', role: 'Mid SWE',        salary: 'MYR 11,000–18,000/mo', skill: '+ Distributed systems' },
  { year: 'Year 7', role: 'Staff Engineer', salary: 'MYR 22,000+/mo', skill: '+ Cross-team influence' },
];

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/5 border border-white/10 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-white/20 ${className}`}>
      {children}
    </div>
  );
}

export function Landing({ onNavigate }: Props) {
  const scrollToRole = () => document.getElementById('role-selection')?.scrollIntoView({ behavior: 'smooth' });

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
            <div className="hidden">
              <button
                onClick={() => onNavigate('talent-portal')}
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/25 active:scale-95"
              >
                🎓 Map My Career Path →
              </button>
              <button
                onClick={() => onNavigate('employer-portal')}
                className="px-8 py-4 border border-white/20 hover:border-blue-400/50 text-white font-bold text-sm rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 hover:bg-white/5"
              >
                🏢 Scout Without the Noise →
              </button>
            </div>
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
        <button onClick={scrollToRole}
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

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <div className="py-14 px-6 bg-[#080d18]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs text-white/30 font-black uppercase tracking-widest mb-2">How It Works</p>
            <h2 className="text-2xl font-black text-white">Three steps. No résumé spam.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.08] rounded-2xl overflow-hidden">
            {([
              { step: '01', icon: '🧑‍💻', title: 'Build your proof profile', desc: 'Upload your resume. Career OS extracts verified skills, salary signals, and trajectory evidence — no self-reported claims.', color: 'text-emerald-400' },
              { step: '02', icon: '🗺️',  title: 'Career OS maps your trajectory', desc: 'Realistic next moves, trade-off warnings, Fair Pay gap analysis, and 10-year market forecasts — grounded in Malaysian IT data.', color: 'text-cyan-400' },
              { step: '03', icon: '🔍', title: 'Employers scout silently', desc: 'Employers find you by proof, not keyword. No cold applications. No black-box scores. Every match cites its evidence.', color: 'text-blue-400' },
            ] as const).map((s) => (
              <div key={s.step} className="bg-[#080d18] p-7">
                <div className="text-3xl mb-4">{s.icon}</div>
                <div className={`text-xs font-black uppercase tracking-widest mb-2 ${s.color}`}>Step {s.step}</div>
                <h3 className="text-white font-black text-lg leading-snug mb-3">{s.title}</h3>
                <p className="text-white/35 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          {/* Live scouting ticker */}
          <div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.02] px-5 py-3 flex items-center gap-3 overflow-hidden">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <p className="text-xs text-white/30 font-mono truncate">
              <span className="text-emerald-400 font-black">LIVE</span>
              {' '}· Priya Sharma (Platform SWE) scouted by 3 KL employers · Kai Chen's Kafka pipeline proof matched a Data Engineer role at MYR 11,500 · Aisha Patel re-engaged after 5-month gap ↑ PM match 88%
            </p>
          </div>
        </div>
      </div>

      {/* ── CAREER OS INTERACTIVE PORTAL ───────────────────────── */}
      <div className="py-12 px-6 bg-[#0a0f1e]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs text-white/30 font-black uppercase tracking-widest mb-2">Live Interactive Demo</p>
            <h2 className="text-2xl font-black text-white">See Career OS in action</h2>
            <p className="text-white/38 text-sm mt-2">Switch between Talent and Employer views · real Malaysian IT data</p>
          </div>
          <CareerOSPortal onBuildOwn={() => onNavigate('profile')} />
        </div>
      </div>

      {/* ── ROLE SELECTION ──────────────────────────────────────── */}
      <div id="role-selection" className="py-20 px-6 bg-[#080d18]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs text-white/30 font-black uppercase tracking-widest mb-3">Choose Your Path</p>
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
              Who are you here for?
            </h2>
            <p className="text-white/40 max-w-lg mx-auto">
              We've built a dedicated experience for each role. Pick yours to see the full picture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Talent card */}
            <button
              onClick={() => onNavigate('talent-portal')}
              className="group relative text-left bg-white/[0.03] hover:bg-emerald-500/8 border border-white/10 hover:border-emerald-400/40 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10"
            >
              <div className="text-5xl mb-5">🧑‍💻</div>
              <div className="text-xs text-emerald-400 font-black uppercase tracking-widest mb-2">For Talent &amp; Students</div>
              <h3 className="text-white font-black text-xl mb-3 leading-tight">
                Talent OS
                <span className="block text-white/40 text-base font-bold mt-1">Career Intelligence</span>
              </h3>
              <p className="text-white/40 text-sm leading-relaxed mb-6">
                Map your realistic MYR trajectory, close skill gaps, and get found — before you send a résumé.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['MYR Salary Data', 'Trade-off Navigator', 'Gap Analysis', 'Career Paths'].map(t => (
                  <span key={t} className="text-xs px-2 py-1 bg-emerald-400/10 text-emerald-400/70 rounded-md font-semibold border border-emerald-400/15">{t}</span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-black text-sm group-hover:gap-3 transition-all duration-200">
                <span>Explore Talent OS</span>
                <span>→</span>
              </div>
            </button>

            {/* Employer card */}
            <button
              onClick={() => onNavigate('employer-portal')}
              className="group relative text-left bg-white/[0.03] hover:bg-blue-500/8 border border-white/10 hover:border-blue-400/40 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10"
            >
              <div className="text-5xl mb-5">🏢</div>
              <div className="text-xs text-blue-400 font-black uppercase tracking-widest mb-2">For Employers &amp; HR</div>
              <h3 className="text-white font-black text-xl mb-3 leading-tight">
                Recruiter Dashboard
                <span className="block text-white/40 text-base font-bold mt-1">Talent Intelligence</span>
              </h3>
              <p className="text-white/40 text-sm leading-relaxed mb-6">
                Stop sorting noise. Scout verified Malaysian tech trajectories before they go public.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Silent Scouting', 'ATS Integration', 'MYR ROI Calc', 'Attrition Risk'].map(t => (
                  <span key={t} className="text-xs px-2 py-1 bg-blue-400/10 text-blue-400/70 rounded-md font-semibold border border-blue-400/15">{t}</span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-blue-400 font-black text-sm group-hover:gap-3 transition-all duration-200">
                <span>Explore Recruiter Dashboard</span>
                <span>→</span>
              </div>
            </button>
          </div>

          <p className="text-center text-xs text-white/20 mt-8">
            🏆 Talentbank Tech Hackathon 2026 · No account needed · PDPA compliant · Free
          </p>
        </div>
      </div>
    </div>
  );
}
