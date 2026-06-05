import { useState } from 'react';
import { StudentProfile } from '../types/evidence';

// ─────────────────────────────────────────────────────────────────
// DATA MATRIX — Malaysian IT Industry (write-in, not placeholder)
// ─────────────────────────────────────────────────────────────────

type SkillStatus = 'critical' | 'gap' | 'match' | 'strong';
type InsightType = 'warning' | 'fire' | 'pivot';

interface TalentSituation {
  tag: string; icon: string; myrFrom: string; myrTo: string;
  growth: string; timeframe: string;
  skills: { name: string; yours: number; market: number; status: SkillStatus }[];
  insight: { type: InsightType; badge: string; main: string; tradeoff: string; action: string; unlock: string; unlockCondition: string };
  path: string[];
}

interface Candidate {
  id: string; initial: string; color: string;
  title: string; location: string;
  skills: { name: string; match: number }[];
  expected: string; budget: string; notice: string; score: number;
}

interface EmployerCriteria {
  tag: string; icon: string;
  candidates: Candidate[];
  budgetRange: string; openRoles: number;
}

const TALENT: Record<string, TalentSituation> = {
  student: {
    tag: 'Final Year CS Student', icon: '🎓',
    myrFrom: 'MYR 4,200', myrTo: 'MYR 6,800', growth: '+62%', timeframe: 'Yr 1 → 2',
    skills: [
      { name: 'Node.js / Backend',  yours: 68, market: 85, status: 'gap' },
      { name: 'React / Frontend',   yours: 72, market: 80, status: 'gap' },
      { name: 'Production CI/CD',   yours: 15, market: 75, status: 'critical' },
      { name: 'System Design',      yours: 30, market: 70, status: 'critical' },
      { name: 'SQL / Databases',    yours: 65, market: 75, status: 'gap' },
      { name: 'Cloud (AWS/GCP)',    yours: 20, market: 65, status: 'critical' },
    ],
    insight: {
      type: 'warning',
      badge: '⚠️ Portfolio Gap Detected',
      main: 'Your academic Node.js knowledge is verified, but you have 0 live production experience visible to employers.',
      tradeoff: 'General job boards are saturated with 3,000+ CS graduates per cycle. Cold applications from this position convert at <2%.',
      action: 'The OS recommends the 3-week Hackathon track to unlock your baseline. Ship 1 deployed project with GitHub Actions CI before the next application cycle.',
      unlock: '+MYR 2,600/mo salary unlock',
      unlockCondition: '1 deployed project + CI/CD evidence',
    },
    path: ['Intern · MYR 4,200/mo', 'Junior Dev · MYR 6,800/mo', 'Mid Dev · MYR 10,500/mo'],
  },
  developer: {
    tag: '2 YOE Node.js Developer', icon: '⚡',
    myrFrom: 'MYR 7,500', myrTo: 'MYR 13,000', growth: '+73%', timeframe: '12–18 mo',
    skills: [
      { name: 'Node.js / Express',   yours: 85, market: 80, status: 'strong' },
      { name: 'Vector Databases',    yours: 12, market: 78, status: 'critical' },
      { name: 'LLM Orchestration',   yours: 8,  market: 82, status: 'critical' },
      { name: 'System Design',       yours: 65, market: 75, status: 'gap' },
      { name: 'Docker / K8s',        yours: 55, market: 70, status: 'gap' },
      { name: 'Python / AI libs',    yours: 30, market: 80, status: 'gap' },
    ],
    insight: {
      type: 'fire',
      badge: '🔥 AI Pivot Path Identified',
      main: 'Shifting toward Vector Databases and LLM orchestration grants a +73% salary premium in KL right now.',
      tradeoff: '⚠️ [Trade-off] This pivot requires forfeiting your specialised Java frameworks — introducing a 6-month skill shelf-life lock-in before the new stack is production-ready.',
      action: 'Bridge path: LangChain + Pinecone (6–8 weeks). Build 1 RAG application as evidence. This single artefact unlocks Senior AI Engineer interviews at ByteDance, Grab, and Axiata.',
      unlock: '+MYR 5,500/mo salary unlock',
      unlockCondition: 'Vector DB + LLM orchestration project',
    },
    path: ['Node.js Dev · MYR 7,500/mo', 'AI Engineer · MYR 13,000/mo', 'Staff AI · MYR 18,000+/mo'],
  },
  pivot: {
    tag: 'Non-Tech Pivot to UI/UX', icon: '🎨',
    myrFrom: 'MYR 3,800', myrTo: 'MYR 6,500', growth: '+71%', timeframe: '9–15 mo',
    skills: [
      { name: 'Figma / Prototyping', yours: 78, market: 90, status: 'gap' },
      { name: 'User Research',       yours: 60, market: 75, status: 'gap' },
      { name: 'HTML/CSS handoff',    yours: 45, market: 60, status: 'gap' },
      { name: 'Design Systems',      yours: 35, market: 70, status: 'critical' },
      { name: 'Usability Testing',   yours: 50, market: 65, status: 'gap' },
      { name: 'Product Thinking',    yours: 72, market: 75, status: 'gap' },
    ],
    insight: {
      type: 'pivot',
      badge: '🎯 Pivot Intelligence',
      main: "Non-tech-to-UX is viable in KL's startup scene — but portfolio is the only filter that matters to hiring managers.",
      tradeoff: '⚠️ [Trade-off] Without HTML/CSS handoff skills, you are locked out of 65% of Malaysian UX roles that require dev collaboration. Pure visual design limits you to agencies, not product companies.',
      action: 'Fast path: Figma mastery (2 weeks) + 3 case studies with real user testing data. Publish on Behance + LinkedIn simultaneously.',
      unlock: '+MYR 2,700/mo salary unlock',
      unlockCondition: '3 portfolio case studies + HTML/CSS basics',
    },
    path: ['Junior UX · MYR 3,800/mo', 'Mid UX Designer · MYR 6,500/mo', 'Sr. Product Designer · MYR 10,000/mo'],
  },
};

const EMPLOYER: Record<string, EmployerCriteria> = {
  nextjs: {
    tag: 'Need: Next.js Developer (Budget < MYR 7K)', icon: '⚛️',
    budgetRange: 'MYR 5,000–7,000/mo', openRoles: 1,
    candidates: [
      {
        id: 'T-001', initial: 'A', color: 'from-cyan-400 to-blue-500',
        title: 'Frontend Engineer · 3 YOE', location: 'Petaling Jaya, MY',
        skills: [
          { name: 'React / Next.js', match: 95 },
          { name: 'TypeScript',      match: 88 },
          { name: 'REST APIs',       match: 82 },
        ],
        expected: 'MYR 6,200/mo', budget: 'MYR 7,000/mo',
        notice: 'Immediate', score: 84,
      },
      {
        id: 'T-002', initial: 'R', color: 'from-fuchsia-400 to-purple-500',
        title: 'Full-Stack Dev · 2.5 YOE', location: 'Kuala Lumpur, MY',
        skills: [
          { name: 'React / Next.js', match: 91 },
          { name: 'Node.js Backend', match: 85 },
          { name: 'PostgreSQL',      match: 79 },
        ],
        expected: 'MYR 6,800/mo', budget: 'MYR 7,000/mo',
        notice: '2 weeks', score: 77,
      },
    ],
  },
  dataeng: {
    tag: 'Need: Senior Data Engineer (Budget MYR 12K+)', icon: '📊',
    budgetRange: 'MYR 12,000–15,000/mo', openRoles: 1,
    candidates: [
      {
        id: 'T-003', initial: 'K', color: 'from-emerald-400 to-cyan-500',
        title: 'Senior Data Engineer · 6 YOE', location: 'KL Sentral, MY',
        skills: [
          { name: 'Apache Spark',      match: 93 },
          { name: 'Kafka / Streaming', match: 88 },
          { name: 'dbt / Warehouse',   match: 85 },
        ],
        expected: 'MYR 12,500/mo', budget: 'MYR 15,000/mo',
        notice: '1 month', score: 91,
      },
      {
        id: 'T-004', initial: 'S', color: 'from-amber-400 to-orange-500',
        title: 'Data Platform Lead · 5 YOE', location: 'Bangsar South, MY',
        skills: [
          { name: 'Python / PySpark',      match: 89 },
          { name: 'Snowflake / BigQuery',  match: 84 },
          { name: 'Airflow / Orchestration', match: 80 },
        ],
        expected: 'MYR 13,000/mo', budget: 'MYR 15,000/mo',
        notice: 'Negotiable', score: 88,
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────
// SKILL STATUS HELPERS
// ─────────────────────────────────────────────────────────────────
const skillBar = (status: SkillStatus) => ({
  critical: 'bg-rose-500',
  gap:      'bg-amber-400',
  match:    'bg-blue-400',
  strong:   'bg-emerald-400',
}[status]);

const skillLabel = (status: SkillStatus) => ({
  critical: 'text-rose-400 bg-rose-500/15 border-rose-500/30',
  gap:      'text-amber-400 bg-amber-500/15 border-amber-500/30',
  match:    'text-blue-400 bg-blue-500/15 border-blue-500/30',
  strong:   'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
}[status]);

const skillText = (status: SkillStatus) => ({
  critical: '✗ Critical Gap', gap: '⚠ Gap', match: '~ Match', strong: '✓ Strong',
}[status]);

const insightAccent = (type: InsightType) => ({
  warning: { border: 'border-amber-500/30', bg: 'bg-amber-500/8', badge: 'text-amber-400 bg-amber-500/15 border-amber-500/30', dot: 'bg-amber-400' },
  fire:    { border: 'border-rose-500/30',  bg: 'bg-rose-500/8',  badge: 'text-rose-400 bg-rose-500/15 border-rose-500/30',     dot: 'bg-rose-400' },
  pivot:   { border: 'border-cyan-500/30',  bg: 'bg-cyan-500/8',  badge: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30',     dot: 'bg-cyan-400' },
}[type]);

const matchColor = (m: number) =>
  m >= 90 ? 'text-emerald-400' : m >= 80 ? 'text-cyan-400' : 'text-amber-400';

// ─────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────

function TagChip({
  label, icon, active, onClick,
}: { label: string; icon: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-black transition-all duration-300 hover:-translate-y-0.5 ${
        active
          ? 'bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-black shadow-lg shadow-fuchsia-500/30 scale-105'
          : 'bg-white/5 border border-white/15 text-white/60 hover:text-white hover:border-white/30 hover:bg-white/8'
      }`}
    >
      {active && (
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping" />
      )}
      <span className="text-base">{icon}</span>
      <span>{label}</span>
      {active && <span className="text-xs opacity-60">●</span>}
    </button>
  );
}

function SkillRadar({ situation }: { situation: TalentSituation }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="text-xs font-black text-cyan-400 uppercase tracking-widest">Skills vs Market Requirement</div>
        <div className="flex gap-3 text-xs text-white/30">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-gradient-to-r from-fuchsia-500 to-cyan-400 inline-block" /> Yours</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-white/20 inline-block" /> Market</span>
        </div>
      </div>
      <div className="space-y-4">
        {situation.skills.map((s) => (
          <div key={s.name}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-white/80 text-xs font-bold">{s.name}</span>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-black ${
                  s.status === 'strong' ? 'text-emerald-400' :
                  s.status === 'match'  ? 'text-cyan-400' :
                  s.status === 'gap'    ? 'text-amber-400' : 'text-rose-400'
                }`}>{s.yours}</span>
                <span className="text-white/20 text-xs">/ {s.market}</span>
                <span className={`text-xs font-black px-2 py-0.5 rounded-full border ${skillLabel(s.status)}`}>
                  {skillText(s.status)}
                </span>
              </div>
            </div>
            <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
              {/* Market line */}
              <div className="absolute left-0 top-0 h-full bg-white/10 rounded-full"
                style={{ width: `${s.market}%` }} />
              {/* Yours bar */}
              <div className={`absolute left-0 top-0 h-full ${skillBar(s.status)} rounded-full transition-all duration-700`}
                style={{ width: `${s.yours}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SalaryCard({ situation }: { situation: TalentSituation }) {
  return (
    <div className="relative overflow-hidden rounded-2xl h-full">
      {/* Gradient border */}
      <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500 to-cyan-400 rounded-2xl" />
      <div className="absolute inset-[1.5px] bg-[#0d0a1a] rounded-2xl" />
      <div className="relative p-6 flex flex-col justify-between h-full">
        {/* Header */}
        <div>
          <div className="text-xs font-black text-fuchsia-400 uppercase tracking-widest mb-4">
            💰 MYR Salary Trajectory · Malaysia IT
          </div>
          <div className="mb-2">
            <div className="text-white/40 text-xs mb-1">Starting band</div>
            <div className="text-3xl font-extrabold text-white">{situation.myrFrom}<span className="text-white/30 text-base font-bold">/mo</span></div>
          </div>
          <div className="flex items-center gap-2 my-3">
            <div className="flex-1 h-px bg-gradient-to-r from-fuchsia-500 to-cyan-400" />
            <span className="text-fuchsia-400 font-black text-lg">{situation.growth}</span>
            <div className="flex-1 h-px bg-gradient-to-l from-cyan-400 to-transparent" />
          </div>
          <div className="mb-4">
            <div className="text-cyan-400 text-xs mb-1">Target band · {situation.timeframe}</div>
            <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400">
              {situation.myrTo}<span className="text-fuchsia-400/50 text-base font-bold">/mo</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative h-2.5 bg-white/10 rounded-full overflow-hidden mb-2">
            <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 rounded-full w-[60%]" />
            <div className="absolute top-0 h-full w-0.5 bg-white/40" style={{ left: '75%' }} />
          </div>
          <div className="flex justify-between text-xs text-white/25 mb-5">
            <span>Current</span>
            <span className="text-cyan-400">Target: 75 readiness score</span>
            <span>Top 10%</span>
          </div>
        </div>

        {/* Career path chain */}
        <div>
          <div className="text-xs font-black text-white/30 uppercase tracking-wider mb-3">Trajectory Chain</div>
          <div className="space-y-2">
            {situation.path.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${i === 0 ? 'bg-fuchsia-400' : i === situation.path.length - 1 ? 'bg-cyan-400' : 'bg-white/30'}`} />
                <span className={`text-xs font-bold ${i === 0 ? 'text-fuchsia-400' : i === situation.path.length - 1 ? 'text-cyan-400' : 'text-white/40'}`}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightBox({ situation }: { situation: TalentSituation }) {
  const a = insightAccent(situation.insight.type);
  return (
    <div className={`rounded-2xl border ${a.border} ${a.bg} p-6 transition-all duration-300`}>
      <div className="flex items-start gap-4">
        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 animate-pulse ${a.dot}`} />
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className={`text-xs font-black px-3 py-1 rounded-full border ${a.badge}`}>
              {situation.insight.badge}
            </span>
            <span className="text-xs text-white/30 font-bold">AI Career Intelligence · Malaysia IT Market</span>
          </div>

          <p className="text-white/90 text-sm font-bold mb-2 leading-relaxed">{situation.insight.main}</p>
          <p className="text-white/50 text-sm leading-relaxed mb-4">{situation.insight.tradeoff}</p>

          <div className="bg-black/25 rounded-xl p-4 border border-white/5 mb-4">
            <div className="text-xs font-black text-cyan-400 uppercase mb-2">→ Recommended Action</div>
            <p className="text-white/75 text-sm leading-relaxed">{situation.insight.action}</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-white/30 mb-0.5">Salary unlock on completion</div>
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400 font-black text-lg">{situation.insight.unlock}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-white/30 mb-0.5">Condition</div>
              <div className="text-white/60 text-xs font-bold max-w-[180px] text-right">{situation.insight.unlockCondition}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CandidateCard({ c }: { c: Candidate }) {
  const delta = parseInt(c.expected.replace(/\D/g, '')) - parseInt(c.budget.replace(/\D/g, ''));
  const withinBudget = delta <= 0;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:shadow-xl hover:shadow-blue-500/10">
      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-black font-black text-xl flex-shrink-0`}>
          {c.initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white font-black text-base">{c.title}</div>
          <div className="text-white/40 text-xs mt-0.5">📍 {c.location}</div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className={`text-xs font-black px-2 py-1 rounded-full border ${withinBudget ? 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' : 'text-rose-400 bg-rose-500/15 border-rose-500/30'}`}>
            {withinBudget ? '✓ Within Budget' : '↑ Over Budget'}
          </div>
          <div className="text-white/20 text-xs mt-1">Not job-hunting yet</div>
        </div>
      </div>

      {/* Skill match bars */}
      <div className="space-y-2.5 mb-5">
        {c.skills.map((s) => (
          <div key={s.name}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-white/60 text-xs font-bold">{s.name}</span>
              <span className={`text-xs font-black ${matchColor(s.match)}`}>{s.match}% Match</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  s.match >= 90 ? 'bg-emerald-400' : s.match >= 80 ? 'bg-cyan-400' : 'bg-amber-400'
                }`}
                style={{ width: `${s.match}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Salary + Notice row */}
      <div className="flex items-center justify-between bg-black/25 rounded-xl px-4 py-3 mb-4">
        <div>
          <div className="text-white/25 text-xs mb-0.5">Expected</div>
          <div className="text-white font-black">{c.expected}</div>
        </div>
        <div className="text-white/20 font-black">vs</div>
        <div className="text-right">
          <div className="text-white/25 text-xs mb-0.5">Budget</div>
          <div className="text-emerald-400 font-black">{c.budget}</div>
        </div>
        <div className="text-right">
          <div className="text-white/25 text-xs mb-0.5">Notice</div>
          <div className="text-cyan-400 font-bold text-sm">{c.notice}</div>
        </div>
      </div>

      {/* Evidence score + CTA */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="text-white/25 text-xs mb-1">Verified Evidence Score</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 rounded-full" style={{ width: `${c.score}%` }} />
            </div>
            <span className="text-fuchsia-400 font-black text-xs">{c.score}/100</span>
          </div>
        </div>
        <button className="flex-shrink-0 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 hover:border-blue-400/60 text-blue-400 hover:text-white font-black text-xs rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/20">
          ⚡ Connect
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN PORTAL COMPONENT
// ─────────────────────────────────────────────────────────────────

interface Props {
  onViewDemo: (profile: StudentProfile) => void;
  onBuildOwn: () => void;
}

export function CareerOSPortal({ onViewDemo: _onViewDemo, onBuildOwn }: Props) {
  const [viewMode,    setViewMode]    = useState<'talent' | 'employer'>('talent');
  const [talentKey,   setTalentKey]   = useState<keyof typeof TALENT | null>(null);
  const [employerKey, setEmployerKey] = useState<keyof typeof EMPLOYER | null>(null);

  const talentData   = talentKey   ? TALENT[talentKey]   : null;
  const employerData = employerKey ? EMPLOYER[employerKey] : null;

  return (
    <div className="bg-[#080d18] py-16 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* ── SECTION HEADER ─────────────────────────────────────── */}
        <div className="text-center mb-10">
          <div className="text-xs font-black text-fuchsia-400 uppercase tracking-widest border border-fuchsia-400/30 px-3 py-1.5 rounded-full inline-block mb-5">
            Career OS · Interactive Prototype
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-3">
            Select your situation.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">
              Watch the OS respond in real time.
            </span>
          </h2>
          <p className="text-white/40 max-w-xl mx-auto text-center">
            Malaysian IT industry data. Not placeholder text. Click a tag to see trajectory intelligence.
          </p>
        </div>

        {/* ── PORTAL TOGGLE ─────────────────────────────────────── */}
        <div className="flex justify-center mb-10">
          <div className="relative flex bg-slate-900/80 border border-slate-800 rounded-full p-1 backdrop-blur-md w-full max-w-md">
            {/* Sliding pill */}
            <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-r from-fuchsia-500 to-cyan-400 rounded-full transition-all duration-300 ease-in-out shadow-lg shadow-fuchsia-500/20 ${
              viewMode === 'talent' ? 'left-1' : 'left-[calc(50%+3px)]'
            }`} />
            <button
              onClick={() => { setViewMode('talent'); setTalentKey(null); }}
              className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 text-sm font-black rounded-full transition-all duration-300 ${
                viewMode === 'talent' ? 'text-black' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🧑‍💻</span>
              <span className="hidden sm:inline">Talent Portal</span>
              <span className="sm:hidden">Talent</span>
            </button>
            <button
              onClick={() => { setViewMode('employer'); setEmployerKey(null); }}
              className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 text-sm font-black rounded-full transition-all duration-300 ${
                viewMode === 'employer' ? 'text-black' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🏢</span>
              <span className="hidden sm:inline">Employer Portal</span>
              <span className="sm:hidden">Employer</span>
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            TALENT PORTAL
        ══════════════════════════════════════════════════════════ */}
        {viewMode === 'talent' && (
          <div>
            {/* Situation selector */}
            <div className="mb-8">
              <p className="text-xs font-black text-white/30 uppercase tracking-widest text-center mb-4">
                Step 1 — Select your current situation
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {(Object.keys(TALENT) as Array<keyof typeof TALENT>).map((key) => (
                  <TagChip
                    key={key}
                    label={TALENT[key].tag}
                    icon={TALENT[key].icon}
                    active={talentKey === key}
                    onClick={() => setTalentKey(talentKey === key ? null : key)}
                  />
                ))}
              </div>
            </div>

            {/* Idle state */}
            {!talentData && (
              <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
                <div className="text-4xl mb-3 opacity-50">👆</div>
                <p className="text-white/30 font-bold text-sm">Select a situation above to see your personalised trajectory</p>
                <p className="text-white/20 text-xs mt-1">Skills radar · MYR salary unlock · AI career intelligence</p>
              </div>
            )}

            {/* Active state */}
            {talentData && (
              <div key={talentKey} style={{ animation: 'portalFadeIn 0.35s ease-out' }}>
                {/* Row 1: Salary card + Skills radar */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                  <SalaryCard situation={talentData} />
                  <SkillRadar situation={talentData} />
                </div>
                {/* Row 2: AI Insight */}
                <InsightBox situation={talentData} />
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            EMPLOYER PORTAL
        ══════════════════════════════════════════════════════════ */}
        {viewMode === 'employer' && (
          <div>
            {/* Criteria selector */}
            <div className="mb-8">
              <p className="text-xs font-black text-white/30 uppercase tracking-widest text-center mb-4">
                Step 1 — Select your hiring criteria
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {(Object.keys(EMPLOYER) as Array<keyof typeof EMPLOYER>).map((key) => (
                  <TagChip
                    key={key}
                    label={EMPLOYER[key].tag}
                    icon={EMPLOYER[key].icon}
                    active={employerKey === key}
                    onClick={() => setEmployerKey(employerKey === key ? null : key)}
                  />
                ))}
              </div>
            </div>

            {/* Idle state */}
            {!employerData && (
              <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
                <div className="text-4xl mb-3 opacity-50">🔍</div>
                <p className="text-white/30 font-bold text-sm">Select a hiring criterion above to surface pre-vetted candidates</p>
                <p className="text-white/20 text-xs mt-1">Zero noise · Verified evidence scores · Budget-matched</p>
              </div>
            )}

            {/* Active: Candidate grid */}
            {employerData && (
              <div key={employerKey} style={{ animation: 'portalFadeIn 0.35s ease-out' }}>
                {/* Context bar */}
                <div className="flex items-center justify-between bg-blue-500/8 border border-blue-500/20 rounded-2xl px-5 py-4 mb-5">
                  <div>
                    <div className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1">Criteria Match Results</div>
                    <div className="text-white font-black text-sm">{employerData.tag}</div>
                  </div>
                  <div className="flex gap-4 text-center flex-shrink-0">
                    <div>
                      <div className="text-2xl font-black text-white">{employerData.candidates.length}</div>
                      <div className="text-white/30 text-xs">matched</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-emerald-400">0</div>
                      <div className="text-white/30 text-xs">noise filtered</div>
                    </div>
                  </div>
                </div>

                {/* Candidate cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                  {employerData.candidates.map((c) => <CandidateCard key={c.id} c={c} />)}
                </div>

                {/* Footer disclaimer */}
                <div className="text-center text-xs text-white/20 border border-white/5 rounded-xl px-4 py-3">
                  🔒 Candidates shown have opted into passive scouting. Identities are anonymised until mutual connection is confirmed. PDPA compliant.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onBuildOwn}
              className="px-8 py-4 bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-black font-black text-sm rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-fuchsia-500/25"
            >
              {viewMode === 'talent' ? '🎓 Build My Full Profile →' : '🏢 Access Full Employer Dashboard →'}
            </button>
          </div>
          <p className="text-xs text-white/20 mt-4">No account needed · Free · Malaysian IT data · PDPA compliant</p>
        </div>
      </div>

      {/* Keyframe animation */}
      <style>{`
        @keyframes portalFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
