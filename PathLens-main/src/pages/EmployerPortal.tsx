import { useState } from 'react';

interface Props {
  onBuildOwn: () => void;
  onBack: () => void;
}

const MODULES = [
  {
    num: '01',
    title: 'Smart Talent Matching',
    tagline: "What if hiring read where someone is heading, not just where they've been?",
    description:
      "Hiring usually screens for the last job someone did, not where they're trying to go. This module looks at both — the candidate's actual trajectory and what the role would set them up for next — then surfaces the matches that work for both sides.",
  },
  {
    num: '02',
    title: 'Talent Retention Signals',
    tagline: 'Why do employers only find out someone is leaving when the resignation letter lands?',
    description:
      "By the time someone hands in their notice, they've usually been mentally gone for months. This module picks up on the quieter signals beforehand — drops in activity, peers leaving for similar companies, profile updates — and lets managers have the conversation while there's still time to keep the person.",
  },
  {
    num: '03',
    title: 'Talent Re-Engagement',
    tagline: 'What if "no" today became "yes" in two years?',
    description:
      "Companies invest a lot to find good candidates and then lose touch the moment someone says no. This module keeps a light, opt-in connection going — so when the right role opens up later, you're not starting from scratch with a cold message.",
  },
  {
    num: '04',
    title: 'Onboarding Success Predictor',
    tagline: 'Why do some new hires thrive while others quietly leave in 6 months?',
    description:
      "Most of the reasons a new hire ends up leaving were actively showing up in the first 60 days, but managers usually only spot them in hindsight. This module flags the early signs — who's struggling, who's disengaging, who's getting the support they need — so something can actually be done about it before they leave during the probation period.",
  },
  {
    num: '05',
    title: 'Workforce Resilience Planner',
    tagline: "What's your hiring plan when the working-age population shrinks?",
    description:
      "A lot of countries in Asia are about to have fewer working-age people each year, for decades. Most companies aren't planning for it. This module helps you think through what your workforce looks like in 10, 20, 30 years, across people you hire, people you keep longer, AI doing parts of the work, and migration filling gaps.",
  },
  {
    num: '06',
    title: 'Your Own Track',
    tagline: "Employers face problems we haven't named.",
    description: '',
    isWildcard: true,
  },
];

function ModuleCard({
  mod,
  expanded,
  onToggle,
}: {
  mod: typeof MODULES[0];
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`bg-white rounded-xl border p-6 flex flex-col ${
        mod.isWildcard ? 'border-amber-200' : 'border-stone-200'
      }`}
    >
      {/* Card top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 pr-3">
          <div className={`text-xs font-semibold mb-1 ${mod.isWildcard ? 'text-amber-500' : 'text-stone-400'}`}>
            {mod.num}
          </div>
          <h3 className={`font-bold text-[15px] leading-snug ${mod.isWildcard ? 'text-amber-600' : 'text-stone-900'}`}>
            {mod.title}
          </h3>
        </div>
        <button
          onClick={onToggle}
          aria-label={expanded ? 'Collapse' : 'Expand'}
          className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-600 rounded-md text-xs font-black transition-colors"
        >
          {expanded ? '∧' : '∨'}
        </button>
      </div>

      {/* Tagline row */}
      <div className="border-t border-b border-stone-100 py-3 mb-3">
        <p className={`text-[13px] italic leading-relaxed ${mod.isWildcard ? 'text-amber-600' : 'text-stone-500'}`}>
          {mod.tagline}
        </p>
      </div>

      {/* Description (shown when expanded) */}
      {expanded && mod.description && (
        <p className="text-[13px] text-stone-600 leading-relaxed">{mod.description}</p>
      )}
    </div>
  );
}

export function EmployerPortal({ onBuildOwn, onBack }: Props) {
  const [expanded, setExpanded] = useState<boolean[]>(MODULES.map(m => !m.isWildcard));

  const toggle = (i: number) => setExpanded(prev => prev.map((v, j) => (j === i ? !v : v)));

  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* ── Dark header ──────────────────────────────────────────── */}
      <div className="bg-[#06090f] border-b border-white/8">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-5">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/40 hover:text-white text-sm font-bold transition-colors duration-200"
          >
            ← Home
          </button>
          <div className="h-4 w-px bg-white/15" />
          <div className="flex items-center gap-3">
            <span className="text-xl">🏢</span>
            <div>
              <div className="text-xs text-blue-400 font-black uppercase tracking-widest leading-none mb-0.5">
                Recruiter Dashboard
              </div>
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

      {/* ── Module showcase (light) ──────────────────────────────── */}
      <div className="bg-[#f5f4f0]">
        <div className="max-w-5xl mx-auto px-6 pt-14 pb-6">
          <div className="flex items-center justify-between mb-7">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
              For Employers
            </span>
            <span className="text-xs text-stone-400 font-bold uppercase tracking-widest">
              5 Modules + 1 Wildcard
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-stone-900 leading-tight">
            Five modules for the hiring side.
          </h2>
        </div>

        <div className="max-w-5xl mx-auto px-6 pb-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {MODULES.map((mod, i) => (
              <ModuleCard
                key={mod.num}
                mod={mod}
                expanded={expanded[i]}
                onToggle={() => toggle(i)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <div className="bg-[#060b14] py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="border border-blue-500/20 rounded-2xl p-10 bg-blue-500/5">
            <div className="text-xs text-white/30 font-black uppercase tracking-widest mb-4">
              🏆 Talentbank Tech Hackathon 2026 · Employer Track
            </div>
            <h3 className="text-3xl font-black text-white mb-4">Ready to spot signal, not sort noise?</h3>
            <p className="text-white/40 mb-8">
              Join 10,000+ Malaysian employers already reducing cost-per-hire with trajectory-based scouting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onBuildOwn}
                className="px-10 py-4 bg-blue-500 hover:bg-blue-400 text-white font-black text-sm rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/25"
              >
                🏢 Start Silent Scouting →
              </button>
              <button className="px-10 py-4 border border-white/20 hover:border-blue-400/40 text-white font-bold text-sm rounded-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/5">
                See Case Studies →
              </button>
            </div>
            <p className="text-xs text-white/20 mt-5">10,000+ employers · PDPA compliant · Malaysia data residency</p>
          </div>
        </div>
      </div>
    </div>
  );
}
