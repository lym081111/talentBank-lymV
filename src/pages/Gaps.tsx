import { useState } from 'react';
import { Gap, NextAction } from '../types/evidence';

interface Props {
  gaps: Gap[];
  onViewCohort: () => void;
  onUpdateEvidence?: () => void;
}

// ─── helpers ────────────────────────────────────────────────────────────────
function minN(s: string) { const m = s.match(/(\d+)/); return m ? parseInt(m[1]) : 99; }

function sortedByImpact(gaps: Gap[]) {
  return [...gaps].sort((a, b) => b.dimensionWeight - a.dimensionWeight);
}

function quickWinAction(gaps: Gap[]): { gap: Gap; action: NextAction } | null {
  let best: { gap: Gap; action: NextAction; score: number } | null = null;
  for (const gap of gaps) {
    for (const action of gap.nextActions) {
      const composite = (minN(action.timeline) + minN(action.effort) * 0.1) / (gap.dimensionWeight * 10);
      if (!best || composite < best.score) best = { gap, action, score: composite };
    }
  }
  return best;
}

const DIM_ICON: Record<string, string> = {
  'Technical Depth': '🔧', 'Portfolio Strength': '📂',
  'Work Readiness': '💼', 'Communication': '💬',
  'Production Mindset': '⚙️', 'Role Fit': '🎯',
};

const DIM_MYR: Record<string, string> = {
  'Technical Depth': '+MYR 5,300/mo',    'Portfolio Strength': '+MYR 4,300/mo',
  'Work Readiness': '+MYR 3,800/mo',     'Communication': '+MYR 4,700/mo',
  'Production Mindset': '+MYR 6,700/mo', 'Role Fit': '+MYR 5,200/mo',
};

// one-sentence plain-English explanation of why each dimension matters
const DIM_PLAIN: Record<string, string> = {
  'Technical Depth':    'Employers screen for this in every technical interview. Without it, you get filtered before the first call.',
  'Portfolio Strength': 'Recruiters check GitHub before they read your CV. No deployed projects = no shortlist.',
  'Work Readiness':     'Companies want proof you've worked in a real team. Internship experience is the fastest way to show this.',
  'Communication':      'Strong communicators get promoted faster and earn more. Your writing and documentation signal this.',
  'Production Mindset': 'CI/CD and testing are table-stakes at any tech company. Missing this blocks you at the first technical screen.',
  'Role Fit':           'If your skills don't match the role's stack, you won't pass automated filtering — even with a great portfolio.',
};

// ─── sub-components ──────────────────────────────────────────────────────────

function ScoreBar({ score, target = 75 }: { score: number; target?: number }) {
  const color = score >= target ? '#34d399' : score >= 55 ? '#fbbf24' : '#f87171';
  return (
    <div className="relative h-2 bg-white/10 rounded-full overflow-visible">
      <div
        className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
        style={{ width: `${score}%`, background: color }}
      />
      {/* target marker */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-white/40 rounded"
        style={{ left: `${target}%` }}
      />
    </div>
  );
}

function GapCard({
  gap, rank, isExpanded, onToggle,
}: {
  gap: Gap; rank: number; isExpanded: boolean; onToggle: () => void;
}) {
  const isBlocking = gap.score < 40;
  const topAction = gap.nextActions[0];

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        rank === 0
          ? 'border-fuchsia-500/40 bg-gradient-to-br from-fuchsia-500/8 to-cyan-500/8'
          : 'border-white/10 bg-white/[0.03]'
      }`}
    >
      {/* ── Card header — always visible ─────────────────────────── */}
      <button
        className="w-full text-left p-5 hover:bg-white/[0.03] transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-start gap-4">
          {/* Priority badge */}
          <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg border ${
            rank === 0
              ? 'bg-fuchsia-500/20 border-fuchsia-500/40 text-fuchsia-400'
              : 'bg-white/5 border-white/10 text-white/40'
          }`}>
            {rank === 0 ? '①' : rank === 1 ? '②' : rank === 2 ? '③' : `${rank + 1}`}
          </div>

          <div className="flex-1 min-w-0">
            {/* Title row */}
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-white font-black text-base">
                {DIM_ICON[gap.dimension] ?? '📊'} {gap.dimension}
              </span>
              {isBlocking && (
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  🔴 BLOCKING
                </span>
              )}
              {rank === 0 && (
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30">
                  Fix this first
                </span>
              )}
            </div>

            {/* One-sentence plain explanation */}
            <p className="text-white/50 text-sm leading-relaxed mb-3">
              {DIM_PLAIN[gap.dimension] ?? gap.whyMatters}
            </p>

            {/* Score bar */}
            <div className="flex items-center gap-3">
              <ScoreBar score={gap.score} />
              <span className={`text-xs font-black flex-shrink-0 ${
                gap.score >= 75 ? 'text-emerald-400' : gap.score >= 55 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {gap.score}/100
              </span>
              <span className="text-white/20 text-xs flex-shrink-0">
                need 75
              </span>
            </div>
          </div>

          {/* Right meta */}
          <div className="flex-shrink-0 text-right">
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400 font-black text-sm">
              {DIM_MYR[gap.dimension] ?? ''}
            </div>
            <div className="text-white/20 text-xs mt-0.5">salary unlock</div>
            <div className="text-cyan-400 text-xs font-bold mt-2">{gap.projectedImpact}</div>
            <div className="text-white/20 text-xs">score gain</div>
          </div>
        </div>

        {/* ── Collapsed preview: single action ─────────────────── */}
        {!isExpanded && topAction && (
          <div className="mt-4 ml-14 flex items-center gap-3 bg-black/20 rounded-xl px-4 py-3">
            <span className="text-cyan-400 font-black text-xs flex-shrink-0">→ DO THIS:</span>
            <span className="text-white/70 text-xs font-medium truncate">{topAction.title}</span>
            <span className="text-white/30 text-xs flex-shrink-0">{topAction.timeline}</span>
            <span className="ml-auto text-white/20 text-xs">{isExpanded ? '▲' : '▼'} details</span>
          </div>
        )}
        {isExpanded && (
          <div className="mt-2 ml-14 text-right">
            <span className="text-white/20 text-xs">▲ collapse</span>
          </div>
        )}
      </button>

      {/* ── Expanded: full action plan ────────────────────────────── */}
      {isExpanded && (
        <div className="px-5 pb-5 ml-14 border-t border-white/5 pt-4">
          <div className="text-xs font-black text-white/30 uppercase tracking-widest mb-3">
            What to do — in order
          </div>
          <div className="space-y-3">
            {gap.nextActions.map((action, i) => (
              <div
                key={i}
                className={`rounded-xl p-4 border transition-all duration-200 hover:-translate-y-0.5 ${
                  i === 0
                    ? 'bg-cyan-500/8 border-cyan-500/25'
                    : 'bg-white/[0.02] border-white/8'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    {i === 0 && (
                      <span className="text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-black flex-shrink-0">
                        Start here
                      </span>
                    )}
                    <span className="text-white font-bold text-sm">{action.title}</span>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <span className="text-xs bg-white/5 text-white/40 border border-white/10 px-2 py-1 rounded-lg">{action.timeline}</span>
                    <span className="text-xs bg-white/5 text-white/40 border border-white/10 px-2 py-1 rounded-lg">{action.effort}</span>
                  </div>
                </div>
                <p className="text-white/40 text-xs leading-relaxed">{action.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── main page ───────────────────────────────────────────────────────────────

export function Gaps({ gaps, onViewCohort, onUpdateEvidence }: Props) {
  const sorted = sortedByImpact(gaps);
  const qw = quickWinAction(sorted);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0); // first one open by default

  const currentScore = sorted.length > 0
    ? Math.round(sorted.reduce((sum, g) => sum + g.score * g.dimensionWeight, 0))
    : 75;
  const pointsToTarget = Math.max(0, 75 - currentScore);

  // ── empty state ────────────────────────────────────────────────────────────
  if (gaps.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-black text-white mb-3">No gaps to close</h2>
          <p className="text-white/40 mb-8 leading-relaxed">
            You're scoring 75+ across all dimensions. Keep adding evidence and updating your profile as you build new things.
          </p>
          <div className="flex gap-3 justify-center">
            {onUpdateEvidence && (
              <button onClick={onUpdateEvidence}
                className="px-6 py-3 border border-white/20 text-white font-bold rounded-xl hover:-translate-y-0.5 transition-all duration-300 text-sm">
                📝 Add More Evidence
              </button>
            )}
            <button onClick={onViewCohort}
              className="px-6 py-3 bg-emerald-500 text-black font-black rounded-xl hover:-translate-y-0.5 transition-all duration-300 text-sm">
              See Cohort Ranking →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] px-4 py-10 lg:px-8">
      <div className="max-w-3xl mx-auto">

        {/* ── SECTION 1: WHAT THIS PAGE IS ABOUT ─────────────────── */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-black text-fuchsia-400 uppercase tracking-widest border border-fuchsia-400/30 px-3 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full animate-pulse" />
            Paths Forward · Career OS
          </div>

          <h1 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-4">
            You need <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">75+</span> to be internship-ready.
            <span className="block text-white/40 text-2xl mt-1 font-bold">
              Here's exactly what's stopping you.
            </span>
          </h1>

          <p className="text-white/50 text-base leading-relaxed max-w-xl">
            Each gap below is a real blocker between your current profile and a shortlist. They're ranked by how much they impact your score — fix the top one first.
          </p>
        </div>

        {/* ── SECTION 2: SCORE PROGRESS BAR ──────────────────────── */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8">
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="text-white/30 text-xs font-bold uppercase tracking-wider mb-1">Your Overall Readiness</div>
              <div className="text-4xl font-black text-white">{currentScore}<span className="text-white/30 text-xl">/100</span></div>
            </div>
            <div className="text-right">
              <div className="text-white/30 text-xs font-bold uppercase tracking-wider mb-1">Internship-Ready Target</div>
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">75</div>
            </div>
          </div>

          <ScoreBar score={currentScore} target={75} />

          <div className="flex justify-between mt-2">
            <span className="text-white/30 text-xs">0</span>
            <span className={`text-xs font-black ${
              pointsToTarget === 0 ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {pointsToTarget === 0 ? '✓ At target!' : `${pointsToTarget} points to go`}
            </span>
            <span className="text-white/30 text-xs">100</span>
          </div>
        </div>

        {/* ── SECTION 3: QUICK WIN CALLOUT ────────────────────────── */}
        {qw && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 mb-8 flex items-start gap-4">
            <div className="text-2xl flex-shrink-0">⚡</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-1">Fastest win this week</div>
              <div className="text-white font-black text-sm mb-1">{qw.action.title}</div>
              <p className="text-white/50 text-xs leading-relaxed">{qw.action.description}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-lg font-bold">{qw.action.timeline}</span>
                <span className="text-xs bg-white/5 text-white/40 border border-white/10 px-2 py-1 rounded-lg">{qw.action.effort}</span>
                <span className="text-xs bg-white/5 text-white/40 border border-white/10 px-2 py-1 rounded-lg">from: {qw.gap.dimension}</span>
              </div>
            </div>
          </div>
        )}

        {/* ── SECTION 4: GAP LIST — RANKED BY IMPACT ─────────────── */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-5">
            <div className="text-xs font-black text-white/30 uppercase tracking-widest">Your gaps · ranked by impact</div>
            <div className="flex-1 h-px bg-white/8" />
            <div className="text-xs text-white/20">{sorted.length} total</div>
          </div>

          <div className="space-y-3">
            {sorted.map((gap, i) => (
              <GapCard
                key={gap.dimension}
                gap={gap}
                rank={i}
                isExpanded={expandedIdx === i}
                onToggle={() => setExpandedIdx(expandedIdx === i ? null : i)}
              />
            ))}
          </div>
        </div>

        {/* ── SECTION 5: WHAT TO DO NEXT ──────────────────────────── */}
        <div className="mt-10 bg-white/[0.02] border border-white/8 rounded-2xl p-6">
          <div className="text-xs font-black text-white/30 uppercase tracking-widest mb-5">After you close these gaps</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {[
              { step: '1', text: 'Pick the top gap', sub: 'Start with rank ①', color: 'fuchsia' },
              { step: '2', text: 'Do the first action', sub: 'Add it as evidence', color: 'cyan' },
              { step: '3', text: 'Re-run your score', sub: 'Watch dimensions shift', color: 'emerald' },
            ].map((s) => (
              <div key={s.step} className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
                <div className={`text-2xl font-black mb-1 text-transparent bg-clip-text ${
                  s.color === 'fuchsia' ? 'bg-gradient-to-r from-fuchsia-500 to-fuchsia-400' :
                  s.color === 'cyan'    ? 'bg-gradient-to-r from-cyan-500 to-cyan-400' :
                  'bg-gradient-to-r from-emerald-500 to-emerald-400'
                }`}>{s.step}</div>
                <div className="text-white font-bold text-sm">{s.text}</div>
                <div className="text-white/30 text-xs mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 flex-wrap">
            {onUpdateEvidence && (
              <button
                onClick={onUpdateEvidence}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-fuchsia-500/15 to-cyan-500/15 border border-fuchsia-500/30 hover:border-fuchsia-500/60 text-fuchsia-400 font-black text-sm rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-fuchsia-500/15"
              >
                📝 Update Evidence & Re-score
              </button>
            )}
            <button
              onClick={onViewCohort}
              className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 hover:border-cyan-500/30 text-white/60 hover:text-cyan-400 font-black text-sm rounded-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              📡 See How You Compare →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
