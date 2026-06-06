import { useState, useEffect } from 'react';
import { StudentProfile } from '../types/evidence';

// ─── Types ────────────────────────────────────────────────────────────────────
type ViewMode  = 'talent' | 'employer';
type TalentTag = 'cs_final' | 'node_dev' | 'ux_pivot';
type EmpTag    = 'nextjs'   | 'dataeng';
type PKey      = 'fuchsia' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'blue';

interface Props {
  onViewDemo?: (profile: StudentProfile) => void;
  onBuildOwn:  () => void;
  defaultMode?: ViewMode;
  hideToggle?:  boolean;
  hideCta?:     boolean;
}

// ─── Explicit data types (avoids `as const` literal-type narrowing issues) ────
type PathStep    = { step: string; role: string; sal: string; active?: boolean };
type AlertItem   = { lvl: 'CRITICAL' | 'WARNING' | 'NOTICE'; icon: string; msg: string };
type Chapter     = { id: string; label: string; years: string; salK: number; color: PKey; optional?: boolean };
type TalentData  = {
  icon: string; label: string; color: PKey;
  salary: number; marketP75: number;
  path: PathStep[];
  pathTitle: string; pathWarn: string;
  alerts: AlertItem[];
  chapters: Chapter[];
  script: string;
};
type EmpCandidate = {
  id: string; badge: string; role: string;
  velocity: number; target: number; notice: string;
  match: number; risk: 'LOW' | 'MEDIUM' | 'HIGH'; flags: string[];
};
type SilverMedalist = { id: string; why: string; ago: string; upgrade: string; match: number; ask: string };
type RiskItem       = { name: string; risk: number; reason: string; color: PKey };
type ForecastItem   = { yr: string; demand: number; supply: number; gap: number };
type EmployerData   = {
  icon: string; label: string; color: PKey; budget: number;
  candidates: EmpCandidate[];
  silver: SilverMedalist[];
  onboarding: { day: number; prs: number; align: number; friction: string; status: string; note: string };
  risks: RiskItem[];
  forecast: ForecastItem[];
};

// ─── Injected CSS ─────────────────────────────────────────────────────────────
const PORTAL_CSS = `
@keyframes fadeInUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
@keyframes neonPulse { 0%,100%{opacity:.45} 50%{opacity:1} }
@keyframes scanBlink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
.fiu { animation: fadeInUp .36s cubic-bezier(.16,1,.3,1) both; }
.neon-dot  { animation: neonPulse 2s ease-in-out infinite; }
.scan-blink{ animation: scanBlink 1.1s step-end infinite; }
.salary-track { -webkit-appearance:none; appearance:none; width:100%; height:4px; border-radius:9999px; outline:none; cursor:pointer; }
.salary-track::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:#e879f9; cursor:pointer; box-shadow:0 0 12px rgba(232,121,249,.7); }
.salary-track::-moz-range-thumb     { width:18px; height:18px; border-radius:50%; background:#e879f9; cursor:pointer; border:none; }
.risk-bar   { transition: width .55s cubic-bezier(.4,0,.2,1); }
.bar-grow   { transition: height .5s cubic-bezier(.4,0,.2,1); }
.tab-item   { transition: background .2s ease, color .2s ease, border-color .2s ease; }
.mode-btn   { transition: all .2s ease; }
.tag-pill   { transition: all .18s ease; }
.cta-glow   { transition: transform .22s ease, box-shadow .22s ease; }
.cta-glow:hover { transform:translateY(-2px); box-shadow:0 0 36px rgba(168,85,247,.45),0 0 72px rgba(34,211,238,.15); }
`;

// ─── Palette ──────────────────────────────────────────────────────────────────
const P: Record<PKey, { bg: string; border: string; text: string; bar: string; glow: string }> = {
  fuchsia: { bg:'rgba(168,85,247,.09)',  border:'rgba(168,85,247,.28)', text:'#e879f9', bar:'#d946ef', glow:'rgba(217,70,239,.28)'  },
  cyan:    { bg:'rgba(34,211,238,.09)',  border:'rgba(34,211,238,.28)', text:'#67e8f9', bar:'#22d3ee', glow:'rgba(34,211,238,.28)'  },
  emerald: { bg:'rgba(52,211,153,.09)',  border:'rgba(52,211,153,.28)', text:'#6ee7b7', bar:'#34d399', glow:'rgba(52,211,153,.28)'  },
  amber:   { bg:'rgba(251,191,36,.09)',  border:'rgba(251,191,36,.28)', text:'#fcd34d', bar:'#fbbf24', glow:'rgba(251,191,36,.28)'  },
  rose:    { bg:'rgba(251,113,133,.09)', border:'rgba(251,113,133,.28)',text:'#fda4af', bar:'#fb7185', glow:'rgba(251,113,133,.28)' },
  blue:    { bg:'rgba(96,165,250,.09)',  border:'rgba(96,165,250,.28)', text:'#93c5fd', bar:'#60a5fa', glow:'rgba(96,165,250,.28)'  },
};

// ─── Talent data ──────────────────────────────────────────────────────────────
const TALENT: Record<TalentTag, TalentData> = {
  cs_final: {
    icon: '🎓', label: 'Final Year CS', color: 'fuchsia',
    salary: 4500, marketP75: 6800,
    path: [
      { step: 'Now',   role: 'Final Year CS Student',  sal: 'MYR 0 (Student)',   active: true  },
      { step: '3 mo',  role: 'Junior Frontend Dev',    sal: 'MYR 4,500/mo',      active: false },
      { step: '18 mo', role: 'Mid Frontend Dev',       sal: 'MYR 7,000/mo',      active: false },
      { step: '36 mo', role: 'Senior FE / Full-Stack', sal: 'MYR 12,000/mo',     active: false },
    ],
    pathTitle: 'Enterprise Path — MYR 4,500 starting base',
    pathWarn: 'Enterprise legacy cloud stack will depreciate your architectural agility by 40% within 18 months. Prioritise cloud-native projects during internship.',
    alerts: [
      { lvl: 'CRITICAL', icon: '🚨', msg: '0 production deployments detected. GitHub contributions: 3 repos, 0 stars. Every ATS and recruiter shortlist in Malaysia auto-filters for a live URL.' },
      { lvl: 'WARNING',  icon: '⚠️', msg: 'Final year CS with zero LLM integration proof. KL market premium for AI-adjacent engineers is now +35% vs generic frontend.' },
      { lvl: 'NOTICE',   icon: 'ℹ️', msg: 'DSA whiteboard prep detected. Targeting FAANG-style interviews is valid but compresses your SEA market optionality window by 6–9 months.' },
    ],
    chapters: [
      { id: 'study',  label: 'University',   years: '2020–2024', salK: 0,  color: 'blue'    },
      { id: 'junior', label: 'Junior Dev',   years: '2024–2026', salK: 5,  color: 'fuchsia' },
      { id: 'mid',    label: 'Mid Engineer', years: '2026–2028', salK: 8,  color: 'cyan'    },
      { id: 'senior', label: 'Senior',       years: '2028+',     salK: 13, color: 'emerald' },
    ],
    script: 'I have [X] months of verified production output across [Y] systems in scope. Market P75 for this role in KL is MYR 6,800. My current rate of MYR 4,500 represents a 34% underpayment gap. I am requesting realignment to MYR 6,200 effective next review cycle.',
  },

  node_dev: {
    icon: '⚙️', label: '2 YOE Node.js Dev', color: 'cyan',
    salary: 7200, marketP75: 9500,
    path: [
      { step: 'Now',   role: 'Node.js Developer (2 YOE)', sal: 'MYR 7,200/mo',  active: true  },
      { step: '6 mo',  role: 'AI / Prompt Engineer',      sal: 'MYR 9,500/mo',  active: false },
      { step: '18 mo', role: 'ML Ops / LLM Platform',     sal: 'MYR 14,000/mo', active: false },
      { step: '36 mo', role: 'AI Platform Lead',          sal: 'MYR 22,000/mo', active: false },
    ],
    pathTitle: 'AI Pivot — +46% premium at MYR 9,500',
    pathWarn: 'High framework churn. Your Java/Node asset liquidity will freeze if you do not master vector databases within 12 months. Pinecone, Weaviate, or pgvector — pick one now.',
    alerts: [
      { lvl: 'CRITICAL', icon: '🚨', msg: 'Vanilla React usage: 24 consecutive months. KL frontend liquidity curve dropping sharply Q3 2025. Immediate pivot to LLM integration tracks recommended.' },
      { lvl: 'WARNING',  icon: '⚠️', msg: 'No vector database experience detected. Pinecone/Weaviate is now table-stakes for AI-adjacent roles at MYR 9K+ in KL.' },
      { lvl: 'NOTICE',   icon: 'ℹ️', msg: 'Node.js v18 LTS in deployment config. Upgrade to v22 and add Bun runtime benchmarks to public portfolio to stay competitive.' },
    ],
    chapters: [
      { id: 'junior', label: 'Junior Node', years: '2022–2024', salK: 5,  color: 'blue',    optional: false },
      { id: 'mid',    label: 'Mid Node',    years: '2024–2025', salK: 7,  color: 'cyan',    optional: false },
      { id: 'break',  label: 'AI Bootcamp', years: '3 months',  salK: 0,  color: 'amber',   optional: true  },
      { id: 'ai',     label: 'AI Engineer', years: '2026+',     salK: 14, color: 'emerald', optional: false },
    ],
    script: 'I have 2 years of verified Node.js production deployments with [X]% uptime SLA across [Y] services. Market P75 for this scope in KL is MYR 9,500. I am requesting realignment to MYR 9,000 effective Q3 with a clear 6-month AI integration track.',
  },

  ux_pivot: {
    icon: '🎨', label: 'UX → PM Pivot', color: 'amber',
    salary: 4000, marketP75: 7200,
    path: [
      { step: 'Now',   role: 'Junior UX Designer', sal: 'MYR 4,000/mo',  active: true  },
      { step: '3 mo',  role: 'UX + Data Skills',   sal: 'MYR 5,500/mo',  active: false },
      { step: '12 mo', role: 'Associate PM',        sal: 'MYR 7,200/mo',  active: false },
      { step: '30 mo', role: 'Product Manager',     sal: 'MYR 12,000/mo', active: false },
    ],
    pathTitle: 'UX → PM Path — MYR 7,200 target at 12 months',
    pathWarn: 'UX-only roles are salary-compressing in KL. Without SQL and data analysis proof, PM transition velocity drops 60%. Data fluency is no longer a bonus — it is the entry ticket.',
    alerts: [
      { lvl: 'CRITICAL', icon: '🚨', msg: 'Zero SQL or data analysis certification detected. PM roles in KL now treat data fluency as a baseline requirement. Figma alone will not close the gap.' },
      { lvl: 'WARNING',  icon: '⚠️', msg: 'Portfolio is UI screenshots only. Add 2 case studies showing measurable business impact — conversion lifts, revenue deltas, or retention data.' },
      { lvl: 'NOTICE',   icon: 'ℹ️', msg: 'User research skills are strongly transferable. Reframe them as customer discovery outputs in all PM job application narratives.' },
    ],
    chapters: [
      { id: 'ux',      label: 'Junior UX',  years: '2023–2025', salK: 4,  color: 'amber',   optional: false },
      { id: 'upskill', label: 'SQL + Data', years: '2 months',  salK: 0,  color: 'rose',    optional: true  },
      { id: 'apm',     label: 'Assoc PM',   years: '2025–2027', salK: 7,  color: 'blue',    optional: false },
      { id: 'pm',      label: 'PM',         years: '2027+',     salK: 12, color: 'emerald', optional: false },
    ],
    script: 'I have [X] UX projects with documented user impact. PM market P75 in KL is MYR 7,200. My current MYR 4,000 is 44% below market. I am requesting a structured PM transition track with a 90-day plan and salary movement to MYR 5,500 at the 30-day review.',
  },
};

// ─── Employer data ────────────────────────────────────────────────────────────
const EMPLOYER: Record<EmpTag, EmployerData> = {
  nextjs: {
    icon: '💼', label: 'Next.js Dev (<MYR 7K)', color: 'blue', budget: 7000,
    candidates: [
      { id: 'CAND-A7', badge: 'TOP 5%',  role: 'Next.js SSR Lead',   velocity: 97, target: 6800, notice: 'Immediate', match: 97, risk: 'LOW',    flags: ['SSR','TypeScript','Vercel','API Routes','Edge Fn'] },
      { id: 'CAND-B3', badge: 'TOP 12%', role: 'Full-Stack Next.js', velocity: 84, target: 7200, notice: '30 days',   match: 84, risk: 'MEDIUM', flags: ['React','Next.js','Postgres','AWS S3'] },
      { id: 'CAND-C9', badge: 'TOP 25%', role: 'Frontend Engineer',  velocity: 71, target: 5500, notice: 'Immediate', match: 71, risk: 'LOW',    flags: ['React','CSS Modules','Jest','Storybook'] },
    ],
    silver: [
      { id: 'SM-01', why: 'Insufficient TypeScript depth', ago: '5 months', upgrade: 'TypeScript-strict enforced across 4 production repos. Shipped enterprise auth module with zero regression.', match: 94, ask: 'MYR 6,900' },
      { id: 'SM-02', why: 'No SSR experience at interview', ago: '7 months', upgrade: 'Migrated 3 legacy React SPAs to Next.js 14 App Router. Vercel deployment certified.', match: 88, ask: 'MYR 6,400' },
    ],
    onboarding: { day: 18, prs: 14, align: 94, friction: 'MINIMAL', status: 'STABLE', note: 'Ahead of P50 ramp curve by 12 days. PR review turnaround: 4h avg.' },
    risks: [
      { name: 'Frontend Team · Bangsar South', risk: 92, reason: 'Three senior engineers received competing offers in the last 30 days. Competitor funding in KL frontend space up 40% this quarter.', color: 'rose' },
      { name: 'Mid-level FE · Petaling Jaya',  risk: 67, reason: 'Two mid engineers flagged at 34% below market P75. Peer compensation gap is the top driver of passive churn.', color: 'amber' },
    ],
    forecast: [
      { yr: '3 yr',  demand: 85, supply: 60, gap: 25 },
      { yr: '5 yr',  demand: 92, supply: 48, gap: 44 },
      { yr: '10 yr', demand: 78, supply: 31, gap: 47 },
    ],
  },

  dataeng: {
    icon: '📊', label: 'Data Engineer (<MYR 12K)', color: 'emerald', budget: 12000,
    candidates: [
      { id: 'CAND-D1', badge: 'TOP 3%',  role: 'Data Platform Lead',   velocity: 98, target: 11500, notice: '60 days',   match: 98, risk: 'LOW',    flags: ['Kafka','Flink','Spark','ClickHouse','dbt'] },
      { id: 'CAND-D4', badge: 'TOP 15%', role: 'Senior Data Engineer', velocity: 81, target: 10800, notice: '30 days',   match: 81, risk: 'MEDIUM', flags: ['Kafka','Python','Airflow','S3','Redshift'] },
      { id: 'CAND-D8', badge: 'TOP 30%', role: 'Analytics Engineer',   velocity: 69, target: 9500,  notice: 'Immediate', match: 69, risk: 'LOW',    flags: ['Python','dbt','BigQuery','Looker'] },
    ],
    silver: [
      { id: 'SM-03', why: 'Failed distributed systems design round', ago: '4 months', upgrade: 'Built real-time fraud detection pipeline handling 500M events/day at current role. Architecture documented publicly.', match: 91, ask: 'MYR 11,200' },
    ],
    onboarding: { day: 22, prs: 9, align: 87, friction: 'LOW', status: 'STABLE', note: 'On track. Schema migration PR needs one more review cycle before merge.' },
    risks: [
      { name: 'Data Platform Team · KL Sentral', risk: 78, reason: 'Tech lead posted LinkedIn content signalling open-to-work. Risk window: 60 days before active search begins.', color: 'rose' },
      { name: 'Analytics Cluster · Cyberjaya',   risk: 45, reason: 'Internal pay survey pending. Two data engineers self-flagged as underpaid vs market. No competing offer received yet.', color: 'amber' },
    ],
    forecast: [
      { yr: '3 yr',  demand: 95, supply: 55, gap: 40 },
      { yr: '5 yr',  demand: 99, supply: 40, gap: 59 },
      { yr: '10 yr', demand: 90, supply: 25, gap: 65 },
    ],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function seededRand(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function ContribGraph({ label }: { label: string }) {
  const seed  = label.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const WEEKS = 22;
  return (
    <div className="flex gap-[3px]">
      {Array.from({ length: WEEKS }, (_, w) => (
        <div key={w} className="flex flex-col gap-[3px]">
          {Array.from({ length: 7 }, (_, d) => {
            const r     = seededRand(seed + w * 7 + d);
            const alpha = r > 0.88 ? 1 : r > 0.68 ? 0.65 : r > 0.38 ? 0.32 : 0.07;
            return (
              <div key={d} className="w-2.5 h-2.5 rounded-sm"
                style={{ background: `rgba(52,211,153,${alpha})` }} />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  TALENT SUB-PAGES
// ══════════════════════════════════════════════════════════════════════════════

function CareerPathNavigator({ data }: { data: TalentData }) {
  const acc = P[data.color];
  return (
    <div className="space-y-4">
      <div className="text-[11px] font-black uppercase tracking-widest" style={{ color: acc.text }}>
        {data.pathTitle}
      </div>
      {/* Glowing node timeline */}
      <div className="relative pl-1">
        <div className="absolute left-3 top-2 bottom-2 w-px"
          style={{ background: `linear-gradient(to bottom, ${acc.bar} 0%, rgba(255,255,255,.07) 100%)` }} />
        <div className="space-y-3">
          {data.path.map((step, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center z-10 mt-0.5"
                style={{
                  background:  step.active ? acc.bar : 'rgba(255,255,255,.04)',
                  borderColor: step.active ? acc.bar : 'rgba(255,255,255,.14)',
                  boxShadow:   step.active ? `0 0 18px ${acc.glow}` : 'none',
                }}>
                {step.active && <div className="w-2 h-2 rounded-full bg-white neon-dot" />}
              </div>
              <div className="pb-2">
                <div className="text-white/25 text-[10px] font-bold">{step.step}</div>
                <div className="font-black text-white text-sm leading-snug">{step.role}</div>
                <div className="text-xs font-bold mt-0.5" style={{ color: acc.text }}>{step.sal}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Trade-off warning */}
      <div className="rounded-xl border p-3 text-xs leading-relaxed"
        style={{ background: P.amber.bg, borderColor: P.amber.border }}>
        <span className="font-black" style={{ color: P.amber.text }}>⚠️ Trade-off: </span>
        <span className="text-white/50">{data.pathWarn}</span>
      </div>
    </div>
  );
}

function LivingPortfolio({ data }: { data: TalentData }) {
  const events = [
    { time: '2h ago', msg: '[OS Event] Auto-verified 3 Next.js SSR repository merges into production. Manual CV updating deprecated.' },
    { time: '1d ago', msg: `[OS Scan] ${data.label}: contribution streak active. Signal strength: STRONG. Recruiter visibility: 78/100.` },
    { time: '3d ago', msg: '[ALERT] 0 open-source contributions in last 60 days. Employer-side visibility score drops below threshold in 14 days.' },
    { time: '5d ago', msg: '[OS Update] Tech stack fingerprint updated. Production deployment verified across 2 active repositories.' },
    { time: '7d ago', msg: '[MARKET] 340 KL companies querying your stack profile silently via Career OS recruiter index.' },
  ];
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/8 p-4 overflow-x-auto" style={{ background: 'rgba(0,0,0,.35)' }}>
        <div className="text-white/25 text-[10px] font-mono mb-3">
          GitHub Activity · {data.label} · Last 22 weeks
        </div>
        <ContribGraph label={data.label} />
        <div className="flex items-center gap-2 mt-3 text-[10px] text-white/22">
          <span>Less</span>
          {[0.07, 0.32, 0.65, 1].map((a, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
              style={{ background: `rgba(52,211,153,${a})` }} />
          ))}
          <span>More</span>
        </div>
      </div>
      <div className="rounded-xl border border-white/8 p-4 font-mono text-xs space-y-2"
        style={{ background: 'rgba(0,0,0,.35)' }}>
        <div className="text-white/22 mb-2">$ career-os --stream portfolio-events --live</div>
        {events.map((e, i) => (
          <div key={i} className="flex gap-3">
            <span className="text-white/22 flex-shrink-0 w-12">{e.time}</span>
            <span className="text-white/52 leading-relaxed">{e.msg}</span>
          </div>
        ))}
        <div className="flex items-center gap-1 text-white/18 pt-1">
          <span>$</span><span className="scan-blink" style={{ color: '#34d399' }}>█</span>
        </div>
      </div>
    </div>
  );
}

function AICareerCoach({ data }: { data: TalentData }) {
  const colorMap: Record<string, PKey> = { CRITICAL: 'rose', WARNING: 'amber', NOTICE: 'cyan' };
  return (
    <div className="space-y-4">
      <div className="text-[11px] text-white/38 uppercase tracking-widest font-black">
        Market signal monitor — {data.label}
      </div>
      <div className="rounded-xl border border-white/8 p-4 font-mono text-xs space-y-3"
        style={{ background: 'rgba(0,0,0,.45)' }}>
        <div className="text-white/22 mb-1">
          $ career-os --watch market-signals --profile {data.label.toLowerCase().replace(/\s+/g, '-')} --live
        </div>
        {data.alerts.map((a, i) => {
          const col = P[colorMap[a.lvl] ?? 'cyan'];
          return (
            <div key={i} className="flex gap-2 items-start">
              <span className="font-black flex-shrink-0 text-[9px] mt-0.5 px-1.5 py-0.5 rounded"
                style={{ background: col.bg, border: `1px solid ${col.border}`, color: col.text }}>
                {a.lvl}
              </span>
              <span className="text-white/55 leading-relaxed">{a.icon} {a.msg}</span>
            </div>
          );
        })}
        <div className="flex items-center gap-1 text-white/18 pt-1">
          <span>$</span><span className="scan-blink" style={{ color: '#fb7185' }}>█</span>
        </div>
      </div>
      <div className="rounded-xl border border-white/8 p-3 text-xs leading-relaxed"
        style={{ background: 'rgba(255,255,255,.03)' }}>
        <span className="font-black text-white/45">Monitoring scope: </span>
        <span className="text-white/30">
          KL tech job postings (real-time) · GitHub commit velocity · LinkedIn signal scrape · MDEC salary survey · MYR P75 market index
        </span>
      </div>
    </div>
  );
}

function FairPayEngine({ data }: { data: TalentData }) {
  const [salary, setSalary] = useState<number>(data.salary);
  const [copied, setCopied] = useState(false);
  const acc      = P[data.color];
  const gap      = data.marketP75 - salary;
  const gapPct   = Math.round(Math.abs(gap) / data.marketP75 * 100);
  const trackPct = Math.round(((salary - 3000) / 12000) * 100);

  const copy = () => {
    navigator.clipboard.writeText(data.script).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="space-y-4">
      {/* Slider panel */}
      <div className="rounded-xl border border-white/10 p-5" style={{ background: 'rgba(0,0,0,.3)' }}>
        <div className="flex justify-between items-end mb-4">
          <div>
            <div className="text-white/32 text-[10px] uppercase tracking-widest mb-1">Your current salary</div>
            <div className="text-3xl font-black text-white leading-none">
              MYR {salary.toLocaleString()}
              <span className="text-white/28 text-base">/mo</span>
            </div>
          </div>
          <div className="rounded-lg px-3 py-1.5 text-xs font-black"
            style={{
              background: gap > 0 ? 'rgba(251,113,133,.15)' : 'rgba(52,211,153,.15)',
              border:     gap > 0 ? '1px solid rgba(251,113,133,.3)' : '1px solid rgba(52,211,153,.3)',
              color:      gap > 0 ? '#fb7185' : '#34d399',
            }}>
            {gap > 0 ? `🚨 Underpaid by ${gapPct}%` : `✅ Above P75 (+${gapPct}%)`}
          </div>
        </div>
        <input
          type="range" min={3000} max={15000} step={100}
          value={salary}
          onChange={e => setSalary(Number(e.target.value))}
          className="salary-track"
          style={{
            background: `linear-gradient(to right, ${acc.bar} 0%, ${acc.bar} ${trackPct}%, rgba(255,255,255,.1) ${trackPct}%, rgba(255,255,255,.1) 100%)`,
          }}
        />
        <div className="flex justify-between text-white/22 text-[10px] mt-1.5">
          <span>MYR 3,000</span><span>MYR 15,000</span>
        </div>
      </div>
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'KL Market P75', val: `MYR ${data.marketP75.toLocaleString()}`, col: acc.text           },
          { label: 'Gap to close',  val: gap > 0 ? `+MYR ${gap.toLocaleString()}` : 'At market ✓', col: gap > 0 ? '#fb7185' : '#34d399' },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-white/8 p-4"
            style={{ background: 'rgba(255,255,255,.03)' }}>
            <div className="text-white/30 text-[10px] uppercase tracking-wider mb-1">{s.label}</div>
            <div className="text-xl font-black" style={{ color: s.col }}>{s.val}</div>
          </div>
        ))}
      </div>
      {/* Negotiation script */}
      <div className="rounded-xl border border-white/8 p-4" style={{ background: 'rgba(255,255,255,.03)' }}>
        <div className="flex justify-between items-center mb-3">
          <div className="text-[10px] text-white/38 uppercase tracking-widest font-black">
            No-Nonsense Leverage Script
          </div>
          <button onClick={copy}
            className="text-[10px] px-2.5 py-1 rounded-lg font-black transition-all"
            style={{
              background: copied ? 'rgba(52,211,153,.2)' : 'rgba(255,255,255,.08)',
              color:      copied ? '#34d399' : 'rgba(255,255,255,.42)',
            }}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <p className="text-white/40 text-xs leading-relaxed font-mono">{data.script}</p>
      </div>
    </div>
  );
}

function LifeChapterDesigner({ data }: { data: TalentData }) {
  const [breakOn, setBreakOn] = useState(false);
  const displayed = breakOn ? data.chapters : data.chapters.filter(c => !c.optional);
  const maxSal    = Math.max(...displayed.map(c => c.salK), 1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-[10px] text-white/32 uppercase tracking-widest font-black">Career Break Toggle</div>
        <button onClick={() => setBreakOn(v => !v)}
          className="flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black transition-all"
          style={{
            background:  breakOn ? P.amber.bg : 'rgba(255,255,255,.06)',
            border:     `1px solid ${breakOn ? P.amber.border : 'rgba(255,255,255,.12)'}`,
            color:       breakOn ? P.amber.text : 'rgba(255,255,255,.32)',
          }}>
          <span className="w-2.5 h-2.5 rounded-full transition-all"
            style={{ background: breakOn ? P.amber.bar : 'rgba(255,255,255,.22)' }} />
          {breakOn ? '3-Month Bootcamp Break: ON' : 'Add Career Break'}
        </button>
      </div>
      {/* Bar chart */}
      <div className="rounded-xl border border-white/8 p-4" style={{ background: 'rgba(0,0,0,.25)' }}>
        <div className="flex items-end gap-2 h-28 mb-3">
          {displayed.map(ch => {
            const heightPct = ch.salK === 0 ? 6 : Math.round((ch.salK / maxSal) * 100);
            return (
              <div key={ch.id} className="flex-1 flex flex-col items-center">
                <div className="w-full rounded-t-md bar-grow"
                  style={{
                    height:    `${heightPct}%`,
                    background: P[ch.color].bar,
                    opacity:    ch.optional ? 0.65 : 1,
                    boxShadow:  ch.optional ? `0 0 12px ${P[ch.color].glow}` : 'none',
                  }} />
              </div>
            );
          })}
        </div>
        <div className="flex gap-2">
          {displayed.map(ch => (
            <div key={ch.id} className="flex-1 text-center">
              <div className="text-white/42 text-[9px] font-black truncate">{ch.label}</div>
              <div className="text-white/22 text-[9px]">{ch.salK > 0 ? `MYR ${ch.salK}k` : 'MYR 0'}</div>
            </div>
          ))}
        </div>
      </div>
      {breakOn ? (
        <div className="rounded-xl border p-3 text-xs leading-relaxed"
          style={{ background: P.amber.bg, borderColor: P.amber.border }}>
          <span className="font-black" style={{ color: P.amber.text }}>+60% long-term trajectory spike. </span>
          <span className="text-white/45">
            Short-term MYR 0 cashflow is offset by accelerated post-bootcamp progression. KL boot-to-market median: 14 weeks. Net NPV positive at 18 months.
          </span>
        </div>
      ) : (
        <div className="rounded-xl border border-white/8 p-3 text-xs text-white/28 leading-relaxed"
          style={{ background: 'rgba(255,255,255,.02)' }}>
          Career planning that assumes linear, uninterrupted work is a fiction. Toggle the break above to model reality.
        </div>
      )}
    </div>
  );
}

function TalentTerminal() {
  const [input, setInput] = useState('');
  const [lines, setLines] = useState<{ text: string; type: 'sys' | 'cmd' | 'out' }[]>([
    { text: '> career-os v2.6.1 initialized', type: 'sys' },
    { text: '> Connected to Malaysia Tech Market API · live index', type: 'sys' },
    { text: '> Awaiting career anomaly override script...', type: 'sys' },
  ]);
  const submit = () => {
    if (!input.trim()) return;
    const cmd = input.trim();
    setLines(l => [
      ...l,
      { text: `$ ${cmd}`, type: 'cmd' },
      { text: '> Processing anomaly override... [ACCESS GRANTED]', type: 'out' },
      { text: '> Signal rerouted to alternative trajectory matrix. Index updated.', type: 'out' },
    ]);
    setInput('');
  };
  const colorMap = { sys: 'rgba(52,211,153,.58)', cmd: 'rgba(255,255,255,.65)', out: 'rgba(103,232,249,.58)' } as const;
  return (
    <div className="rounded-xl border border-white/8 bg-black/55 p-4 font-mono text-xs flex flex-col"
      style={{ height: '260px' }}>
      <div className="flex-1 overflow-y-auto space-y-1 mb-3 pr-1">
        {lines.map((l, i) => (
          <div key={i} style={{ color: colorMap[l.type] }}>{l.text}</div>
        ))}
      </div>
      <div className="flex items-center gap-2 border-t border-white/8 pt-3">
        <span className="text-white/28">$</span>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="Execute custom career anomaly override script..."
          className="flex-1 bg-transparent text-white/65 outline-none placeholder-white/14"
        />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  EMPLOYER SUB-PAGES
// ══════════════════════════════════════════════════════════════════════════════

function SmartTalentMatching({ data }: { data: EmployerData }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const acc = P[data.color];
  return (
    <div className="space-y-2">
      <div className="text-[10px] text-white/28 uppercase tracking-widest font-black mb-3">
        Budget ceiling: MYR {data.budget.toLocaleString()}/mo · {data.candidates.length} candidates ranked
      </div>
      {data.candidates.map(c => {
        const isOpen  = expanded === c.id;
        const riskCol = c.risk === 'LOW' ? P.emerald : c.risk === 'MEDIUM' ? P.amber : P.rose;
        return (
          <div key={c.id}>
            <button
              onClick={() => setExpanded(isOpen ? null : c.id)}
              className="w-full rounded-xl border border-white/8 p-4 text-left transition-all hover:border-white/18"
              style={{ background: isOpen ? acc.bg : 'rgba(255,255,255,.03)' }}>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="rounded-full px-2 py-0.5 text-[9px] font-black"
                  style={{ background: P.emerald.bg, border: `1px solid ${P.emerald.border}`, color: P.emerald.text }}>
                  {c.badge}
                </span>
                <span className="font-black text-white text-sm">{c.id}</span>
                <span className="text-white/35 text-xs">{c.role}</span>
                <div className="ml-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                  <div><span className="text-white/28">Velocity </span><span className="font-black text-white">{c.velocity}%</span></div>
                  <div><span className="text-white/28">Target </span><span className="font-black" style={{ color: acc.text }}>MYR {c.target.toLocaleString()}</span></div>
                  <div><span className="text-white/28">Notice </span><span className="font-black text-white">{c.notice}</span></div>
                  <span className="rounded px-2 py-0.5 text-[9px] font-black"
                    style={{ background: riskCol.bg, border: `1px solid ${riskCol.border}`, color: riskCol.text }}>
                    {c.risk}
                  </span>
                  <span className="text-white/22 text-[10px]">{isOpen ? '▲' : '▼'}</span>
                </div>
              </div>
            </button>
            {isOpen && (
              <div className="mx-3 rounded-b-xl border-x border-b border-white/8 px-4 py-3"
                style={{ background: 'rgba(0,0,0,.2)' }}>
                <div className="text-[10px] text-white/25 uppercase tracking-wider mb-2 font-black">Stack flags</div>
                <div className="flex flex-wrap gap-2">
                  {c.flags.map(f => (
                    <span key={f} className="rounded-full px-2.5 py-0.5 text-[10px] font-black"
                      style={{ background: acc.bg, border: `1px solid ${acc.border}`, color: acc.text }}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function RetentionSignals({ data }: { data: EmployerData }) {
  return (
    <div className="space-y-3">
      <div className="text-[10px] text-white/28 uppercase tracking-widest font-black mb-1">
        Team volatility signals · real-time
      </div>
      {data.risks.map((r, i) => {
        const col = P[r.color];
        return (
          <div key={i} className="rounded-xl border border-white/8 p-4"
            style={{ background: 'rgba(255,255,255,.03)' }}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-black text-white text-sm">{r.name}</span>
              <span className="font-black text-sm" style={{ color: col.text }}>Risk {r.risk}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden mb-3"
              style={{ background: 'rgba(255,255,255,.07)' }}>
              <div className="h-full rounded-full risk-bar" style={{ width: `${r.risk}%`, background: col.bar }} />
            </div>
            <p className="text-white/36 text-xs leading-relaxed">{r.reason}</p>
            {r.risk >= 75 && (
              <button className="mt-3 rounded-lg px-3 py-1.5 text-[10px] font-black hover:opacity-80 transition-opacity"
                style={{ background: col.bg, border: `1px solid ${col.border}`, color: col.text }}>
                ⚡ Trigger Retention Playbook
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TalentReEngagement({ data }: { data: EmployerData }) {
  const [engaged, setEngaged] = useState<Set<string>>(new Set());
  const acc = P[data.color];
  const engage = (id: string) =>
    setEngaged(prev => { const next = new Set(prev); next.add(id); return next; });
  return (
    <div className="space-y-3">
      <div className="text-[10px] text-white/28 uppercase tracking-widest font-black mb-1">
        Silver medalists · upskill-detected
      </div>
      {data.silver.map(s => (
        <div key={s.id} className="rounded-xl border border-white/8 p-4"
          style={{ background: 'rgba(255,255,255,.03)' }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] text-white/25 font-black uppercase">SILVER MEDALIST</span>
                <span className="text-[9px] text-white/16">· rejected {s.ago}</span>
              </div>
              <div className="text-xs mb-2">
                <span className="font-black text-white/48">Rejected: </span>
                <span className="text-white/35">{s.why}</span>
              </div>
              <div className="text-xs leading-relaxed mb-2" style={{ color: acc.text }}>
                ↑ OS-detected upgrade: {s.upgrade}
              </div>
              <div className="flex gap-4 text-[10px] text-white/28">
                <span>New match <strong className="text-white/68">{s.match}%</strong></span>
                <span>Asking <strong className="text-white/68">{s.ask}</strong></span>
              </div>
            </div>
            <button
              onClick={() => engage(s.id)}
              disabled={engaged.has(s.id)}
              className="flex-shrink-0 rounded-lg px-3 py-2 text-[10px] font-black transition-all"
              style={{
                background:  engaged.has(s.id) ? P.emerald.bg  : acc.bg,
                border:     `1px solid ${engaged.has(s.id) ? P.emerald.border : acc.border}`,
                color:       engaged.has(s.id) ? P.emerald.text : acc.text,
                opacity:     engaged.has(s.id) ? 0.7 : 1,
                cursor:      engaged.has(s.id) ? 'default' : 'pointer',
              }}>
              {engaged.has(s.id) ? '✓ Sent' : 'Re-Engage →'}
            </button>
          </div>
        </div>
      ))}
      <div className="text-center text-[10px] text-white/18 pt-1">
        {engaged.size} / {data.silver.length} re-engagements initiated this cycle
      </div>
    </div>
  );
}

function OnboardingPredictor({ data }: { data: EmployerData }) {
  const ob   = data.onboarding;
  const bars = [
    { label: 'PRs Merged',      val: ob.prs,   max: 20,  color: 'cyan'    as PKey },
    { label: 'Stack Alignment', val: ob.align, max: 100, color: 'emerald' as PKey },
  ];
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-white/8 p-4 font-mono text-xs space-y-2"
        style={{ background: 'rgba(0,0,0,.4)' }}>
        <div className="text-white/22 mb-1">$ career-os --onboard --candidate ACTIVE --day {ob.day}</div>
        <div style={{ color: 'rgba(52,211,153,.7)' }}>New Hire Day {ob.day}: {ob.prs} pull requests merged.</div>
        <div style={{ color: 'rgba(52,211,153,.7)' }}>Tech stack alignment score: {ob.align}%.</div>
        <div style={{ color: 'rgba(52,211,153,.7)' }}>Cultural friction index: {ob.friction}.</div>
        <div className="flex items-center gap-2" style={{ color: 'rgba(52,211,153,.7)' }}>
          <span>Status: {ob.status}</span>
          {ob.status === 'STABLE' && <span>✅</span>}
        </div>
        <div className="text-white/25 pt-1">{ob.note}</div>
        <div className="flex items-center gap-1 text-white/18 pt-1">
          <span>$</span><span className="scan-blink" style={{ color: '#34d399' }}>█</span>
        </div>
      </div>
      {bars.map(b => (
        <div key={b.label} className="rounded-xl border border-white/8 p-3"
          style={{ background: 'rgba(255,255,255,.03)' }}>
          <div className="flex justify-between mb-1.5">
            <span className="text-white/36 text-xs">{b.label}</span>
            <span className="text-xs font-black" style={{ color: P[b.color].text }}>
              {b.val}{b.max === 100 ? '%' : ''}
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,.07)' }}>
            <div className="h-full rounded-full risk-bar"
              style={{ width: `${(b.val / b.max) * 100}%`, background: P[b.color].bar }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function WorkforceResilience({ data }: { data: EmployerData }) {
  return (
    <div className="space-y-3">
      <div className="text-[10px] text-white/28 uppercase tracking-widest font-black mb-1">
        Talent gap forecast · {data.label}
      </div>
      {data.forecast.map(f => (
        <div key={f.yr} className="rounded-xl border border-white/8 p-4"
          style={{ background: 'rgba(255,255,255,.03)' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-black text-white text-sm">{f.yr} forecast</span>
            <span className="text-xs font-black" style={{ color: P.rose.text }}>Gap: {f.gap} pts</span>
          </div>
          <div className="space-y-2">
            {([
              { label: 'Demand', val: f.demand, color: 'fuchsia' as PKey },
              { label: 'Supply', val: f.supply, color: 'cyan'    as PKey },
            ]).map(bar => (
              <div key={bar.label}>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-white/30">{bar.label}</span>
                  <span className="font-black" style={{ color: P[bar.color].text }}>{bar.val}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: 'rgba(255,255,255,.07)' }}>
                  <div className="h-full rounded-full risk-bar"
                    style={{ width: `${bar.val}%`, background: P[bar.color].bar }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="rounded-xl border p-3 text-xs leading-relaxed"
        style={{ background: P.rose.bg, borderColor: P.rose.border }}>
        <span className="font-black" style={{ color: P.rose.text }}>⚠️ Malaysian aging tech crunch: </span>
        <span className="text-white/40">
          Working-age tech population declining 2.3%/yr. Pipeline refresh is non-optional beyond the 5-year horizon. Automate, retain, or import — choose now.
        </span>
      </div>
    </div>
  );
}

function EmployerTerminal() {
  const [input, setInput] = useState('');
  const [lines, setLines] = useState<{ text: string; type: 'sys' | 'cmd' | 'out' }[]>([
    { text: '> career-os enterprise v2.6.1', type: 'sys' },
    { text: '> B2B Talent Intelligence API: connected · Malaysia index live', type: 'sys' },
    { text: '> Query engine ready. Awaiting macro talent anomaly input...', type: 'sys' },
  ]);
  const submit = () => {
    if (!input.trim()) return;
    const cmd = input.trim();
    setLines(l => [
      ...l,
      { text: `$ ${cmd}`, type: 'cmd' },
      { text: '> Query processed. Macroeconomic anomaly pattern detected.', type: 'out' },
      { text: '> 4 relevant candidate trajectories surfaced. Pipeline updated.', type: 'out' },
    ]);
    setInput('');
  };
  const colorMap = { sys: 'rgba(96,165,250,.6)', cmd: 'rgba(255,255,255,.62)', out: 'rgba(103,232,249,.58)' } as const;
  return (
    <div className="rounded-xl border border-white/8 bg-black/55 p-4 font-mono text-xs flex flex-col"
      style={{ height: '260px' }}>
      <div className="flex-1 overflow-y-auto space-y-1 mb-3 pr-1">
        {lines.map((l, i) => (
          <div key={i} style={{ color: colorMap[l.type] }}>{l.text}</div>
        ))}
      </div>
      <div className="flex items-center gap-2 border-t border-white/8 pt-3">
        <span className="text-white/25">$</span>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="Query unstructured macroeconomic talent anomalies..."
          className="flex-1 bg-transparent text-white/62 outline-none placeholder-white/14"
        />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════

const TALENT_TABS = [
  { num: '01', label: 'Career Path', headline: "Stop guessing your next 40 years based on 2-sentence job descriptions." },
  { num: '02', label: 'Portfolio',   headline: "Static resumes lie. Your production commit stream doesn't." },
  { num: '03', label: 'AI Coach',    headline: "A relentless tech mentor monitoring your market value 24/7." },
  { num: '04', label: 'Fair Pay',    headline: "Are you paid what you're actually worth, or just what you settled for?" },
  { num: '05', label: 'Chapters',    headline: "Life has gaps. Your Career OS should architect them, not penalise them." },
  { num: '06', label: 'Your Track',  headline: "Candidates have problems we haven't named yet." },
];

const EMPLOYER_TABS = [
  { num: '01', label: 'Smart Match', headline: "HR screens historical text. Career OS evaluates future trajectory velocity." },
  { num: '02', label: 'Retention',   headline: "Why discover an engineer is quitting only when the resignation letter lands?" },
  { num: '03', label: 'Re-Engage',   headline: "Revive your silver-medalists. Bypass the 45-day hiring loop entirely." },
  { num: '04', label: 'Onboarding',  headline: "Intercept probation-stage churn before the 6-month mark." },
  { num: '05', label: 'Resilience',  headline: "The Malaysian aging tech crunch is incoming. Architect your 10-year buffer." },
  { num: '06', label: 'Your Track',  headline: "Employers face talent problems we haven't named yet." },
];

export function CareerOSPortal({ onBuildOwn, defaultMode = 'talent', hideToggle, hideCta }: Props) {
  const [mode,      setMode     ] = useState<ViewMode>(defaultMode);
  const [tTag,      setTTag     ] = useState<TalentTag>('cs_final');
  const [eTag,      setETag     ] = useState<EmpTag>('nextjs');
  const [activeTab, setActiveTab] = useState(0);

  // Reset to first tab whenever mode or tag changes
  useEffect(() => { setActiveTab(0); }, [mode, tTag, eTag]);

  const tData = TALENT[tTag];
  const eData = EMPLOYER[eTag];
  const acc   = P[mode === 'talent' ? tData.color : eData.color];
  const tabs  = mode === 'talent' ? TALENT_TABS : EMPLOYER_TABS;

  // contentKey forces sub-page remount (resets all local state) when tag/mode changes
  const contentKey = `${mode}-${tTag}-${eTag}`;

  const renderContent = () => {
    if (mode === 'talent') {
      switch (activeTab) {
        case 0: return <CareerPathNavigator data={tData} />;
        case 1: return <LivingPortfolio     data={tData} />;
        case 2: return <AICareerCoach       data={tData} />;
        case 3: return <FairPayEngine       data={tData} />;
        case 4: return <LifeChapterDesigner data={tData} />;
        case 5: return <TalentTerminal />;
        default: return null;
      }
    } else {
      switch (activeTab) {
        case 0: return <SmartTalentMatching data={eData} />;
        case 1: return <RetentionSignals    data={eData} />;
        case 2: return <TalentReEngagement  data={eData} />;
        case 3: return <OnboardingPredictor data={eData} />;
        case 4: return <WorkforceResilience data={eData} />;
        case 5: return <EmployerTerminal />;
        default: return null;
      }
    }
  };

  return (
    <>
      <style>{PORTAL_CSS}</style>

      <div style={{
        background: '#040911', borderRadius: '16px',
        border: '1px solid rgba(255,255,255,.07)', overflow: 'hidden',
      }}>

        {/* ── Header ───────────────────────────────────────────────── */}
        <div style={{ borderBottom: '1px solid rgba(255,255,255,.06)', padding: '14px 18px' }}>
          <div className="flex flex-wrap items-center gap-3">

            {/* Mode toggle */}
            {!hideToggle && (
              <div className="flex rounded-full overflow-hidden flex-shrink-0"
                style={{ border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.03)' }}>
                {(['talent', 'employer'] as ViewMode[]).map(m => (
                  <button key={m} onClick={() => setMode(m)}
                    className="mode-btn px-4 py-1.5 text-[10px] font-black uppercase tracking-wider"
                    style={{
                      background: mode === m ? acc.bar : 'transparent',
                      color:      mode === m ? '#000'  : 'rgba(255,255,255,.32)',
                    }}>
                    {m === 'talent' ? '🧑‍💻 Talent OS' : '🏢 Recruiter'}
                  </button>
                ))}
              </div>
            )}

            {/* Tag chips */}
            <div className="flex gap-2 flex-wrap">
              {mode === 'talent' ? (
                (['cs_final', 'node_dev', 'ux_pivot'] as TalentTag[]).map(tag => {
                  const td  = TALENT[tag];
                  const col = P[td.color];
                  const on  = tTag === tag;
                  return (
                    <button key={tag} onClick={() => setTTag(tag)}
                      className="tag-pill rounded-full px-3 py-1 text-[10px] font-black border"
                      style={{
                        background:  on ? col.bg    : 'transparent',
                        borderColor: on ? col.border : 'rgba(255,255,255,.1)',
                        color:       on ? col.text   : 'rgba(255,255,255,.28)',
                        boxShadow:   on ? `0 0 14px ${col.glow}` : 'none',
                      }}>
                      {td.icon} {td.label}
                    </button>
                  );
                })
              ) : (
                (['nextjs', 'dataeng'] as EmpTag[]).map(tag => {
                  const ed  = EMPLOYER[tag];
                  const col = P[ed.color];
                  const on  = eTag === tag;
                  return (
                    <button key={tag} onClick={() => setETag(tag)}
                      className="tag-pill rounded-full px-3 py-1 text-[10px] font-black border"
                      style={{
                        background:  on ? col.bg    : 'transparent',
                        borderColor: on ? col.border : 'rgba(255,255,255,.1)',
                        color:       on ? col.text   : 'rgba(255,255,255,.28)',
                        boxShadow:   on ? `0 0 14px ${col.glow}` : 'none',
                      }}>
                      {ed.icon} {ed.label}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* ── Body: sidebar + content ───────────────────────────────── */}
        <div className="flex flex-col md:flex-row" style={{ minHeight: '400px' }}>

          {/* Sidebar */}
          <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,.05)', minWidth: '130px' }}>
            <div className="flex md:flex-col gap-1 p-2 md:p-3 w-full">
              {tabs.map((t, i) => {
                const on = activeTab === i;
                return (
                  <button key={i} onClick={() => setActiveTab(i)}
                    className="tab-item text-left px-3 py-2.5 rounded-xl text-[10px] font-black whitespace-nowrap flex-shrink-0 md:flex-shrink md:whitespace-normal"
                    style={{
                      background:  on ? acc.bg    : 'transparent',
                      color:       on ? acc.text   : 'rgba(255,255,255,.22)',
                      borderLeft: `3px solid ${on ? acc.bar : 'transparent'}`,
                      boxShadow:   on ? `inset 0 0 14px ${acc.glow}` : 'none',
                    }}>
                    <span style={{ opacity: .42, marginRight: '4px' }}>{t.num}</span>{t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content panel */}
          <div className="flex-1 flex flex-col"
            style={{ borderLeft: '1px solid rgba(255,255,255,.05)' }}>
            {/* Sub-page headline */}
            <div style={{ borderBottom: '1px solid rgba(255,255,255,.05)', padding: '10px 18px' }}>
              <p className="text-white/36 text-xs leading-relaxed">
                {tabs[activeTab]?.headline}
              </p>
            </div>

            {/* Interactive content — key forces remount on tag/mode change */}
            <div key={contentKey} className="flex-1 p-4 fiu overflow-y-auto"
              style={{ maxHeight: '440px' }}>
              {renderContent()}
            </div>
          </div>
        </div>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        {!hideCta && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,.06)', padding: '14px 18px' }}>
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <p className="text-white/26 text-xs">
                {mode === 'talent'
                  ? 'Build your full Career OS profile — takes 4 minutes.'
                  : 'Access the full employer dashboard — real candidate pipeline.'}
              </p>
              <button onClick={onBuildOwn}
                className="cta-glow rounded-xl px-6 py-2.5 text-xs font-black flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${acc.bar}, ${acc.text})`, color: '#000' }}>
                {mode === 'talent' ? '🎓 Build My Career OS Profile →' : '🏢 Access Full Dashboard →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
