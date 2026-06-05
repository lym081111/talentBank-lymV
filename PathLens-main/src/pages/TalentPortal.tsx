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

const MODULES = [
  {
    num: '01',
    title: 'Career Path Navigator',
    tagline: 'What would it take to see your realistic next moves, without guessing?',
    description:
      "Looks at what you've done and what the job market actually looks like right now, and shows you a handful of routes you could realistically take from here. It doesn't predict which one is best. It just gives you something more than gut feel to work with.",
  },
  {
    num: '02',
    title: 'Living Portfolio',
    tagline: 'What if your CV updated itself, and was actually true?',
    description:
      "CVs are usually written from memory, the night before applying, by someone tired and stressed. This module keeps a running record of what you actually did and shared: projects, decisions, and things you led, so it's already there when you need it. Switching fields becomes less terrifying because the proof of what you can do is compiled by the platform.",
  },
  {
    num: '03',
    title: 'AI Career Coach',
    tagline: 'What if a senior mentor was watching your back, quietly, for decades?',
    description:
      "Senior mentors are useful but most people don't have access to one. This module is meant to do some of what a mentor does: paying attention to your career over the long run and flagging things you might've missed, like when you're underpaid for what you do, or when a role you'd be good at opens up somewhere.",
  },
  {
    num: '04',
    title: 'Fair Pay Engine',
    tagline: "Are you paid what you're worth, or just what you accepted?",
    description:
      "Most people find out they're underpaid by accident, or never knew how to push back when their boss said no. This module checks your pay against what people in similar roles are actually earning, tells you if there's a gap, and helps you figure out how to bring it up before your next scheduled performance review.",
  },
  {
    num: '05',
    title: 'Life Chapter Designer',
    tagline: 'What if life had room for more than work?',
    description:
      "Career planning usually assumes you just keep working straight through. Real life isn't like that. People take time off for family, for health, to start something, to study again, and then come back. This module helps you plan around those breaks instead of pretending they won't happen.",
  },
  {
    num: '06',
    title: 'Your Own Track',
    tagline: "Candidates have problems we haven't named.",
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

export function TalentPortal({ onViewDemo, onBuildOwn, onBack }: Props) {
  const [expanded, setExpanded] = useState<boolean[]>(MODULES.map(m => !m.isWildcard));
  const [showPersonas, setShowPersonas] = useState(false);

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
            <span className="text-xl">🧑‍💻</span>
            <div>
              <div className="text-xs text-emerald-400 font-black uppercase tracking-widest leading-none mb-0.5">
                Talent OS
              </div>
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

      {/* ── Module showcase (light) ──────────────────────────────── */}
      <div className="bg-[#f5f4f0]">
        <div className="max-w-5xl mx-auto px-6 pt-14 pb-6">
          <div className="flex items-center justify-between mb-7">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-violet-100 text-violet-700 border border-violet-200">
              For Candidates
            </span>
            <span className="text-xs text-stone-400 font-bold uppercase tracking-widest">
              5 Modules + 1 Wildcard
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-stone-900 leading-tight">
            Five modules built around the candidate journey.
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

      {/* ── CTA + Live Demo ─────────────────────────────────────── */}
      <div className="bg-[#0a0f1e] py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="border border-white/10 rounded-2xl p-10 bg-white/[0.02]">
            <div className="text-xs text-white/30 font-black uppercase tracking-widest mb-4">
              🏆 Talentbank Tech Hackathon 2026 · Universities Track
            </div>
            <h3 className="text-3xl font-black text-white mb-4">See it on a real profile</h3>
            <p className="text-white/40 mb-8">
              Three real Malaysian professionals. Real MYR journeys. Real trade-offs.
            </p>

            {!showPersonas ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setShowPersonas(true)}
                  className="px-10 py-4 bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-black font-black text-sm rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-fuchsia-500/25 active:scale-95"
                >
                  🎓 View Live Demo →
                </button>
                <button
                  onClick={onBuildOwn}
                  className="px-10 py-4 border border-white/20 hover:border-fuchsia-400/40 text-white font-bold text-sm rounded-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/5"
                >
                  Build My Own Profile →
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-white/50 font-bold mb-5 uppercase tracking-wider">
                  Choose a real career profile:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                  {DEMO_PERSONAS.map(({ profile, emoji, role, company, salary }) => (
                    <button
                      key={profile.id}
                      onClick={() => onViewDemo(profile)}
                      className="bg-white/5 hover:bg-fuchsia-500/10 border border-white/10 hover:border-fuchsia-400/40 rounded-xl p-4 text-left transition-all duration-300 hover:-translate-y-1 group"
                    >
                      <div className="text-2xl mb-2">{emoji}</div>
                      <div className="text-white font-black text-sm group-hover:text-fuchsia-400 transition-colors">
                        {profile.name}
                      </div>
                      <div className="text-white/40 text-xs mt-1">{role} · {company}</div>
                      <div className="text-emerald-400 text-xs font-bold mt-2">{salary}</div>
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setShowPersonas(false)}
                    className="text-xs text-white/30 hover:text-white/60 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={onBuildOwn}
                    className="text-xs text-fuchsia-400 hover:text-fuchsia-300 font-bold transition-colors"
                  >
                    Or build your own profile →
                  </button>
                </div>
              </div>
            )}

            <p className="text-xs text-white/20 mt-6">No account needed · Free · Powered by Claude AI</p>
          </div>
        </div>
      </div>
    </div>
  );
}
