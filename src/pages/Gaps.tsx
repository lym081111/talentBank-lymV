import { useState } from 'react';
import { Gap, NextAction } from '../types/evidence';

interface Props {
  gaps: Gap[];
  onViewCohort: () => void;
  onUpdateEvidence?: () => void;
}

function findQuickWin(gaps: Gap[]): { gap: Gap; action: NextAction } | null {
  if (gaps.length === 0) return null;
  const minN = (s: string) => { const m = s.match(/(\d+)/); return m ? parseInt(m[1]) : 99; };
  let best: { gap: Gap; action: NextAction; score: number } | null = null;
  for (const gap of gaps) {
    for (const action of gap.nextActions) {
      const composite = (minN(action.timeline) + minN(action.effort) * 0.1) / (gap.dimensionWeight * 10);
      if (!best || composite < best.score) best = { gap, action, score: composite };
    }
  }
  return best ? { gap: best.gap, action: best.action } : null;
}

// MYR salary lookup per dimension
const DIM_SALARY: Record<string, { current: string; unlocked: string; delta: string; myrMonth: string }> = {
  'Technical Depth':    { current: 'MYR 4,500', unlocked: 'MYR 9,800',  delta: '+MYR 5,300/mo', myrMonth: 'MYR 9,800' },
  'Portfolio Strength': { current: 'MYR 4,200', unlocked: 'MYR 8,500',  delta: '+MYR 4,300/mo', myrMonth: 'MYR 8,500' },
  'Work Readiness':     { current: 'MYR 4,000', unlocked: 'MYR 7,800',  delta: '+MYR 3,800/mo', myrMonth: 'MYR 7,800' },
  'Communication':      { current: 'MYR 4,500', unlocked: 'MYR 9,200',  delta: '+MYR 4,700/mo', myrMonth: 'MYR 9,200' },
  'Production Mindset': { current: 'MYR 4,800', unlocked: 'MYR 11,500', delta: '+MYR 6,700/mo', myrMonth: 'MYR 11,500' },
  'Role Fit':           { current: 'MYR 5,000', unlocked: 'MYR 10,200', delta: '+MYR 5,200/mo', myrMonth: 'MYR 10,200' },
};

// Skill requirements per dimension
const DIM_SKILLS: Record<string, { skill: string; yours: number; required: number; status: 'gap' | 'match' | 'strong' }[]> = {
  'Technical Depth':    [
    { skill: 'System Design',   yours: 38, required: 75, status: 'gap' },
    { skill: 'Data Structures', yours: 62, required: 75, status: 'gap' },
    { skill: 'APIs & REST',     yours: 71, required: 70, status: 'match' },
    { skill: 'Cloud (AWS/GCP)', yours: 25, required: 65, status: 'gap' },
  ],
  'Portfolio Strength': [
    { skill: 'Deployed Projects', yours: 40, required: 80, status: 'gap' },
    { skill: 'GitHub Activity',   yours: 65, required: 75, status: 'gap' },
    { skill: 'Documentation',     yours: 55, required: 70, status: 'gap' },
    { skill: 'Live Demo URLs',    yours: 30, required: 80, status: 'gap' },
  ],
  'Work Readiness': [
    { skill: 'Internship Exp.',  yours: 45, required: 70, status: 'gap' },
    { skill: 'Team Collab.',     yours: 72, required: 75, status: 'gap' },
    { skill: 'Agile/Scrum',     yours: 55, required: 65, status: 'gap' },
    { skill: 'Code Review',      yours: 40, required: 70, status: 'gap' },
  ],
  'Communication': [
    { skill: 'Tech Writing',    yours: 80, required: 70, status: 'strong' },
    { skill: 'Presentation',    yours: 75, required: 70, status: 'strong' },
    { skill: 'Stakeholder Mgmt',yours: 60, required: 65, status: 'gap' },
    { skill: 'Documentation',   yours: 82, required: 75, status: 'strong' },
  ],
  'Production Mindset': [
    { skill: 'CI/CD Pipelines', yours: 20, required: 70, status: 'gap' },
    { skill: 'Testing (Unit)',   yours: 30, required: 75, status: 'gap' },
    { skill: 'Monitoring',       yours: 15, required: 60, status: 'gap' },
    { skill: 'Docker/Containers',yours: 22, required: 65, status: 'gap' },
  ],
  'Role Fit': [
    { skill: 'Domain Knowledge', yours: 55, required: 70, status: 'gap' },
    { skill: 'Industry Context', yours: 60, required: 65, status: 'gap' },
    { skill: 'Target Stack',     yours: 70, required: 75, status: 'gap' },
    { skill: 'Market Awareness', yours: 65, required: 70, status: 'gap' },
  ],
};

const TRADEOFF_ROWS: Record<string, { dimension: string; status: '✅ MATCH' | '⚠️ GAP' | '🔴 RISK'; impact: string; risk: string }[]> = {
  'Production Mindset': [
    { dimension: 'CI/CD Adoption',       status: '🔴 RISK',   impact: '+MYR 3,200/mo once deployed', risk: 'Stack lock-in if only Vercel/Railway' },
    { dimension: 'Testing Culture',       status: '⚠️ GAP',    impact: '2× interview pass rate',      risk: 'Slow onboarding without habit' },
    { dimension: 'Monitoring Literacy',   status: '🔴 RISK',   impact: 'Senior-track gating skill',   risk: 'Career ceiling without it at yr 3' },
  ],
  'Technical Depth': [
    { dimension: 'System Design',         status: '⚠️ GAP',    impact: '+MYR 4,500/mo at Staff level', risk: 'Blocks promotion beyond Senior SWE' },
    { dimension: 'Cloud Fundamentals',    status: '🔴 RISK',   impact: 'MNC requirement for 60% roles', risk: 'Vendor lock-in if only AWS' },
    { dimension: 'Core CS (DSA)',          status: '✅ MATCH',  impact: 'Interview ready',              risk: 'Needs refresher every 6 months' },
  ],
  'Portfolio Strength': [
    { dimension: 'Deployed Projects',     status: '⚠️ GAP',    impact: 'Recruiter shortlist signal',   risk: 'Vanity metrics without real users' },
    { dimension: 'GitHub Consistency',    status: '⚠️ GAP',    impact: '3× recruiter reach-out rate',  risk: 'Activity ≠ quality' },
    { dimension: 'Impact Quantification', status: '🔴 RISK',   impact: 'Defines salary negotiation',   risk: 'Underselling real contributions' },
  ],
};

const statusBadge = (s: '✅ MATCH' | '⚠️ GAP' | '🔴 RISK') => {
  if (s === '✅ MATCH') return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
  if (s === '⚠️ GAP')  return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
  return 'bg-rose-500/15 text-rose-400 border border-rose-500/30';
};

const skillBarColor = (status: 'gap' | 'match' | 'strong') => {
  if (status === 'strong') return 'from-emerald-500 to-cyan-400';
  if (status === 'match')  return 'from-blue-500 to-cyan-400';
  return 'from-rose-500 to-amber-400';
};

export function Gaps({ gaps, onViewCohort, onUpdateEvidence }: Props) {
  const quickWin = findQuickWin(gaps);
  const [activeGap, setActiveGap] = useState<Gap | null>(gaps[0] ?? null);
  const [activeTab, setActiveTab] = useState<'skills' | 'actions' | 'tradeoffs'>('skills');

  const salary = DIM_SALARY[activeGap?.dimension ?? ''] ?? DIM_SALARY['Technical Depth'];
  const skills = DIM_SKILLS[activeGap?.dimension ?? ''] ?? DIM_SKILLS['Technical Depth'];
  const tradeoffs = TRADEOFF_ROWS[activeGap?.dimension ?? ''] ?? TRADEOFF_ROWS['Technical Depth'];

  const dimIcon: Record<string, string> = {
    'Technical Depth': '🔧', 'Portfolio Strength': '📂',
    'Work Readiness': '💼', 'Communication': '💬',
    'Production Mindset': '⚙️', 'Role Fit': '🎯',
  };

  if (gaps.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-black text-white mb-3">Outstanding Readiness</h2>
          <p className="text-white/40 mb-8">You're in the top percentile. Keep shipping.</p>
          <button onClick={onViewCohort}
            className="px-8 py-3 bg-emerald-500 text-black font-black rounded-xl hover:-translate-y-1 transition-all duration-300">
            View Cohort Benchmark →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] px-4 py-8 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* ── PAGE HEADER ────────────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-black text-fuchsia-400 uppercase tracking-widest border border-fuchsia-400/30 px-3 py-1 rounded-full">
                Career OS · Gap Intelligence
              </span>
              <span className="text-xs font-black text-white/30 uppercase tracking-widest">
                {gaps.length} dimension{gaps.length !== 1 ? 's' : ''} to close
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-white leading-tight">
              Your Paths Forward
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">
                Ranked by salary impact.
              </span>
            </h1>
          </div>
          {quickWin && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl px-5 py-4 max-w-xs">
              <div className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-1">⚡ Quick Win</div>
              <div className="text-white font-bold text-sm">{quickWin.action.title}</div>
              <div className="text-white/40 text-xs mt-1">{quickWin.action.timeline} · {quickWin.action.effort}</div>
            </div>
          )}
        </div>

        {/* ── GAP SELECTOR TABS ─────────────────────────────────────── */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {gaps.map((gap, i) => (
            <button
              key={i}
              onClick={() => setActiveGap(gap)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 ${
                activeGap?.dimension === gap.dimension
                  ? 'bg-gradient-to-r from-fuchsia-500/20 to-cyan-500/20 border border-fuchsia-500/40 text-white'
                  : 'bg-white/5 border border-white/10 text-white/50 hover:text-white hover:border-white/20'
              }`}
            >
              <span>{dimIcon[gap.dimension] ?? '📊'}</span>
              <span>{gap.dimension}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-black ${
                gap.score >= 55 ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {gap.score}
              </span>
            </button>
          ))}
        </div>

        {/* ── MAIN 12-COL DASHBOARD ─────────────────────────────────── */}
        {activeGap && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* ══ LEFT PANEL: INSIGHT SUMMARY (4 cols) ══════════════ */}
            <div className="lg:col-span-4 space-y-4">

              {/* Gap identity card */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 border border-fuchsia-500/30 flex items-center justify-center text-2xl">
                    {dimIcon[activeGap.dimension] ?? '📊'}
                  </div>
                  <div>
                    <div className="text-white font-black text-base">{activeGap.dimension}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-1.5 w-24 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-rose-500 to-amber-400 rounded-full"
                          style={{ width: `${activeGap.score}%` }} />
                      </div>
                      <span className="text-rose-400 font-black text-xs">{activeGap.score}/100</span>
                    </div>
                  </div>
                </div>
                <p className="text-white/50 text-xs leading-relaxed">{activeGap.explanation}</p>
              </div>

              {/* Why This Path Makes Sense */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-4">
                  ∷ Why This Path Makes Sense
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <span className="text-emerald-400 text-xs font-black mt-0.5 flex-shrink-0">✅ MATCH</span>
                    <span className="text-white/70 text-xs">Your profile trajectory aligns with {activeGap.dimension} demand in SEA tech market</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-emerald-400 text-xs font-black mt-0.5 flex-shrink-0">✅ MATCH</span>
                    <span className="text-white/70 text-xs">Closing this gap unlocks <strong className="text-cyan-400">{activeGap.projectedImpact}</strong> score improvement</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-amber-400 text-xs font-black mt-0.5 flex-shrink-0">⚠️ GAP</span>
                    <span className="text-white/70 text-xs">{activeGap.whyMatters}</span>
                  </div>
                  {activeGap.cohortInsights && (
                    <div className="flex items-start gap-2.5">
                      <span className="text-rose-400 text-xs font-black mt-0.5 flex-shrink-0">⚠️ GAP</span>
                      <span className="text-white/70 text-xs">
                        {activeGap.cohortInsights.gapFrequencyPercentage}% of your cohort shares this gap — high competition for same roles
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Trade-offs matrix */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="text-xs font-black text-fuchsia-400 uppercase tracking-widest mb-4">
                  ⚖ Real Trade-offs Analysis
                </div>
                <div className="space-y-2">
                  {tradeoffs.map((row, i) => (
                    <div key={i} className="bg-black/20 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-white/80 text-xs font-bold">{row.dimension}</span>
                        <span className={`text-xs font-black px-2 py-0.5 rounded-full ${statusBadge(row.status)}`}>
                          {row.status}
                        </span>
                      </div>
                      <div className="text-cyan-400 text-xs mb-1">↑ {row.impact}</div>
                      <div className="text-rose-400/70 text-xs">⚠ {row.risk}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Score projection */}
              <div className="bg-gradient-to-br from-fuchsia-500/10 to-cyan-500/10 border border-fuchsia-500/20 rounded-2xl p-5">
                <div className="text-xs font-black text-white/40 uppercase tracking-widest mb-3">Score Projection</div>
                <div className="flex items-end gap-3">
                  <div>
                    <div className="text-white/30 text-xs mb-1">Current</div>
                    <div className="text-3xl font-black text-white/60">{activeGap.score}</div>
                  </div>
                  <div className="text-fuchsia-400 font-black text-2xl mb-1">→</div>
                  <div>
                    <div className="text-cyan-400 text-xs mb-1">After gap close</div>
                    <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">
                      {Math.min(100, activeGap.score + parseInt(activeGap.projectedImpact.replace(/\D/g, '').slice(0, 2) || '15'))}
                    </div>
                  </div>
                </div>
                <div className="text-white/30 text-xs mt-2">{activeGap.projectedImpact} estimated gain</div>
              </div>
            </div>

            {/* ══ RIGHT PANEL: INTERACTIVE WORKSPACE (8 cols) ══════ */}
            <div className="lg:col-span-8 space-y-5">

              {/* MYR Salary Impact Card */}
              <div className="relative overflow-hidden rounded-2xl">
                {/* Gradient border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-cyan-400 rounded-2xl" />
                <div className="absolute inset-[1px] bg-[#0d0a1a] rounded-2xl" />

                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-5 flex-wrap gap-4">
                    <div>
                      <div className="text-xs font-black text-fuchsia-400 uppercase tracking-widest mb-2">
                        💰 MYR Salary Unlock · {activeGap.dimension}
                      </div>
                      <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400 leading-tight">
                        {salary.delta}
                      </div>
                      <div className="text-white/40 text-sm mt-1">monthly salary uplift on closing this gap</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white/30 text-xs mb-1">Current band</div>
                      <div className="text-white/60 font-black text-xl">{salary.current}/mo</div>
                      <div className="text-xs text-white/20 mt-2">→</div>
                      <div className="text-white/30 text-xs mt-1">Unlocked band</div>
                      <div className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400 font-black text-xl">{salary.unlocked}/mo</div>
                    </div>
                  </div>

                  {/* Mini salary bar */}
                  <div className="relative h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="absolute left-0 top-0 h-full bg-white/20 rounded-full"
                      style={{ width: `${activeGap.score}%` }} />
                    <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 rounded-full opacity-60"
                      style={{ width: '75%' }} />
                    <div className="absolute top-0 h-full w-0.5 bg-white/50"
                      style={{ left: '75%' }} />
                  </div>
                  <div className="flex justify-between text-xs text-white/30 mt-1.5">
                    <span>Your score: {activeGap.score}</span>
                    <span className="text-cyan-400">Target: 75</span>
                    <span>100</span>
                  </div>
                </div>
              </div>

              {/* Tab nav */}
              <div className="flex gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
                {([
                  { key: 'skills',    label: '📡 Skills Gap Radar' },
                  { key: 'actions',   label: '⚡ Action Plan' },
                  { key: 'tradeoffs', label: '⚖ Tradeoff Map' },
                ] as const).map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 py-2 text-xs font-black rounded-lg transition-all duration-200 ${
                      activeTab === tab.key
                        ? 'bg-gradient-to-r from-fuchsia-500/20 to-cyan-500/20 border border-fuchsia-500/30 text-white'
                        : 'text-white/40 hover:text-white/70'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[280px]">

                {/* TAB 1: SKILLS GAP RADAR */}
                {activeTab === 'skills' && (
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="text-xs font-black text-cyan-400 uppercase tracking-widest">Skills vs. Market Requirement</div>
                      <div className="flex items-center gap-4 text-xs text-white/40">
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 inline-block"/>&nbsp;Yours</span>
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-white/20 inline-block"/>&nbsp;Required</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {skills.map((s) => (
                        <div key={s.skill}>
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-white/80 text-xs font-bold">{s.skill}</span>
                            <div className="flex items-center gap-3">
                              <span className={`text-xs font-black ${
                                s.status === 'strong' ? 'text-emerald-400' :
                                s.status === 'match'  ? 'text-cyan-400' : 'text-rose-400'
                              }`}>
                                {s.yours}
                              </span>
                              <span className="text-white/20 text-xs">/ {s.required} req.</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded-md font-black ${
                                s.status === 'strong' ? 'bg-emerald-500/15 text-emerald-400' :
                                s.status === 'match'  ? 'bg-cyan-500/15 text-cyan-400' :
                                'bg-rose-500/15 text-rose-400'
                              }`}>
                                {s.status === 'strong' ? '✓ Strong' : s.status === 'match' ? '~ Match' : '✗ Gap'}
                              </span>
                            </div>
                          </div>
                          <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                            {/* Required bar */}
                            <div className="absolute left-0 top-0 h-full bg-white/10 rounded-full"
                              style={{ width: `${s.required}%` }} />
                            {/* Yours bar */}
                            <div className={`absolute left-0 top-0 h-full bg-gradient-to-r ${skillBarColor(s.status)} rounded-full transition-all duration-700`}
                              style={{ width: `${s.yours}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 2: ACTION PLAN */}
                {activeTab === 'actions' && (
                  <div>
                    <div className="text-xs font-black text-fuchsia-400 uppercase tracking-widest mb-5">
                      Recommended Actions · Sorted by ROI
                    </div>
                    <div className="space-y-3">
                      {activeGap.nextActions.map((action, i) => (
                        <div key={i} className={`bg-black/30 border rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-fuchsia-500/30 ${
                          i === 0 ? 'border-cyan-500/30' : 'border-white/10'
                        }`}>
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              {i === 0 && (
                                <span className="text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-black flex-shrink-0">
                                  #1 PRIORITY
                                </span>
                              )}
                              <span className="text-white font-bold text-sm">{action.title}</span>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              <span className="text-xs bg-white/5 border border-white/10 text-white/50 px-2 py-1 rounded-lg">{action.timeline}</span>
                              <span className="text-xs bg-white/5 border border-white/10 text-white/50 px-2 py-1 rounded-lg">{action.effort}</span>
                            </div>
                          </div>
                          <p className="text-white/40 text-xs leading-relaxed">{action.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: TRADEOFF MAP */}
                {activeTab === 'tradeoffs' && (
                  <div>
                    <div className="text-xs font-black text-fuchsia-400 uppercase tracking-widest mb-5">
                      Full Tradeoff Intelligence · {activeGap.dimension}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left text-white/30 font-black uppercase tracking-wider pb-3 pr-4">Dimension</th>
                            <th className="text-left text-white/30 font-black uppercase tracking-wider pb-3 pr-4">Status</th>
                            <th className="text-left text-white/30 font-black uppercase tracking-wider pb-3 pr-4">Market Impact</th>
                            <th className="text-left text-white/30 font-black uppercase tracking-wider pb-3">Risk if Ignored</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {tradeoffs.map((row, i) => (
                            <tr key={i}>
                              <td className="text-white/80 font-bold py-3 pr-4">{row.dimension}</td>
                              <td className="py-3 pr-4">
                                <span className={`text-xs font-black px-2 py-0.5 rounded-full ${statusBadge(row.status)}`}>
                                  {row.status}
                                </span>
                              </td>
                              <td className="text-cyan-400 font-bold py-3 pr-4">{row.impact}</td>
                              <td className="text-rose-400/70 py-3">{row.risk}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Wizards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {onUpdateEvidence && (
                  <button
                    onClick={onUpdateEvidence}
                    className="group flex items-center justify-center gap-2 bg-white/5 hover:bg-fuchsia-500/10 border border-white/10 hover:border-fuchsia-500/40 rounded-xl py-3.5 text-sm font-black text-white/60 hover:text-fuchsia-400 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-fuchsia-500/10"
                  >
                    <span>🔄</span>
                    <span>Adjust Path</span>
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('actions')}
                  className="group flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-500/10 to-cyan-500/10 hover:from-fuchsia-500/20 hover:to-cyan-500/20 border border-fuchsia-500/30 hover:border-fuchsia-500/60 rounded-xl py-3.5 text-sm font-black text-fuchsia-400 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-fuchsia-500/20"
                >
                  <span>⚡</span>
                  <span>Bridge the Gap</span>
                </button>
                <button
                  onClick={onViewCohort}
                  className="group flex items-center justify-center gap-2 bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/40 rounded-xl py-3.5 text-sm font-black text-white/60 hover:text-cyan-400 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/10"
                >
                  <span>📡</span>
                  <span>Cohort Benchmark</span>
                </button>
              </div>

              {/* Career OS module chain */}
              <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-5">
                <div className="text-xs font-black text-white/30 uppercase tracking-widest mb-4">Career OS · Module Chain</div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {[
                    { n: '03', title: 'Readiness Profile', active: true },
                    { n: '→', title: '', active: false },
                    { n: '04', title: 'Internship Market', active: false },
                    { n: '→', title: '', active: false },
                    { n: '05', title: 'Learning Wallet', active: false },
                  ].map((m, i) =>
                    m.n === '→' ? (
                      <span key={i} className="text-white/20 font-black text-lg flex-shrink-0">→</span>
                    ) : (
                      <div key={i} className={`flex-shrink-0 px-4 py-2.5 rounded-xl border text-center ${
                        m.active
                          ? 'bg-gradient-to-r from-fuchsia-500/15 to-cyan-500/15 border-fuchsia-500/30'
                          : 'bg-white/3 border-white/10'
                      }`}>
                        <div className={`text-lg font-black ${m.active ? 'text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400' : 'text-white/20'}`}>{m.n}</div>
                        <div className={`text-xs font-bold mt-0.5 ${m.active ? 'text-white/60' : 'text-white/20'}`}>{m.title}</div>
                        {m.active && <div className="text-xs text-fuchsia-400 mt-1">← You are here</div>}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
