import { useState } from 'react';
import { StudentProfile } from '../types/evidence';

// ─── Types ────────────────────────────────────────────────────────────────────
type ViewMode  = 'talent' | 'employer';
type TalentTag = 'cs_final' | 'node_dev' | 'ux_pivot';
type EmpTag    = 'nextjs'   | 'dataeng';

interface Props {
  onViewDemo?: (profile: StudentProfile) => void;
  onBuildOwn: () => void;
  defaultMode?: ViewMode;
  hideToggle?: boolean;
  hideCta?: boolean;
}

// ─── Injected CSS ─────────────────────────────────────────────────────────────
const PORTAL_CSS = `
@keyframes fadeInUp {
  from { opacity:0; transform:translateY(20px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes floatY {
  0%,100% { transform:translateY(0px); }
  50%      { transform:translateY(-7px); }
}
@keyframes neonPulse {
  0%,100% { opacity:.5; }
  50%      { opacity:1; }
}
.fiu-0 { opacity:0; animation:fadeInUp .42s cubic-bezier(.16,1,.3,1) 0ms   forwards; }
.fiu-1 { opacity:0; animation:fadeInUp .42s cubic-bezier(.16,1,.3,1) 60ms  forwards; }
.fiu-2 { opacity:0; animation:fadeInUp .42s cubic-bezier(.16,1,.3,1) 120ms forwards; }
.fiu-3 { opacity:0; animation:fadeInUp .42s cubic-bezier(.16,1,.3,1) 180ms forwards; }
.fiu-4 { opacity:0; animation:fadeInUp .42s cubic-bezier(.16,1,.3,1) 240ms forwards; }
.float-y { animation:floatY 3.5s ease-in-out infinite; }
.neon-dot { animation:neonPulse 2s ease-in-out infinite; }
.portal-card {
  transition: transform .2s ease, box-shadow .2s ease, border-color .25s ease;
}
.portal-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 24px 60px rgba(0,0,0,.5), 0 0 40px rgba(168,85,247,.1);
  border-color: rgba(168,85,247,.28) !important;
}
.tag-pill { transition: all .18s ease; }
.tag-pill:not(.tag-active):hover {
  border-color: rgba(168,85,247,.4) !important;
  color: rgba(255,255,255,.8) !important;
  box-shadow: 0 0 16px rgba(168,85,247,.22);
}
.mode-slider { transition: left .32s cubic-bezier(.4,0,.2,1); }
.cta-glow { transition: transform .22s ease, box-shadow .22s ease; }
.cta-glow:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 40px rgba(168,85,247,.5), 0 0 80px rgba(34,211,238,.18);
}
`;

// ─── Palette (inline styles — avoids Tailwind purge issues with dynamic names) ─
const P = {
  fuchsia: { bg: 'rgba(168,85,247,.07)',  border: 'rgba(168,85,247,.22)', text: '#e879f9', bar: '#d946ef' },
  cyan:    { bg: 'rgba(34,211,238,.07)',  border: 'rgba(34,211,238,.22)', text: '#67e8f9', bar: '#22d3ee' },
  emerald: { bg: 'rgba(52,211,153,.07)',  border: 'rgba(52,211,153,.22)', text: '#6ee7b7', bar: '#34d399' },
  amber:   { bg: 'rgba(251,191,36,.07)',  border: 'rgba(251,191,36,.22)', text: '#fcd34d', bar: '#fbbf24' },
  rose:    { bg: 'rgba(251,113,133,.07)', border: 'rgba(251,113,133,.22)', text: '#fda4af', bar: '#fb7185' },
  blue:    { bg: 'rgba(96,165,250,.07)',  border: 'rgba(96,165,250,.22)', text: '#93c5fd',  bar: '#60a5fa' },
} as const;
type PKey = keyof typeof P;

// ─── Micro-components ─────────────────────────────────────────────────────────

function Alert({ icon, title, body, color = 'rose' }: { icon: string; title: string; body: string; color?: PKey }) {
  const c = P[color];
  return (
    <div className="rounded-xl border px-4 py-3" style={{ backgroundColor: c.bg, borderColor: c.border }}>
      <div className="font-black text-sm mb-1" style={{ color: c.text }}>{icon} {title}</div>
      <p className="text-xs leading-relaxed" style={{ color: c.text, opacity: .65 }}>{body}</p>
    </div>
  );
}

function SalBar({ label, myr, pct, color }: { label: string; myr: string; pct: number; color: PKey }) {
  const c = P[color];
  return (
    <div className="mb-2.5 last:mb-0">
      <div className="flex justify-between mb-1">
        <span className="text-xs text-white/40">{label}</span>
        <span className="text-xs font-black" style={{ color: c.text }}>{myr}</span>
      </div>
      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,.07)' }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c.bar }} />
      </div>
    </div>
  );
}

function StatGrid({ stats }: { stats: { val: string; label: string; color?: PKey }[] }) {
  return (
    <div className={`grid gap-3 ${stats.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
      {stats.map(s => (
        <div key={s.label} className="rounded-xl border border-white/8 p-3 text-center" style={{ background: 'rgba(255,255,255,.03)' }}>
          <div className="text-2xl font-black" style={{ color: s.color ? P[s.color].text : 'white' }}>{s.val}</div>
          <div className="text-white/35 text-xs mt-0.5 leading-tight">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function Row({ items }: { items: { key: string; label: string; val: string; note?: string }[] }) {
  return (
    <div className="space-y-0 divide-y divide-white/6">
      {items.map(r => (
        <div key={r.key} className="flex items-center justify-between py-2.5">
          <span className="text-white/40 text-xs flex-1">{r.label}</span>
          {r.note && <span className="text-white/25 text-xs mx-3">{r.note}</span>}
          <span className="text-white text-xs font-black">{r.val}</span>
        </div>
      ))}
    </div>
  );
}

function Timeline({ steps }: { steps: { yr: string; title: string; note: string; color: PKey }[] }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-0 bottom-0 w-px" style={{ background: 'rgba(255,255,255,.08)' }} />
      {steps.map((t, i) => (
        <div key={i} className="flex gap-4 mb-3 last:mb-0">
          <div className="flex flex-col items-center w-6 flex-shrink-0 z-10">
            <div className="w-2.5 h-2.5 rounded-full mt-1" style={{ background: P[t.color].bar }} />
          </div>
          <div className="pb-3">
            <div className="text-white/30 text-xs">{t.yr}</div>
            <div className="font-black text-white text-sm leading-snug">{t.title}</div>
            <div className="text-white/40 text-xs mt-0.5">{t.note}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Module type ──────────────────────────────────────────────────────────────
type Mod = { num: string; title: string; tagline: string; body: React.ReactNode; accent: PKey };

// ══════════════════════════════════════════════════════════════════════════════
//  TALENT MODULES
// ══════════════════════════════════════════════════════════════════════════════

// ── Final Year CS ─────────────────────────────────────────────────────────────
const CS_MODS: Mod[] = [
  {
    num: '01', accent: 'fuchsia',
    title: 'Career Path Navigator',
    tagline: 'Stop guessing your next move.',
    body: (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {([
            { label: '🏢 Corporate Track', start: 'MYR 5,500', ceiling: 'MYR 16,000', pct: 62, color: 'cyan' as PKey, risk: 'Stack locked in private cloud. Tech asset depreciation 40% in 3yr.' },
            { label: '🚀 Startup Track',   start: 'MYR 4,200', ceiling: 'MYR 32,000+', pct: 82, color: 'fuchsia' as PKey, risk: 'KL startup survival rate: 22%. Equity upside real — timing lethal.' },
          ]).map(p => (
            <div key={p.label} className="rounded-xl border p-4" style={{ background: P[p.color].bg, borderColor: P[p.color].border }}>
              <div className="font-black text-white text-xs mb-2">{p.label}</div>
              <div className="font-black text-lg leading-none" style={{ color: P[p.color].text }}>{p.start}</div>
              <div className="text-white/25 text-xs">→ {p.ceiling}</div>
              <div className="mt-2.5 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,.07)' }}>
                <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: P[p.color].bar }} />
              </div>
              <p className="text-white/30 text-xs mt-2 leading-relaxed">{p.risk}</p>
            </div>
          ))}
        </div>
        <Alert icon="⚠️" color="amber" title="0 production deployments detected." body="Both tracks auto-filter candidates without a live URL. Localhost code is invisible to every ATS and recruiter shortlist in Malaysia." />
      </div>
    ),
  },
  {
    num: '02', accent: 'cyan',
    title: 'Living Portfolio',
    tagline: 'Resume is dead. Live proof only.',
    body: (
      <div className="space-y-3">
        <StatGrid stats={[
          { val: '0',  label: 'Deployed apps',   color: 'rose' },
          { val: '12', label: 'GitHub commits',   color: 'cyan' },
          { val: '0',  label: 'Production URLs',  color: 'rose' },
        ]} />
        <div className="rounded-xl border border-white/6 p-4" style={{ background: 'rgba(0,0,0,.25)' }}>
          <div className="text-white/20 text-xs font-black uppercase tracking-widest mb-2">Auto-detected repos</div>
          {[
            { label: 'Node.js · 3 repos · last push 4d ago', ok: true },
            { label: 'React · 1 repo · 0 deployment URL ⚠', ok: false },
            { label: 'Python · 2 repos · academic only',     ok: false },
          ].map(r => (
            <div key={r.label} className="flex items-center gap-2.5 py-1.5 border-b border-white/5 last:border-0">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: r.ok ? P.emerald.bar : P.rose.bar }} />
              <span className="text-white/45 text-xs">{r.label}</span>
            </div>
          ))}
        </div>
        <Alert icon="🔴" color="rose" title="Recruiter filter: 0 production deployments = auto-skip." body='"localhost:3000" is not a portfolio. You are invisible to automated shortlisting at Grab, Shopee, Axiata Digital.' />
      </div>
    ),
  },
  {
    num: '03', accent: 'rose',
    title: 'AI Career Coach',
    tagline: 'Not motivational. Diagnostic.',
    body: (
      <div className="space-y-3">
        <Alert icon="🚨" color="rose" title="Stack Liquidity Alert" body="You've spent 24 months on the same academic stack. Market data signals skill liquidity freeze. Reskilling window closes in 6 months." />
        <div className="rounded-xl border p-4" style={{ background: P.emerald.bg, borderColor: P.emerald.border }}>
          <div className="font-black text-sm mb-3" style={{ color: P.emerald.text }}>📋 Prescription: 90-Day Sprint</div>
          <div className="space-y-2">
            {[
              { d: '0–30d', a: 'Deploy 1 app to Vercel. Any stack. Today.',          hot: true },
              { d: '30–60d', a: 'Contribute 1 PR to an OSS project in Malaysia tech.', hot: false },
              { d: '60–90d', a: 'Land 1 freelance micro-project. MYR 200 minimum.',   hot: false },
            ].map(r => (
              <div key={r.d} className="flex items-start gap-2">
                <span className="text-xs font-black rounded-full px-2 py-0.5 flex-shrink-0"
                  style={{ background: r.hot ? P.emerald.bar : 'rgba(255,255,255,.1)', color: r.hot ? '#000' : 'rgba(255,255,255,.5)' }}>
                  {r.d}
                </span>
                <span className="text-white/55 text-xs leading-relaxed">{r.a}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    num: '04', accent: 'emerald',
    title: 'Fair Pay Engine',
    tagline: 'Know your number before the offer lands.',
    body: (
      <div className="space-y-4">
        <div className="text-center py-2">
          <div className="text-white/25 text-xs mb-1">Your projected start</div>
          <div className="text-5xl font-black text-white tracking-tight">MYR 4,800</div>
          <div className="text-white/20 text-xs mt-1">/month</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border p-4 text-center" style={{ background: P.rose.bg, borderColor: P.rose.border }}>
            <div className="text-xs text-white/35 mb-1">KL Fresh Grad Median</div>
            <div className="text-2xl font-black" style={{ color: P.rose.text }}>MYR 5,500</div>
          </div>
          <div className="rounded-xl border p-4 text-center" style={{ background: P.fuchsia.bg, borderColor: P.fuchsia.border }}>
            <div className="text-xs text-white/35 mb-1">5-year cost of gap</div>
            <div className="text-2xl font-black" style={{ color: P.fuchsia.text }}>−MYR 52K</div>
          </div>
        </div>
        <Alert icon="🚨" color="rose" title="MYR 700/mo gap compounds for 5 years = MYR 52K lost." body="Every month you accept below-median pay, you reset your negotiation anchor permanently. Deploy 1 live project before your first offer — it's worth MYR 700/mo." />
      </div>
    ),
  },
  {
    num: '05', accent: 'amber',
    title: 'Life Chapter Designer',
    tagline: 'Engineer your timeline before the market does.',
    body: (
      <div className="space-y-3">
        <Timeline steps={[
          { yr: 'Now',   title: 'Grad · Job search',   note: 'Runway: family support',        color: 'rose' },
          { yr: '+6mo',  title: 'Junior SWE hired',    note: 'MYR 4,800/mo — standard offer', color: 'cyan' },
          { yr: '+1yr',  title: 'First performance review', note: '+MYR 1,000 if 1 live app on CV', color: 'fuchsia' },
          { yr: '+2yr',  title: 'Mid SWE target',      note: 'MYR 8,500/mo with cloud evidence', color: 'emerald' },
        ]} />
        <div className="rounded-xl border p-4" style={{ background: P.amber.bg, borderColor: P.amber.border }}>
          <div className="font-black text-xs mb-2" style={{ color: P.amber.text }}>➕ Insert: 3-Month AI Bootcamp</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-white/40">Cash cost: <span className="font-black" style={{ color: P.rose.text }}>−MYR 14,400</span></div>
            <div className="text-white/40">3yr uplift: <span className="font-black" style={{ color: P.emerald.text }}>+MYR 126K</span></div>
          </div>
        </div>
      </div>
    ),
  },
];

// ── 2 YOE Node.js Dev ─────────────────────────────────────────────────────────
const ND_MODS: Mod[] = [
  {
    num: '01', accent: 'fuchsia',
    title: 'Career Path Navigator',
    tagline: 'Node.js ceiling incoming. Navigate now.',
    body: (
      <div className="space-y-3">
        <div className="rounded-xl border border-white/8 p-4" style={{ background: 'rgba(255,255,255,.03)' }}>
          <div className="flex justify-between items-baseline mb-4">
            <div className="text-white/40 text-xs">Current base</div>
            <div className="font-black text-2xl" style={{ color: P.fuchsia.text }}>MYR 6,500<span className="text-sm text-white/30">/mo</span></div>
          </div>
          <SalBar label="KL Node.js Median (2 YOE)"   myr="MYR 9,500"  pct={62} color="cyan"    />
          <SalBar label="Backend + AWS Architect"       myr="MYR 14,000" pct={88} color="fuchsia" />
          <SalBar label="Staff Engineer (8yr track)"    myr="MYR 22,000" pct={100} color="emerald" />
        </div>
        <Alert icon="⚡" color="cyan" title="Node.js alone: MYR 8K hard ceiling by Year 4." body="Without distributed systems or cloud ownership, you plateau fast. KL market pays for the next layer — not more Express.js routes." />
      </div>
    ),
  },
  {
    num: '02', accent: 'cyan',
    title: 'Living Portfolio',
    tagline: 'Your repos say junior. Recruiters agree.',
    body: (
      <div className="space-y-3">
        <StatGrid stats={[
          { val: '3', label: 'Node repos',          color: 'cyan' },
          { val: '0', label: 'Cloud deploys',        color: 'rose' },
          { val: '0', label: 'System design docs',   color: 'rose' },
        ]} />
        <Alert icon="🔴" color="rose" title="Senior role auto-filter: rejected." body="Every Senior BE role at Grab, Shopee, GoTo requires distributed systems ownership evidence. None is indexed against your profile." />
        <div className="rounded-xl border p-3" style={{ background: P.emerald.bg, borderColor: P.emerald.border }}>
          <div className="font-black text-xs mb-1" style={{ color: P.emerald.text }}>Fix in 60 days:</div>
          <p className="text-white/45 text-xs leading-relaxed">Deploy Node + Kafka + Redis to AWS. Document architecture. That's the only delta between MYR 6,500 and MYR 11,000.</p>
        </div>
      </div>
    ),
  },
  {
    num: '03', accent: 'rose',
    title: 'AI Career Coach',
    tagline: 'Fullstack or specialize. Pick one. Now.',
    body: (
      <div className="space-y-3">
        <Alert icon="🧠" color="amber" title="Stack Spread Risk Detected" body="Node, React, MongoDB, a bit of Python. Market doesn't pay generalist premiums at the 2 YOE level. You're diluting your leverage." />
        <div className="space-y-2">
          {([
            { path: 'Specialize: Backend / Cloud', roi: '+MYR 4,500/mo · 18mo', risk: 'Low — AWS SAA cert path is clear', color: 'emerald' as PKey },
            { path: 'Go fullstack (MERN)', roi: '+MYR 1,500/mo · 12mo', risk: 'Low — but ceiling caps at MYR 9K in KL', color: 'cyan'    as PKey },
            { path: 'Stay put · wait',          roi: 'MYR 0 uplift',          risk: 'High — inflation eats 6% real salary/yr', color: 'rose'    as PKey },
          ]).map(o => (
            <div key={o.path} className="rounded-xl border p-3" style={{ background: P[o.color].bg, borderColor: P[o.color].border }}>
              <div className="font-black text-xs mb-1" style={{ color: P[o.color].text }}>{o.path}</div>
              <div className="text-white/45 text-xs">{o.roi} · {o.risk}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    num: '04', accent: 'emerald',
    title: 'Fair Pay Engine',
    tagline: 'MYR 3,000/mo underpaid. Own this data.',
    body: (
      <div className="space-y-4">
        <div className="flex items-end gap-4 p-4 rounded-xl border" style={{ background: P.rose.bg, borderColor: P.rose.border }}>
          <div>
            <div className="text-white/30 text-xs mb-1">Your base</div>
            <div className="text-4xl font-black text-white">MYR 6,500</div>
          </div>
          <div className="font-black text-xl mb-1" style={{ color: P.rose.text }}>vs</div>
          <div>
            <div className="text-white/30 text-xs mb-1">KL Node.js Median</div>
            <div className="text-4xl font-black" style={{ color: P.rose.text }}>MYR 9,500</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border p-4 text-center" style={{ background: P.rose.bg, borderColor: P.rose.border }}>
            <div className="text-xs text-white/30 mb-1">Monthly gap</div>
            <div className="text-2xl font-black" style={{ color: P.rose.text }}>−MYR 3,000</div>
          </div>
          <div className="rounded-xl border p-4 text-center" style={{ background: P.rose.bg, borderColor: P.rose.border }}>
            <div className="text-xs text-white/30 mb-1">3-year total cost</div>
            <div className="text-2xl font-black" style={{ color: P.rose.text }}>−MYR 108K</div>
          </div>
        </div>
        <div className="rounded-xl border p-3" style={{ background: P.fuchsia.bg, borderColor: P.fuchsia.border }}>
          <div className="font-black text-xs mb-1" style={{ color: P.fuchsia.text }}>Negotiation data package ready:</div>
          <p className="text-white/40 text-xs">AWS SAA + 1 distributed system project = MYR 10,500 market rate. Use this in your next review conversation.</p>
        </div>
      </div>
    ),
  },
  {
    num: '05', accent: 'amber',
    title: 'Life Chapter Designer',
    tagline: 'AWS cert gap costs you MYR 66K in 12 months.',
    body: (
      <div className="space-y-3">
        <Timeline steps={[
          { yr: 'Now',   title: 'Node.js Dev · MYR 6,500',   note: 'Ceiling locked without cloud evidence', color: 'rose'    },
          { yr: '+3mo',  title: 'AWS SAA certification',      note: '8h/week study + MYR 900 exam fee',      color: 'amber'   },
          { yr: '+6mo',  title: 'Senior BE applications',     note: 'Targeting MYR 11,000–14,000 roles',     color: 'fuchsia' },
          { yr: '+12mo', title: 'Mid-Senior SWE · MYR 12,000', note: '+MYR 5,500/mo vs doing nothing',       color: 'emerald' },
        ]} />
        <div className="rounded-xl border p-4 text-center" style={{ background: P.emerald.bg, borderColor: P.emerald.border }}>
          <div className="font-black text-sm" style={{ color: P.emerald.text }}>ROI: +MYR 66K over 12 months</div>
          <div className="text-white/30 text-xs mt-0.5">vs cost of AWS exam: MYR 900 one-time</div>
        </div>
      </div>
    ),
  },
];

// ── Non-Tech UI/UX Pivot ───────────────────────────────────────────────────────
const UX_MODS: Mod[] = [
  {
    num: '01', accent: 'fuchsia',
    title: 'Career Path Navigator',
    tagline: 'Non-tech UX in Malaysia: oversupplied. Fast.',
    body: (
      <div className="space-y-2.5">
        {([
          { label: '🎨 Non-Tech UX Designer',             range: 'MYR 3,200–6,000', ceiling: 'MYR 8,000',  pct: 30, color: 'rose'    as PKey, note: 'Oversupplied. Canva killed commodity design work.' },
          { label: '🎨+💻 Product Designer (Figma+React)', range: 'MYR 7,000–15,000', ceiling: 'MYR 22,000', pct: 68, color: 'cyan'    as PKey, note: 'Rare. Design systems + frontend = high leverage.' },
          { label: '📊 UX Researcher (quant+qual)',       range: 'MYR 6,000–12,000', ceiling: 'MYR 18,000', pct: 52, color: 'fuchsia' as PKey, note: 'Defensible niche in fintech/healthtech.' },
        ]).map(p => (
          <div key={p.label} className="rounded-xl border p-4" style={{ background: P[p.color].bg, borderColor: P[p.color].border }}>
            <div className="font-black text-white text-xs mb-1">{p.label}</div>
            <div className="font-black" style={{ color: P[p.color].text }}>{p.range}</div>
            <div className="text-white/25 text-xs">Ceiling: {p.ceiling}</div>
            <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,.07)' }}>
              <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: P[p.color].bar }} />
            </div>
            <p className="text-white/30 text-xs mt-1.5">{p.note}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    num: '02', accent: 'cyan',
    title: 'Living Portfolio',
    tagline: 'Figma files ≠ portfolio. Shipped product = portfolio.',
    body: (
      <div className="space-y-3">
        <StatGrid stats={[
          { val: '0', label: 'Case studies',     color: 'rose'  },
          { val: '2', label: 'Figma files',       color: 'amber' },
          { val: '0', label: 'Shipped products',  color: 'rose'  },
        ]} />
        <Alert icon="🔴" color="rose" title="30-second recruiter scan: fail." body="No before/after metrics. No user testing evidence. No shipped product. Behance-level presentation fails at product-led companies." />
        <div className="rounded-xl border p-3" style={{ background: P.cyan.bg, borderColor: P.cyan.border }}>
          <div className="font-black text-xs mb-1" style={{ color: P.cyan.text }}>Minimum viable portfolio (90 days):</div>
          <p className="text-white/45 text-xs leading-relaxed">1 shipped product with analytics · 1 usability test report · 1 design system in Figma + Storybook</p>
        </div>
      </div>
    ),
  },
  {
    num: '03', accent: 'rose',
    title: 'AI Career Coach',
    tagline: 'You need an unfair advantage. Here it is.',
    body: (
      <div className="space-y-3">
        <Alert icon="⚠️" color="amber" title="Commodity warning: non-tech UX" body="Malaysia produces 4,200+ UX graduates per year chasing ~800 roles. Without a differentiator, you compete on price." />
        <div className="space-y-2">
          {([
            { opt: 'Learn React (3mo)',       unlock: '+MYR 5,700/mo · Product Designer title', verdict: 'Highest ROI', vc: 'emerald' as PKey },
            { opt: 'Specialize: Fintech UX',  unlock: '+MYR 2,500/mo · niche premium',          verdict: 'Medium ROI',  vc: 'amber'   as PKey },
            { opt: 'UX Research pivot',       unlock: 'MYR 9,000 stable ceiling',               verdict: 'Safe bet',    vc: 'cyan'    as PKey },
          ]).map(o => (
            <div key={o.opt} className="flex items-center justify-between rounded-xl border px-4 py-3" style={{ background: 'rgba(255,255,255,.03)', borderColor: 'rgba(255,255,255,.08)' }}>
              <div>
                <div className="text-white text-xs font-black">{o.opt}</div>
                <div className="text-white/35 text-xs">{o.unlock}</div>
              </div>
              <span className="text-xs font-black" style={{ color: P[o.vc].text }}>{o.verdict}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    num: '04', accent: 'emerald',
    title: 'Fair Pay Engine',
    tagline: 'MYR 8,200/mo gap. The data is brutal.',
    body: (
      <div className="space-y-4">
        <div className="text-center p-4 rounded-xl border border-white/8" style={{ background: 'rgba(255,255,255,.03)' }}>
          <div className="text-white/30 text-xs mb-1">Non-tech UX today</div>
          <div className="text-5xl font-black text-white">MYR 3,800</div>
          <div className="text-white/20 text-xs mt-0.5">/month</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border p-4 text-center" style={{ background: P.cyan.bg, borderColor: P.cyan.border }}>
            <div className="text-xs text-white/30 mb-1">Product Designer (+React)</div>
            <div className="text-xl font-black" style={{ color: P.cyan.text }}>MYR 9,500</div>
            <div className="text-xs font-black mt-1" style={{ color: P.emerald.text }}>+MYR 5,700/mo</div>
          </div>
          <div className="rounded-xl border p-4 text-center" style={{ background: P.fuchsia.bg, borderColor: P.fuchsia.border }}>
            <div className="text-xs text-white/30 mb-1">Senior PD (5yr)</div>
            <div className="text-xl font-black" style={{ color: P.fuchsia.text }}>MYR 15,000</div>
            <div className="text-xs font-black mt-1" style={{ color: P.emerald.text }}>+MYR 11,200/mo</div>
          </div>
        </div>
        <Alert icon="💡" color="cyan" title="3-month React investment · 5-year compounding premium." body="MYR 5,700/mo uplift × 60 months = MYR 342,000 additional earnings vs staying non-tech. ROI: 28× in 5 years." />
      </div>
    ),
  },
  {
    num: '05', accent: 'amber',
    title: 'Life Chapter Designer',
    tagline: 'React bootcamp ROI is irrational. Do it anyway.',
    body: (
      <div className="space-y-3">
        <Timeline steps={[
          { yr: 'Now',   title: 'Non-Tech UX · MYR 3,800',    note: 'High supply, zero leverage',              color: 'rose'    },
          { yr: '+3mo',  title: 'React bootcamp',              note: 'Cost: MYR 12,000 · 15h/week commitment',   color: 'amber'   },
          { yr: '+6mo',  title: 'Product Designer applications', note: 'Target: Shopee, CIMB Digital, Axiata',   color: 'cyan'    },
          { yr: '+9mo',  title: 'Product Designer · MYR 9,500', note: 'Goal achieved. Continue to Senior PD.',  color: 'emerald' },
        ]} />
        <div className="rounded-xl border p-3 text-center" style={{ background: P.emerald.bg, borderColor: P.emerald.border }}>
          <div className="font-black text-sm" style={{ color: P.emerald.text }}>Total investment: MYR 12,000 + 3 months</div>
          <div className="text-white/30 text-xs mt-0.5">5yr return: +MYR 342,000. ROI: 28×.</div>
        </div>
      </div>
    ),
  },
];

// ══════════════════════════════════════════════════════════════════════════════
//  EMPLOYER MODULES
// ══════════════════════════════════════════════════════════════════════════════

// ── Next.js Dev <MYR 7K ───────────────────────────────────────────────────────
const NJ_MODS: Mod[] = [
  {
    num: '01', accent: 'blue',
    title: 'Smart Talent Matching',
    tagline: 'HR screens history. Career OS matches trajectory.',
    body: (
      <div className="space-y-3">
        <div className="rounded-xl border p-4" style={{ background: P.blue.bg, borderColor: P.blue.border }}>
          <div className="font-black text-sm mb-3" style={{ color: P.blue.text }}>3 trajectory matches · Next.js &lt;MYR 7K</div>
          {[
            { name: 'Candidate A', velocity: 91, eta: '3mo',  ask: 'MYR 6,200', signal: 'ACCELERATING', sc: 'emerald' as PKey },
            { name: 'Candidate B', velocity: 72, eta: '6mo',  ask: 'MYR 5,800', signal: 'ON TRACK',     sc: 'cyan'    as PKey },
            { name: 'Candidate C', velocity: 44, eta: '12mo', ask: 'MYR 5,500', signal: 'STAGNATING',   sc: 'amber'   as PKey },
          ].map(c => (
            <div key={c.name} className="flex items-center gap-3 py-2.5 border-b border-white/6 last:border-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                style={{ background: P.blue.bg, color: P.blue.text }}>
                {c.name.split(' ')[1]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white text-xs font-black">{c.name}</span>
                  <span className="text-xs font-black" style={{ color: P[c.sc].text }}>{c.signal}</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,.07)' }}>
                  <div className="h-full rounded-full" style={{ width: `${c.velocity}%`, background: P.blue.bar }} />
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-white text-xs font-black">{c.ask}</div>
                <div className="text-white/30 text-xs">ETA: {c.eta}</div>
              </div>
            </div>
          ))}
        </div>
        <Alert icon="💡" color="cyan" title="Velocity beats keywords." body="Candidate A has 41% fewer years of experience than your JD requires — but is the fastest-accelerating Next.js profile in KL this quarter." />
      </div>
    ),
  },
  {
    num: '02', accent: 'rose',
    title: 'Talent Retention Signals',
    tagline: 'Find out before the resignation letter lands.',
    body: (
      <div className="space-y-3">
        <Alert icon="⚠️" color="rose" title="Competitor headhunting surge · your stack." body="KL Tech Hub: Next.js/React recruiter outreach +340% this quarter. Your team is actively targeted. 2 engineers viewed competitor JDs this week." />
        <div className="space-y-2">
          {[
            { eng: 'Engineer 1', risk: 92, signal: 'LinkedIn: Open to Work (stealth mode)',   action: 'Immediate counter-offer review',        rc: 'rose'    as PKey },
            { eng: 'Engineer 2', risk: 71, signal: 'Tech stack frustration score: 8.2/10',   action: 'Architecture autonomy conversation',    rc: 'amber'   as PKey },
            { eng: 'Engineer 3', risk: 28, signal: 'Engaged · high commit velocity this mo', action: 'Monitor only — no action needed',       rc: 'emerald' as PKey },
          ].map(e => (
            <div key={e.eng} className="rounded-xl border p-3" style={{ background: 'rgba(255,255,255,.03)', borderColor: 'rgba(255,255,255,.08)' }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-white text-xs font-black">{e.eng}</span>
                <span className="text-xs font-black" style={{ color: P[e.rc].text }}>Risk: {e.risk}%</span>
              </div>
              <div className="text-white/35 text-xs mb-1">{e.signal}</div>
              <div className="text-white/55 text-xs font-bold">→ {e.action}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    num: '03', accent: 'amber',
    title: 'Talent Re-Engagement',
    tagline: 'Your silver medalist just leveled up.',
    body: (
      <div className="space-y-3">
        <div className="rounded-xl border p-4" style={{ background: P.amber.bg, borderColor: P.amber.border }}>
          <div className="font-black text-sm mb-3" style={{ color: P.amber.text }}>1 auto-surfaced candidate</div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0" style={{ background: P.amber.bg }}>👤</div>
            <div className="flex-1">
              <div className="font-black text-white text-sm">Candidate D</div>
              <div className="text-white/40 text-xs mb-2">Rejected 8mo ago · failed system design round</div>
              {[
                '✅ 2 Next.js apps in production since rejection',
                '✅ Vercel deployment + full CI/CD pipeline live',
                '✅ Contributing to OSS Next.js ecosystem',
              ].map(item => <div key={item} className="text-xs text-white/55 mb-0.5">{item}</div>)}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border p-3 text-center" style={{ background: P.emerald.bg, borderColor: P.emerald.border }}>
            <div className="font-black text-lg" style={{ color: P.emerald.text }}>94%</div>
            <div className="text-white/30 text-xs">Match score</div>
          </div>
          <div className="rounded-xl border p-3 text-center" style={{ background: P.blue.bg, borderColor: P.blue.border }}>
            <div className="font-black text-lg" style={{ color: P.blue.text }}>MYR 0</div>
            <div className="text-white/30 text-xs">Re-engage cost</div>
          </div>
        </div>
        <Alert icon="💰" color="emerald" title="Zero agency fee. Zero cold outreach." body="Saves MYR 18,000–28,000 typical agency fee + 6–8 week time-to-hire. Candidate is in-network and warm." />
      </div>
    ),
  },
  {
    num: '04', accent: 'emerald',
    title: 'Onboarding Success Predictor',
    tagline: '60-day survival panel. No surprises.',
    body: (
      <div className="space-y-3">
        <div className="rounded-xl border p-4" style={{ background: P.emerald.bg, borderColor: P.emerald.border }}>
          <div className="flex items-center justify-between mb-3">
            <div className="font-black text-sm" style={{ color: P.emerald.text }}>New Hire · Day 32</div>
            <div className="text-xs font-black px-3 py-1 rounded-full" style={{ background: P.emerald.bar, color: '#000' }}>STABLE ✅</div>
          </div>
          {[
            { label: 'Pull requests merged',       val: '14',  pct: 70, color: 'emerald' as PKey },
            { label: 'Tech stack alignment',        val: '94%', pct: 94, color: 'cyan'    as PKey },
            { label: 'Code review participation',   val: '11',  pct: 73, color: 'fuchsia' as PKey },
          ].map(m => (
            <div key={m.label} className="mb-2.5 last:mb-0">
              <div className="flex justify-between mb-1">
                <span className="text-white/40 text-xs">{m.label}</span>
                <span className="text-white text-xs font-black">{m.val}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,.07)' }}>
                <div className="h-full rounded-full" style={{ width: `${m.pct}%`, background: P[m.color].bar }} />
              </div>
            </div>
          ))}
        </div>
        <Alert icon="⚡" color="cyan" title="Full productivity: Day 42 predicted." body="Industry benchmark is Day 75. This hire is tracking 44% faster. Driver: pre-existing Next.js + Vercel production familiarity." />
      </div>
    ),
  },
  {
    num: '05', accent: 'fuchsia',
    title: 'Workforce Resilience Planner',
    tagline: 'MYR 7K Next.js roles: getting harder to fill. Fast.',
    body: (
      <div className="space-y-3">
        <div className="rounded-xl border p-4" style={{ background: P.fuchsia.bg, borderColor: P.fuchsia.border }}>
          <div className="font-black text-sm mb-3" style={{ color: P.fuchsia.text }}>KL Frontend Talent Supply · 12mo Forecast</div>
          <Row items={[
            { key: 'a', label: 'Available pool (<MYR 7K Next.js)', val: '340 → 190', note: '−44%' },
            { key: 'b', label: 'Avg time-to-hire (days)',           val: '32 → 58',  note: '+81%' },
            { key: 'c', label: 'Avg offer accepted salary',         val: 'MYR 6,200 → MYR 7,900', note: '+27%' },
          ]} />
        </div>
        <Alert icon="🔮" color="fuchsia" title="Junior pipeline ROI: 3.2× vs external hire." body="Start grow-your-own pipeline now. Cost: MYR 2,400/mo mentorship. Return: fill your own senior roles in 18mo at MYR 5K below market rate." />
      </div>
    ),
  },
];

// ── Senior Data Eng MYR 12K+ ───────────────────────────────────────────────────
const DE_MODS: Mod[] = [
  {
    num: '01', accent: 'blue',
    title: 'Smart Talent Matching',
    tagline: 'PySpark + Airflow. KL market: 7 real matches.',
    body: (
      <div className="space-y-3">
        <div className="rounded-xl border p-4" style={{ background: P.blue.bg, borderColor: P.blue.border }}>
          <div className="font-black text-sm mb-3" style={{ color: P.blue.text }}>Senior Data Eng matches · MYR 12K+</div>
          {[
            { name: 'Candidate X', skills: 'PySpark · Airflow · dbt · Snowflake', ask: 'MYR 11,500', pct: 97, signal: 'TOP MATCH', sc: 'emerald' as PKey },
            { name: 'Candidate Y', skills: 'PySpark · Airflow · Kafka',           ask: 'MYR 13,000', pct: 88, signal: 'STRONG',    sc: 'cyan'    as PKey },
            { name: 'Candidate Z', skills: 'dbt · BigQuery · Looker Studio',      ask: 'MYR 12,800', pct: 74, signal: 'SOLID',     sc: 'amber'   as PKey },
          ].map(c => (
            <div key={c.name} className="py-2.5 border-b border-white/6 last:border-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white text-xs font-black">{c.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black" style={{ color: P[c.sc].text }}>{c.signal}</span>
                  <span className="text-white text-xs font-black">{c.ask}</span>
                </div>
              </div>
              <div className="text-white/30 text-xs mb-1.5">{c.skills}</div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,.07)' }}>
                <div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: P.blue.bar }} />
              </div>
            </div>
          ))}
        </div>
        <div className="text-center text-xs text-white/25">Candidate X: 97th percentile skill growth in KL data engineering market Q1 2026</div>
      </div>
    ),
  },
  {
    num: '02', accent: 'rose',
    title: 'Talent Retention Signals',
    tagline: 'Your data team is on the market. Stealth.',
    body: (
      <div className="space-y-3">
        <Alert icon="🚨" color="rose" title="3 of 5 data engineers: LinkedIn Open to Work (stealth)." body="Competitor X hired 4 Data Eng profiles from your sector last quarter. Their comp band: MYR 13K–17K. Yours: MYR 12K–14K." />
        <div className="space-y-2">
          {[
            { eng: 'Data Eng 1', risk: 87, reason: 'PySpark stagnation · no new tooling in 8mo',  action: 'Upskilling budget + Spark roadmap',     rc: 'rose'    as PKey },
            { eng: 'Data Eng 2', risk: 79, reason: 'Below-market comp · last raise 18mo ago',     action: 'Immediate salary review required',      rc: 'rose'    as PKey },
            { eng: 'Data Eng 3', risk: 45, reason: 'Moderate · team culture fit signals mixed',   action: 'Skip-level 1:1 this week',              rc: 'amber'   as PKey },
          ].map(e => (
            <div key={e.eng} className="rounded-xl border p-3" style={{ background: 'rgba(255,255,255,.03)', borderColor: 'rgba(255,255,255,.08)' }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-white text-xs font-black">{e.eng}</span>
                <span className="text-xs font-black" style={{ color: P[e.rc].text }}>Risk: {e.risk}%</span>
              </div>
              <div className="text-white/35 text-xs mb-1">{e.reason}</div>
              <div className="text-white/55 text-xs font-bold">→ {e.action}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    num: '03', accent: 'amber',
    title: 'Talent Re-Engagement',
    tagline: 'Revive your silver medalists. They qualified.',
    body: (
      <div className="space-y-3">
        <div className="text-white/30 text-xs">3 previously-rejected candidates now qualify:</div>
        {[
          {
            id: 'Candidate P', ago: '6mo ago',
            reason: 'Rejected: insufficient dbt experience',
            update: 'Now: dbt-certified · 2 prod pipelines · 1,400 data models shipped',
            match: 96, ask: 'MYR 12,200',
          },
          {
            id: 'Candidate Q', ago: '9mo ago',
            reason: 'Rejected: weak system design',
            update: 'Now: Architected 10TB/day Kafka pipeline at current role',
            match: 91, ask: 'MYR 13,000',
          },
        ].map(c => (
          <div key={c.id} className="rounded-xl border p-4" style={{ background: P.amber.bg, borderColor: P.amber.border }}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-black text-white text-sm">{c.id}</span>
              <div className="flex items-center gap-2">
                <span className="text-white/30 text-xs">{c.ago}</span>
                <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ background: P.emerald.bar, color: '#000' }}>{c.match}% match</span>
              </div>
            </div>
            <div className="text-xs mb-1.5 line-through" style={{ color: P.rose.text, opacity: .6 }}>{c.reason}</div>
            <div className="text-xs mb-2" style={{ color: P.emerald.text }}>{c.update}</div>
            <div className="flex items-center justify-between">
              <span className="text-white/40 text-xs">Salary ask: {c.ask}</span>
              <span className="text-xs font-black" style={{ color: P.amber.text }}>Save: ~MYR 25K agency fee</span>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    num: '04', accent: 'emerald',
    title: 'Onboarding Success Predictor',
    tagline: 'Senior Data Eng: high ramp complexity. Manage it.',
    body: (
      <div className="space-y-3">
        <div className="rounded-xl border p-4" style={{ background: P.amber.bg, borderColor: P.amber.border }}>
          <div className="flex items-center justify-between mb-3">
            <div className="font-black text-sm" style={{ color: P.amber.text }}>New Hire · Day 18</div>
            <div className="text-xs font-black px-3 py-1 rounded-full" style={{ background: P.amber.bar, color: '#000' }}>MONITORING ⚠️</div>
          </div>
          {[
            { label: 'Data pipeline PRs merged',     val: '6',    pct: 45, color: 'amber'   as PKey },
            { label: 'Stack familiarity (dbt+Airflow)', val: '78%', pct: 78, color: 'cyan'    as PKey },
            { label: 'Stakeholder syncs attended',   val: '4/5',  pct: 80, color: 'fuchsia' as PKey },
          ].map(m => (
            <div key={m.label} className="mb-2.5 last:mb-0">
              <div className="flex justify-between mb-1">
                <span className="text-white/40 text-xs">{m.label}</span>
                <span className="text-white text-xs font-black">{m.val}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,.07)' }}>
                <div className="h-full rounded-full" style={{ width: `${m.pct}%`, background: P[m.color].bar }} />
              </div>
            </div>
          ))}
        </div>
        <Alert icon="🎯" color="amber" title="Predicted full ramp: Day 88." body="Mitigation active: paired with principal engineer. Reduces time-to-productivity by 35%. Without pairing, estimated Day 130." />
      </div>
    ),
  },
  {
    num: '05', accent: 'fuchsia',
    title: 'Workforce Resilience Planner',
    tagline: 'Malaysia senior data talent: 40% deficit by 2028.',
    body: (
      <div className="space-y-3">
        <div className="rounded-xl border p-4" style={{ background: P.fuchsia.bg, borderColor: P.fuchsia.border }}>
          <div className="font-black text-sm mb-3" style={{ color: P.fuchsia.text }}>Malaysia Data Engineering Forecast</div>
          {[
            { label: 'Senior Data Eng supply (KL)', now: '280',     delta: '−40% by 2028', dc: 'rose'    as PKey },
            { label: 'Median salary (MYR/mo)',       now: '12,000',  delta: '+54% → MYR 18,500', dc: 'amber' as PKey },
            { label: 'Avg time-to-hire (days)',       now: '48 days', delta: '+98% → 95 days', dc: 'rose'   as PKey },
          ].map(r => (
            <div key={r.label} className="flex items-center justify-between py-2 border-b border-white/6 last:border-0">
              <span className="text-white/40 text-xs flex-1">{r.label}</span>
              <span className="text-white text-xs font-black w-20 text-center">{r.now}</span>
              <span className="text-xs font-black w-28 text-right" style={{ color: P[r.dc].text }}>{r.delta}</span>
            </div>
          ))}
        </div>
        <div className="rounded-xl border p-4" style={{ background: P.rose.bg, borderColor: P.rose.border }}>
          <div className="font-black text-sm mb-1" style={{ color: P.rose.text }}>🚨 Scarcity Index: 9.1 / 10</div>
          <p className="text-xs leading-relaxed" style={{ color: P.rose.text, opacity: .65 }}>By 2028: hiring externally will cost MYR 18,500+/mo. Grow-your-own from junior level now = lock in MYR 10,000–12,000 long-term.</p>
        </div>
      </div>
    ),
  },
];

// ─── Lookup tables ─────────────────────────────────────────────────────────────
const TALENT_MODS: Record<TalentTag, Mod[]> = {
  cs_final: CS_MODS,
  node_dev: ND_MODS,
  ux_pivot: UX_MODS,
};
const EMP_MODS: Record<EmpTag, Mod[]> = {
  nextjs:  NJ_MODS,
  dataeng: DE_MODS,
};

const T_TAGS: { key: TalentTag; label: string; icon: string }[] = [
  { key: 'cs_final', label: 'Final Year CS',        icon: '🎓' },
  { key: 'node_dev', label: '2 YOE Node.js Dev',    icon: '⚡' },
  { key: 'ux_pivot', label: 'Non-Tech UI/UX Pivot', icon: '🎨' },
];
const E_TAGS: { key: EmpTag; label: string; icon: string }[] = [
  { key: 'nextjs',  label: 'Need Next.js Dev  (<MYR 7K)',     icon: '💼' },
  { key: 'dataeng', label: 'Need Senior Data Eng (MYR 12K+)', icon: '📊' },
];

// ══════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
export function CareerOSPortal({ onBuildOwn, defaultMode = 'talent', hideToggle = false, hideCta = false }: Props) {
  const [mode, setMode]       = useState<ViewMode>(defaultMode);
  const [tTag, setTTag]       = useState<TalentTag>('cs_final');
  const [eTag, setETag]       = useState<EmpTag>('nextjs');
  const [animKey, setAnimKey] = useState(0);

  const modules  = mode === 'talent' ? TALENT_MODS[tTag] : EMP_MODS[eTag];
  const chipTags = mode === 'talent' ? T_TAGS : E_TAGS;
  const activeKey = mode === 'talent' ? tTag : eTag;

  function switchMode(m: ViewMode) { setMode(m);    setAnimKey(k => k + 1); }
  function pickTag(k: string)      {
    if (mode === 'talent') { setTTag(k as TalentTag); }
    else                   { setETag(k as EmpTag); }
    setAnimKey(k2 => k2 + 1);
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/8" style={{ background: '#06060b' }}>
      <style>{PORTAL_CSS}</style>

      {/* Subtle dot-grid texture */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.04) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Faint top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,.4), transparent)' }}
      />

      <div className="relative z-10 px-5 py-8 sm:px-8">

        {/* ── Live badge ──────────────────────────────────────────── */}
        <div className="flex justify-center mb-7">
          <div className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-1.5" style={{ background: 'rgba(255,255,255,.04)' }}>
            <span className="neon-dot w-1.5 h-1.5 rounded-full" style={{ background: P.emerald.bar }} />
            <span className="text-white/40 text-xs font-black uppercase tracking-widest">
              Career OS · Universities Module 03 · Malaysia & Asia Pacific
            </span>
          </div>
        </div>

        {/* ── Portal mode toggle ───────────────────────────────────── */}
        {!hideToggle && (
          <div className="relative flex rounded-2xl border border-white/8 p-1.5 mb-6 max-w-md mx-auto" style={{ background: 'rgba(255,255,255,.04)' }}>
            {/* Sliding pill */}
            <div
              className="mode-slider absolute top-1.5 bottom-1.5 rounded-xl border border-white/12"
              style={{
                left:  mode === 'talent' ? '6px' : 'calc(50% + 3px)',
                width: 'calc(50% - 9px)',
                background: 'rgba(255,255,255,.09)',
              }}
            />
            {([
              { key: 'talent'   as ViewMode, icon: '🧑‍💻', label: 'Talent OS' },
              { key: 'employer' as ViewMode, icon: '🏢',   label: 'Recruiter Dashboard' },
            ]).map(b => (
              <button
                key={b.key}
                onClick={() => switchMode(b.key)}
                className="relative z-10 flex-1 flex items-center justify-center gap-2.5 py-3 text-sm font-black rounded-xl transition-colors duration-300"
                style={{ color: mode === b.key ? 'white' : 'rgba(255,255,255,.32)' }}
              >
                <span>{b.icon}</span>
                <span>{b.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* ── IT status / hiring-condition tags ───────────────────── */}
        <div className="flex flex-wrap gap-2.5 justify-center mb-8">
          {chipTags.map(t => {
            const active = t.key === activeKey;
            const accentC = active ? (mode === 'talent' ? P.fuchsia : P.blue) : null;
            return (
              <button
                key={t.key}
                onClick={() => pickTag(t.key)}
                className={`tag-pill flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-black cursor-pointer ${active ? 'tag-active' : ''}`}
                style={{
                  background:   accentC ? accentC.bg     : 'rgba(255,255,255,.04)',
                  borderColor:  accentC ? accentC.border  : 'rgba(255,255,255,.10)',
                  color:        accentC ? accentC.text    : 'rgba(255,255,255,.40)',
                  boxShadow:    accentC ? `0 0 22px ${accentC.bar}44` : 'none',
                }}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Context sub-headline ────────────────────────────────── */}
        <p className="text-center text-xs text-white/20 mb-6 -mt-4">
          {mode === 'talent'
            ? 'Select your current status · modules update in real-time with Malaysian IT market data'
            : 'Select your hiring need · talent intelligence dashboard switches context instantly'}
        </p>

        {/* ── Module grid ─────────────────────────────────────────── */}
        <div key={animKey} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((mod, i) => (
            <div
              key={mod.num}
              className={`fiu-${i} portal-card rounded-2xl border border-white/8 border-l-4 p-5 ${i === 4 ? 'md:col-span-2' : ''}`}
              style={{
                background: 'rgba(255,255,255,.025)',
                borderLeftColor: P[mod.accent].bar,
              }}
            >
              {/* Card header */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black rounded-full px-2 py-0.5 border"
                    style={{ background: `${P[mod.accent].bg}`, borderColor: P[mod.accent].border, color: P[mod.accent].text }}>
                    {mod.num}
                  </span>
                </div>
                <div className="text-white font-black text-base leading-tight">{mod.title}</div>
                <div className="text-white/35 text-xs mt-0.5">{mod.tagline}</div>
              </div>
              {/* Card body */}
              {mod.body}
            </div>
          ))}
        </div>

        {/* ── CTA ─────────────────────────────────────────────────── */}
        {!hideCta && (
          <div className="text-center mt-10 pt-8 border-t border-white/6">
            <button
              onClick={onBuildOwn}
              className="cta-glow inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-sm text-black"
              style={{ background: 'linear-gradient(135deg, #d946ef, #8b5cf6, #22d3ee)' }}
            >
              {mode === 'talent'
                ? '🎓 Build My Full Career OS Profile →'
                : '🏢 Access Full Employer Dashboard →'}
            </button>
            <p className="text-xs text-white/15 mt-4">No account · Free · MYR market data · PDPA compliant</p>
          </div>
        )}
      </div>
    </div>
  );
}
