import { Page } from '../types/navigation';

interface Props {
  onNavigate: (page: Page) => void;
  onBuildOwn: () => void;
}

const MILESTONES = [
  { year: 'Evidence', role: 'Resume proof blocks', detail: 'Projects, internships, certificates' },
  { year: 'Extraction', role: 'Transparent skill parsing', detail: 'Matched phrase + confidence' },
  { year: 'Readiness', role: '6-dimension profile', detail: 'Score, status, why, source' },
  { year: 'Action', role: 'Sprint, brief, intervention', detail: 'Three views from one evidence profile' },
];

const DEMO_STEPS = ['Evidence', 'Skill Signals', 'Readiness Map', 'Blockers', 'Action Sprint', 'Hiring / University Insight'];

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/5 border border-white/10 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-white/20 ${className}`}>
      {children}
    </div>
  );
}

export function Landing({ onNavigate, onBuildOwn }: Props) {
  const scrollToRole = () => document.getElementById('role-selection')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="bg-[#0a0f1e] min-h-screen text-white overflow-x-hidden">
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '60px 60px' }}
        />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-emerald-400 text-xs font-black tracking-widest uppercase mb-8 border border-emerald-400/30 px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Adaptive Readiness Profile - Universities Module 03
            </span>

            <h1 className="text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight mb-6">
              Turn student evidence
              <span className="block text-emerald-400">into career readiness.</span>
            </h1>

            <p className="text-lg text-white/60 leading-relaxed mb-4 max-w-xl">
              PathLens turns projects, internships, certificates, and resumes into one transparent readiness profile. The same evidence powers Talent, Employer, and University views.
            </p>
            <p className="text-base text-emerald-200/90 leading-relaxed mb-5 max-w-xl font-bold">
              Not a prediction engine. PathLens makes readiness visible from student evidence.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7 max-w-xl">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="text-xs text-emerald-300 font-black uppercase tracking-[0.16em] mb-2">Student value</div>
                <p className="text-sm text-white/55 leading-relaxed">See what to improve next and how to turn evidence into applications.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="text-xs text-cyan-300 font-black uppercase tracking-[0.16em] mb-2">University value</div>
                <p className="text-sm text-white/55 leading-relaxed">Spot cohort-level gaps early and run targeted interventions before application season.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7 max-w-xl">
              <div>
                <button
                  onClick={() => onNavigate('talent-portal')}
                  className="w-full px-7 py-4 bg-emerald-400 hover:bg-emerald-300 text-black font-black text-sm rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/25 active:scale-95"
                >
                  Try the 2-minute demo
                </button>
                <p className="mt-2 text-xs text-white/35 leading-relaxed">Pick a sample candidate and move through the full judge flow without typing anything.</p>
              </div>
              <div>
                <button
                  onClick={onBuildOwn}
                  className="w-full px-7 py-4 border border-white/20 hover:border-cyan-300/60 text-white font-black text-sm rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10 hover:bg-white/5"
                >
                  Build your own profile
                </button>
                <p className="mt-2 text-xs text-white/35 leading-relaxed">Start from a blank profile and enter your own evidence. No demo identity is carried over.</p>
              </div>
            </div>

            <div className="mb-7 max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-[11px] text-white/35 font-black uppercase tracking-[0.18em] mb-3">2-minute judge flow</div>
              <div className="flex flex-wrap items-center gap-2">
                {DEMO_STEPS.map((step, index) => (
                  <div key={step} className="flex items-center gap-2">
                    <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-[11px] font-black text-emerald-100">{step}</span>
                    {index < DEMO_STEPS.length - 1 && <span className="text-white/20">-&gt;</span>}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-white/20 font-semibold tracking-wide">
              transparent evidence extraction + AI-assisted explanation - deterministic scoring - no black-box career prediction
            </p>
          </div>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs text-emerald-400 font-black uppercase tracking-widest">Scope map</p>
              <span className="text-xs bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 px-2 py-1 rounded-full font-bold">Stage 1</span>
            </div>
            <div className="relative pl-6">
              <div className="absolute left-1.5 top-2 bottom-2 w-px bg-gradient-to-b from-emerald-400 via-blue-400 to-blue-400/20" />
              <div className="space-y-6">
                {MILESTONES.map((m, i) => (
                  <div key={m.year} className="relative">
                    <div className={`absolute -left-[22px] top-1.5 w-3 h-3 rounded-full border-2 border-[#0a0f1e] ${i === 0 ? 'bg-emerald-400' : i === MILESTONES.length - 1 ? 'bg-blue-400' : 'bg-white/40'}`} />
                    <div className="text-xs text-white/30 font-bold mb-0.5">{m.year}</div>
                    <div className="font-black text-white text-sm">{m.role}</div>
                    <div className="text-white/30 text-xs mt-0.5">{m.detail}</div>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-5 text-xs text-white/25 italic border-t border-white/10 pt-4">
              Stage 1 prototype - frontend only, localStorage persistence. Application targets and cohort data are seeded mocks showing the shared evidence pattern.
            </p>
          </Card>
        </div>

        <button
          onClick={scrollToRole}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 hover:text-emerald-400 transition-colors duration-300 group z-10"
        >
          <span className="text-xs font-bold uppercase tracking-widest">Explore</span>
          <div className="w-6 h-10 border-2 border-white/20 group-hover:border-emerald-400/50 rounded-full flex items-start justify-center pt-1.5 transition-colors duration-300">
            <div className="w-1 h-2 bg-white/40 group-hover:bg-emerald-400 rounded-full animate-bounce transition-colors duration-300" />
          </div>
        </button>
      </section>

      <div className="border-y border-white/10 bg-white/[0.02] py-5">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { num: '1 engine', label: 'shared evidence profile' },
            { num: '3 views', label: 'talent, employer, university' },
            { num: '34 skills', label: 'tracked across Malaysia tech' },
            { num: '100%', label: 'explainable scoring trail' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-black text-white">{s.num}</div>
              <div className="text-xs text-white/30 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div id="role-selection" className="py-20 px-6 bg-[#080d18]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs text-white/30 font-black uppercase tracking-widest mb-3">Choose Your View</p>
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">Same evidence, different question.</h2>
            <p className="text-white/40 max-w-2xl mx-auto">Talent gets the full workspace. Employer and University get lightweight readouts from the same profile.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => onNavigate('talent-portal')}
              className="group relative text-left bg-white/[0.03] hover:bg-emerald-500/8 border border-white/10 hover:border-emerald-400/40 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10"
            >
              <div className="text-xs text-emerald-400 font-black uppercase tracking-widest mb-2">For Talent & Students</div>
              <h3 className="text-white font-black text-xl mb-3 leading-tight">
                Talent View
                <span className="block text-white/40 text-base font-bold mt-1">Full interactive workspace</span>
              </h3>
              <p className="text-white/40 text-sm leading-relaxed mb-6">What should I improve next, and how do I turn my evidence into applications?</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Evidence pages', 'Readiness audit', 'Gap plan', 'Application pack'].map(t => (
                  <span key={t} className="text-xs px-2 py-1 bg-emerald-400/10 text-emerald-400/70 rounded-md font-semibold border border-emerald-400/15">{t}</span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-black text-sm group-hover:gap-3 transition-all duration-200">
                <span>Open Talent View</span>
                <span>-&gt;</span>
              </div>
            </button>

            <button
              onClick={() => onNavigate('employer-portal')}
              className="group relative text-left bg-white/[0.03] hover:bg-blue-500/8 border border-white/10 hover:border-blue-400/40 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10"
            >
              <div className="text-xs text-blue-400 font-black uppercase tracking-widest mb-2">For Employers</div>
              <h3 className="text-white font-black text-xl mb-3 leading-tight">
                Employer View
                <span className="block text-white/40 text-base font-bold mt-1">Evidence-backed hiring brief</span>
              </h3>
              <p className="text-white/40 text-sm leading-relaxed mb-6">Should I shortlist this candidate, and what should I ask in interview?</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Shortlist signal', 'Interview probes', 'Source trail', 'No ATS'].map(t => (
                  <span key={t} className="text-xs px-2 py-1 bg-blue-400/10 text-blue-400/70 rounded-md font-semibold border border-blue-400/15">{t}</span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-blue-400 font-black text-sm group-hover:gap-3 transition-all duration-200">
                <span>Open Employer View</span>
                <span>-&gt;</span>
              </div>
            </button>

            <button
              onClick={() => onNavigate('cohort')}
              className="group relative text-left bg-white/[0.03] hover:bg-cyan-500/8 border border-white/10 hover:border-cyan-400/40 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10"
            >
              <div className="text-xs text-cyan-400 font-black uppercase tracking-widest mb-2">For Universities</div>
              <h3 className="text-white font-black text-xl mb-3 leading-tight">
                University View
                <span className="block text-white/40 text-base font-bold mt-1">Cohort intervention board</span>
              </h3>
              <p className="text-white/40 text-sm leading-relaxed mb-6">Which cohort gaps need intervention, who owns them, and how do we measure movement?</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Top gaps', 'Interventions', 'Owners', 'Measures'].map(t => (
                  <span key={t} className="text-xs px-2 py-1 bg-cyan-400/10 text-cyan-400/70 rounded-md font-semibold border border-cyan-400/15">{t}</span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-cyan-400 font-black text-sm group-hover:gap-3 transition-all duration-200">
                <span>Open University View</span>
                <span>-&gt;</span>
              </div>
            </button>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={onBuildOwn}
              className="text-sm font-black text-white/55 hover:text-white underline underline-offset-4"
            >
              Build a blank profile with your own evidence
            </button>
          </div>

          <p className="text-center text-xs text-white/20 mt-8">
            Talentbank Tech Hackathon 2026 - Stage 1 prototype - Universities Module 03 - Shared evidence views
          </p>
        </div>
      </div>
    </div>
  );
}
