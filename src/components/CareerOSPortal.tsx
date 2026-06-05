import { useState, useEffect, useRef } from 'react';
import { StudentProfile } from '../types/evidence';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type ViewMode  = 'talent' | 'employer';
type TalentTag = 'cs_final' | 'node_dev' | 'ux_pivot';
type EmpTag    = 'nextjs'   | 'dataeng';

// ─────────────────────────────────────────────────────────────────────────────
// TALENT DATA MATRIX — Malaysian IT · No filler data
// ─────────────────────────────────────────────────────────────────────────────
const TALENT_MATRIX: Record<TalentTag, {
  label: string; icon: string;
  modules: {
    id: string; num: string; title: string; tagline: string;
    body: React.ReactNode;
  }[];
}> = {

  cs_final: {
    label: 'Final Year CS', icon: '🎓',
    modules: [
      {
        id: 'nav', num: '01', title: 'Career Path Navigator',
        tagline: 'Stop guessing your next move.',
        body: (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: '🏢 Large Company', start: 'MYR 5,500', ceiling: 'MYR 18,000', risk: 'Stack locked in private cloud. Tech asset depreciation: 40% in 3yr.', color: 'blue', bar: '65%' },
                { label: '🚀 Startup Track', start: 'MYR 4,200', ceiling: 'MYR 35,000+', risk: "KL startup survival rate: 22%. High freedom, brutal downside.", color: 'fuchsia', bar: '85%' },
              ].map(p => (
                <div key={p.label} className={`rounded-xl border p-4 bg-${p.color}-500/5 border-${p.color}-500/20`}>
                  <div className="font-black text-white text-sm mb-2">{p.label}</div>
                  <div className="text-xs text-white/40 mb-1">Start → Ceiling</div>
                  <div className={`font-black text-${p.color}-400 text-lg leading-tight`}>{p.start}<span className="text-white/30 text-xs"> → </span>{p.ceiling}</div>
                  <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r from-${p.color}-500 to-${p.color}-300 rounded-full`} style={{ width: p.bar }} />
                  </div>
                  <p className="text-white/30 text-xs mt-2 leading-relaxed">{p.risk}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3">
              <span className="text-amber-400 text-sm">⚠️</span>
              <span className="text-amber-300 text-xs font-bold">0 production deployments detected. Both paths require live evidence before interview shortlisting.</span>
            </div>
          </div>
        ),
      },
      {
        id: 'port', num: '02', title: 'Living Portfolio',
        tagline: 'Resume is dead. Live proof only.',
        body: (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: '0', label: 'Static CV edits', color: 'text-rose-400', sub: 'auto-synced' },
                { val: '12', label: 'GitHub commits', color: 'text-cyan-400', sub: 'last 30 days' },
                { val: '0', label: 'Deployed apps', color: 'text-rose-400', sub: '⚠ critical gap' },
              ].map(s => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <div className={`text-3xl font-black ${s.color}`}>{s.val}</div>
                  <div className="text-white/40 text-xs mt-1">{s.label}</div>
                  <div className={`text-xs mt-0.5 ${s.color} opacity-70`}>{s.sub}</div>
                </div>
              ))}
            </div>
            <div className="bg-black/30 border border-white/8 rounded-xl p-4">
              <div className="text-xs text-white/30 font-black uppercase tracking-widest mb-2">Auto-detected from GitHub</div>
              {['Node.js · 3 repos · last push 4 days ago', 'React · 1 repo · 0 deployment URL ⚠', 'Python · 2 repos · academic only'].map(r => (
                <div key={r} className="flex items-center gap-2 py-1.5 border-b border-white/5 last:border-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 flex-shrink-0" />
                  <span className="text-white/50 text-xs">{r}</span>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: 'coach', num: '03', title: 'AI Career Coach',
        tagline: 'Not motivational. Diagnostic.',
        body: (
          <div className="space-y-3">
            <div className="relative overflow-hidden rounded-xl border border-rose-500/30 bg-rose-500/8 px-5 py-4">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-transparent pointer-events-none" />
              <div className="flex items-start gap-3">
                <span className="text-rose-400 text-lg flex-shrink-0">🚨</span>
                <div>
                  <div className="text-rose-300 font-black text-sm mb-1">Stack Liquidity Alert</div>
                  <p className="text-rose-200/70 text-xs leading-relaxed">
                    You've spent 24 months on the same academic stack. Market data signals skill liquidity freeze incoming. The window for cost-free reskilling closes in <strong className="text-rose-300">6 months</strong>.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-4">
              <div className="text-emerald-400 font-black text-xs uppercase mb-2">→ Recommended action</div>
              <p className="text-white/70 text-xs leading-relaxed">Ship 1 Node.js API with CI/CD to production. GitHub Actions pipeline setup: 3 hours. Recruiter shortlist conversion: +280%.</p>
            </div>
          </div>
        ),
      },
      {
        id: 'pay', num: '04', title: 'Fair Pay Engine',
        tagline: "The number they quoted you isn't real.",
        body: (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 items-end">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-white/30 text-xs mb-2">Graduate offer</div>
                <div className="text-3xl font-black text-white">MYR<br/>4,200</div>
                <div className="text-white/20 text-xs mt-1">/mo</div>
              </div>
              <div className="text-center">
                <div className="text-white/20 text-3xl font-black">vs</div>
              </div>
              <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-4 text-center">
                <div className="text-emerald-400 text-xs mb-2">KL Grad median</div>
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-emerald-400 to-cyan-400">MYR<br/>5,800</div>
                <div className="text-emerald-400/50 text-xs mt-1">/mo</div>
              </div>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="text-amber-300 font-black text-sm">🚨 MYR 1,600 Underpaid Undercurrent</span>
              <button className="text-xs bg-amber-500 text-black font-black px-3 py-1.5 rounded-lg hover:bg-amber-400 transition-colors">Fix It</button>
            </div>
          </div>
        ),
      },
      {
        id: 'life', num: '05', title: 'Life Chapter Designer',
        tagline: 'Plan the break before the break plans you.',
        body: (
          <div className="space-y-3">
            <div className="relative">
              <div className="flex items-center gap-0 overflow-x-auto pb-2">
                {[
                  { label: 'Now', role: 'Student', color: 'bg-white/20', w: '80px' },
                  { label: '+3mo', role: '🎯 AI Bootcamp', color: 'bg-fuchsia-500/40 border border-fuchsia-500/50', w: '100px' },
                  { label: '+6mo', role: 'Junior Dev', color: 'bg-emerald-500/30', w: '80px' },
                  { label: '+2yr', role: 'Mid Dev', color: 'bg-cyan-500/30', w: '80px' },
                ].map((n, i) => (
                  <div key={n.label} className="flex items-center flex-shrink-0">
                    <div className={`rounded-xl px-4 py-3 text-center ${n.color}`} style={{ minWidth: n.w }}>
                      <div className="text-white/40 text-xs">{n.label}</div>
                      <div className="text-white font-black text-xs mt-1">{n.role}</div>
                    </div>
                    {i < 3 && <div className="w-4 h-px bg-white/20 flex-shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-rose-500/8 border border-rose-500/20 rounded-xl p-3 text-center">
                <div className="text-rose-400 font-black text-sm">−MYR 12,600</div>
                <div className="text-white/30 text-xs mt-1">3-month income gap</div>
              </div>
              <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-3 text-center">
                <div className="text-emerald-400 font-black text-sm">+MYR 4,200/mo</div>
                <div className="text-white/30 text-xs mt-1">post-bootcamp uplift</div>
              </div>
            </div>
            <div className="text-center">
              <span className="text-xs text-cyan-400 font-bold">Break-even in 3 months. Net positive from month 4.</span>
            </div>
          </div>
        ),
      },
    ],
  },

  node_dev: {
    label: '2 YOE Node.js Dev', icon: '⚡',
    modules: [
      {
        id: 'nav', num: '01', title: 'Career Path Navigator',
        tagline: 'You have 18 months before your stack commoditises.',
        body: (
          <div className="space-y-3">
            {[
              { path: 'Stay in Node.js', salary: 'MYR 7,500 → MYR 11,000', timeline: '2–3yr', risk: 'Node.js mid-market saturation: +340% in KL since 2023. Race to the bottom incoming.', color: 'amber', w: '55%' },
              { path: '🔥 AI Engineer Pivot', salary: 'MYR 7,500 → MYR 13,000', timeline: '12–18mo', risk: 'Vector DB + LLM orchestration. Demand: +380%. Supply in Malaysia: critically low.', color: 'fuchsia', w: '85%' },
            ].map(p => (
              <div key={p.path} className={`rounded-xl border p-4 bg-${p.color}-500/5 border-${p.color}-500/20`}>
                <div className="flex justify-between items-start mb-2">
                  <div className={`font-black text-${p.color}-400 text-sm`}>{p.path}</div>
                  <div className={`text-xs text-${p.color}-400/60`}>{p.timeline}</div>
                </div>
                <div className="font-black text-white text-base mb-2">{p.salary}<span className="text-white/30 text-xs font-normal"> /mo</span></div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                  <div className={`h-full bg-${p.color}-400 rounded-full`} style={{ width: p.w }} />
                </div>
                <p className="text-white/30 text-xs">{p.risk}</p>
              </div>
            ))}
          </div>
        ),
      },
      {
        id: 'port', num: '02', title: 'Living Portfolio',
        tagline: '47 commits. 0 AI projects. Employer signal: weak.',
        body: (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: '47', label: 'Total commits', color: 'text-cyan-400', sub: 'active' },
                { val: '3', label: 'Production apps', color: 'text-emerald-400', sub: 'deployed' },
                { val: '0', label: 'AI/ML projects', color: 'text-rose-400', sub: '⚠ missing' },
              ].map(s => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <div className={`text-3xl font-black ${s.color}`}>{s.val}</div>
                  <div className="text-white/40 text-xs mt-1">{s.label}</div>
                  <div className={`text-xs mt-0.5 ${s.color} opacity-70`}>{s.sub}</div>
                </div>
              ))}
            </div>
            <div className="bg-fuchsia-500/8 border border-fuchsia-500/20 rounded-xl p-4">
              <div className="text-fuchsia-400 font-black text-xs uppercase mb-2">Gap detected</div>
              <p className="text-white/60 text-xs">AI Engineer roles at Grab, GoTo, and Axiata require ≥1 RAG or Vector Search project. You have 0. Bridge time: 6–8 weeks.</p>
            </div>
          </div>
        ),
      },
      {
        id: 'coach', num: '03', title: 'AI Career Coach',
        tagline: 'Not a cheerleader. A diagnostic engine.',
        body: (
          <div className="space-y-3">
            <div className="bg-rose-500/8 border border-rose-500/30 rounded-xl p-4">
              <div className="text-rose-300 font-black text-sm mb-1">🚨 Skill Liquidity Freeze in 14 months</div>
              <p className="text-rose-200/60 text-xs leading-relaxed">You've spent 24 months exclusively in Node.js/Express. LLM orchestration demand grew +380% while your stack stagnated. Market liquidity of your current skill set: projected −42% by Q3 2026.</p>
            </div>
            <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-4">
              <div className="text-emerald-400 font-black text-xs uppercase mb-2">→ Pivot now. Not when the freeze hits.</div>
              <p className="text-white/60 text-xs">LangChain + Pinecone (6 weeks) → 1 RAG project → Senior AI Engineer at MYR 13,000/mo. Trade-off: 6-month income plateau while bridging.</p>
            </div>
          </div>
        ),
      },
      {
        id: 'pay', num: '04', title: 'Fair Pay Engine',
        tagline: "MYR 3,000 left on the table. Every month.",
        body: (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl border border-rose-500/20">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-transparent pointer-events-none" />
              <div className="grid grid-cols-2 divide-x divide-white/5">
                <div className="p-5 text-center">
                  <div className="text-white/30 text-xs mb-2">Your current base</div>
                  <div className="text-4xl font-black text-white">MYR<br/>6,500</div>
                  <div className="text-white/20 text-xs mt-1">/mo</div>
                </div>
                <div className="p-5 text-center">
                  <div className="text-cyan-400 text-xs mb-2">KL market median · 2 YOE</div>
                  <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-fuchsia-400">MYR<br/>9,500</div>
                  <div className="text-cyan-400/50 text-xs mt-1">/mo</div>
                </div>
              </div>
            </div>
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 flex items-center justify-between">
              <div>
                <div className="text-rose-300 font-black">🚨 MYR 3,000 Underpaid Undercurrent</div>
                <div className="text-rose-400/60 text-xs">MYR 36,000/yr walking out of your pocket</div>
              </div>
              <button className="text-xs bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-black font-black px-3 py-2 rounded-lg hover:-translate-y-0.5 transition-all">
                Negotiate →
              </button>
            </div>
          </div>
        ),
      },
      {
        id: 'life', num: '05', title: 'Life Chapter Designer',
        tagline: 'The AI bootcamp break math.',
        body: (
          <div className="space-y-3">
            <div className="overflow-x-auto">
              <div className="flex items-center gap-1 min-w-max">
                {[
                  { t: 'Now', label: 'Node.js Dev', sal: 'MYR 6,500', c: 'border-white/20' },
                  { t: '+2mo', label: '🎯 AI Bootcamp', sal: '−MYR 13,000', c: 'border-rose-500/40 bg-rose-500/8' },
                  { t: '+4mo', label: 'AI Engineer Jr.', sal: 'MYR 9,500', c: 'border-fuchsia-500/40 bg-fuchsia-500/8' },
                  { t: '+12mo', label: 'Senior AI Eng.', sal: 'MYR 13,000', c: 'border-cyan-500/40 bg-cyan-500/8' },
                ].map((n, i) => (
                  <div key={n.t} className="flex items-center gap-1">
                    <div className={`rounded-xl px-3 py-2.5 border text-center min-w-[90px] ${n.c}`}>
                      <div className="text-white/30 text-xs">{n.t}</div>
                      <div className="text-white font-black text-xs mt-0.5">{n.label}</div>
                      <div className="text-white/50 text-xs">{n.sal}</div>
                    </div>
                    {i < 3 && <div className="w-3 h-px bg-white/15 flex-shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-rose-500/8 border border-rose-500/20 rounded-lg p-2">
                <div className="text-rose-400 font-black">−MYR 13,000</div>
                <div className="text-white/25">2-month gap</div>
              </div>
              <div className="bg-amber-500/8 border border-amber-500/20 rounded-lg p-2">
                <div className="text-amber-400 font-black">Break even</div>
                <div className="text-white/25">month 4</div>
              </div>
              <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-lg p-2">
                <div className="text-emerald-400 font-black">+MYR 78k</div>
                <div className="text-white/25">yr 1 net gain</div>
              </div>
            </div>
          </div>
        ),
      },
    ],
  },

  ux_pivot: {
    label: 'Non-Tech → UI/UX', icon: '🎨',
    modules: [
      {
        id: 'nav', num: '01', title: 'Career Path Navigator',
        tagline: 'UX without code is a half-ticket in Malaysia.',
        body: (
          <div className="space-y-3">
            {[
              { path: 'Pure Visual Design', salary: 'MYR 3,500 → MYR 6,000', limit: 'Agency ceiling. No product company will hire non-coding UX above senior level.', color: 'amber', locked: true },
              { path: '🎯 Product Designer (Hybrid)', salary: 'MYR 3,800 → MYR 10,000', limit: 'HTML/CSS handoff + Figma. Opens 65% more KL roles. Direct product company path.', color: 'cyan', locked: false },
            ].map(p => (
              <div key={p.path} className={`rounded-xl border p-4 bg-${p.color}-500/5 border-${p.color}-500/20`}>
                <div className="flex justify-between items-center mb-2">
                  <div className={`font-black text-${p.color}-400 text-sm`}>{p.path}</div>
                  {p.locked && <span className="text-xs text-rose-400 bg-rose-500/15 border border-rose-500/25 px-2 py-0.5 rounded-full font-black">⛔ ceiling</span>}
                </div>
                <div className="font-black text-white text-base mb-2">{p.salary}<span className="text-white/30 text-xs font-normal"> /mo</span></div>
                <p className="text-white/30 text-xs">{p.limit}</p>
              </div>
            ))}
          </div>
        ),
      },
      {
        id: 'port', num: '02', title: 'Living Portfolio',
        tagline: '3 Figma files. 0 case studies. Rejected in 4 seconds.',
        body: (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: '3', label: 'Figma files', color: 'text-cyan-400', sub: 'no case studies' },
                { val: '0', label: 'User tests', color: 'text-rose-400', sub: '⚠ critical' },
                { val: '0', label: 'HTML/CSS proof', color: 'text-rose-400', sub: '⚠ critical' },
              ].map(s => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <div className={`text-3xl font-black ${s.color}`}>{s.val}</div>
                  <div className="text-white/40 text-xs mt-1">{s.label}</div>
                  <div className={`text-xs mt-0.5 ${s.color} opacity-70`}>{s.sub}</div>
                </div>
              ))}
            </div>
            <div className="bg-cyan-500/8 border border-cyan-500/20 rounded-xl p-4">
              <div className="text-cyan-400 font-black text-xs uppercase mb-2">→ Fix plan: 2 weeks</div>
              <p className="text-white/60 text-xs">Publish 3 case studies (Figma + user testing evidence). Add Behance + GitHub Pages. This single change increases recruiter contact rate by 4×.</p>
            </div>
          </div>
        ),
      },
      {
        id: 'coach', num: '03', title: 'AI Career Coach',
        tagline: 'UX hiring managers scan in 8 seconds. Yours fails at second 3.',
        body: (
          <div className="space-y-3">
            <div className="bg-amber-500/8 border border-amber-500/30 rounded-xl p-4">
              <div className="text-amber-300 font-black text-sm mb-1">⚠️ Portfolio Scan Failed at Second 3</div>
              <p className="text-amber-200/60 text-xs leading-relaxed">No deployed case study URL. No measurable user impact data. No evidence of real user recruitment for testing. Hiring managers close the tab.</p>
            </div>
            <div className="space-y-2">
              {[
                { check: false, text: 'Case study with measurable outcome ("reduced drop-off by 34%")' },
                { check: false, text: 'HTML/CSS prototype or handoff documentation' },
                { check: true,  text: 'Figma proficiency demonstrated' },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-3">
                  <span className={item.check ? 'text-emerald-400' : 'text-rose-400'}>{item.check ? '✓' : '✗'}</span>
                  <span className={`text-xs ${item.check ? 'text-white/60' : 'text-white/30'}`}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: 'pay', num: '04', title: 'Fair Pay Engine',
        tagline: 'KL UX market: bimodal. Know which side you fall on.',
        body: (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-rose-500/8 border border-rose-500/20 rounded-xl p-4 text-center">
                <div className="text-white/30 text-xs mb-2">Agency / Pure Visual</div>
                <div className="text-3xl font-black text-rose-400">MYR<br/>3,800</div>
                <div className="text-rose-400/40 text-xs mt-1">/mo ceiling: 6k</div>
              </div>
              <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-4 text-center">
                <div className="text-emerald-400 text-xs mb-2">Product Co. + HTML/CSS</div>
                <div className="text-3xl font-black text-emerald-400">MYR<br/>6,500</div>
                <div className="text-emerald-400/40 text-xs mt-1">/mo ceiling: 12k</div>
              </div>
            </div>
            <div className="bg-cyan-500/8 border border-cyan-500/20 rounded-xl px-4 py-3">
              <span className="text-cyan-300 font-black text-sm">MYR 2,700/mo delta unlocked by HTML/CSS handoff skill alone.</span>
            </div>
          </div>
        ),
      },
      {
        id: 'life', num: '05', title: 'Life Chapter Designer',
        tagline: 'The pivot timeline — no sugarcoating.',
        body: (
          <div className="space-y-3">
            <div className="overflow-x-auto">
              <div className="flex items-center gap-1 min-w-max">
                {[
                  { t: 'Now', label: 'Non-tech', sal: 'MYR 3,200', c: 'border-white/20' },
                  { t: '+3mo', label: '🎨 UX Bootcamp', sal: '−MYR 9,600', c: 'border-rose-500/40 bg-rose-500/8' },
                  { t: '+6mo', label: 'Junior UX', sal: 'MYR 3,800', c: 'border-cyan-500/30 bg-cyan-500/5' },
                  { t: '+15mo', label: 'Mid UX + Code', sal: 'MYR 6,500', c: 'border-emerald-500/40 bg-emerald-500/8' },
                ].map((n, i) => (
                  <div key={n.t} className="flex items-center gap-1">
                    <div className={`rounded-xl px-3 py-2.5 border text-center min-w-[90px] ${n.c}`}>
                      <div className="text-white/30 text-xs">{n.t}</div>
                      <div className="text-white font-black text-xs mt-0.5">{n.label}</div>
                      <div className="text-white/50 text-xs">{n.sal}</div>
                    </div>
                    {i < 3 && <div className="w-3 h-px bg-white/15 flex-shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <span className="text-xs text-white/30">Hard truth: 15-month investment before net positive. Worth it for the 10-year trajectory. Avoid if you need income stability now.</span>
            </div>
          </div>
        ),
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// EMPLOYER DATA MATRIX
// ─────────────────────────────────────────────────────────────────────────────
const EMPLOYER_MATRIX: Record<EmpTag, {
  label: string; icon: string;
  modules: { id: string; num: string; title: string; tagline: string; body: React.ReactNode }[];
}> = {
  nextjs: {
    label: 'Next.js Dev (<MYR 7K)', icon: '⚛️',
    modules: [
      {
        id: 'match', num: '01', title: 'Smart Talent Matching',
        tagline: 'HR screens history. Career OS matches future trajectory.',
        body: (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'T-001', init: 'A', title: 'Frontend Eng · 3 YOE', loc: 'Petaling Jaya', skills: [['React/Next.js', 95], ['TypeScript', 88], ['REST APIs', 82]], sal: 'MYR 6,200', notice: 'Immediate', score: 84, grad: 'from-cyan-400 to-blue-500' },
                { id: 'T-002', init: 'R', title: 'Full-Stack · 2.5 YOE', loc: 'Kuala Lumpur', skills: [['React/Next.js', 91], ['Node.js', 85], ['PostgreSQL', 79]], sal: 'MYR 6,800', notice: '2 weeks', score: 77, grad: 'from-fuchsia-400 to-purple-500' },
              ].map(c => (
                <div key={c.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-blue-400/30 transition-all duration-300 hover:-translate-y-0.5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${c.grad} flex items-center justify-center text-black font-black text-sm flex-shrink-0`}>{c.init}</div>
                    <div>
                      <div className="text-white font-black text-xs">{c.title}</div>
                      <div className="text-white/30 text-xs">{c.loc}</div>
                    </div>
                  </div>
                  {(c.skills as [string, number][]).map(([sk, m]) => (
                    <div key={sk} className="mb-1.5">
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-white/40">{sk}</span>
                        <span className={`font-black ${m >= 90 ? 'text-emerald-400' : m >= 80 ? 'text-cyan-400' : 'text-amber-400'}`}>{m}%</span>
                      </div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${m >= 90 ? 'bg-emerald-400' : m >= 80 ? 'bg-cyan-400' : 'bg-amber-400'}`} style={{ width: `${m}%` }} />
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                    <div>
                      <div className="text-emerald-400 font-black text-sm">{c.sal}/mo</div>
                      <div className="text-white/20 text-xs">Notice: {c.notice}</div>
                    </div>
                    <button className="text-xs bg-blue-500/20 border border-blue-400/30 text-blue-400 font-black px-3 py-1.5 rounded-lg hover:bg-blue-500/30 transition-colors">⚡ Connect</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center text-xs text-white/20 border border-white/5 rounded-lg px-3 py-2">🔒 Passive candidates. Anonymised until mutual match. PDPA compliant.</div>
          </div>
        ),
      },
      {
        id: 'retain', num: '02', title: 'Talent Retention Signals',
        tagline: 'Why find out someone is leaving only when the letter lands?',
        body: (
          <div className="space-y-3">
            <div className="bg-rose-500/8 border border-rose-500/30 rounded-xl p-4">
              <div className="text-rose-300 font-black text-sm mb-1">⚠️ High Risk: KL Tech Hub · Competitor Headhunting</div>
              <p className="text-rose-200/60 text-xs leading-relaxed">Anonymous signal: 3 of your Next.js engineers received DMs from Shopee's talent team this week. Profile update velocity +240% above baseline. Departure probability: 68%.</p>
            </div>
            {[['Frontend Lead · 4 YOE', '🔴 82% departure risk', 'text-rose-400'], ['Mid Frontend · 2 YOE', '🟡 41% departure risk', 'text-amber-400'], ['Junior Dev · 1 YOE', '🟢 12% departure risk', 'text-emerald-400']].map(([name, risk, c]) => (
              <div key={name} className="flex justify-between items-center bg-white/3 border border-white/8 rounded-xl px-4 py-3">
                <span className="text-white/60 text-xs font-bold">{name}</span>
                <span className={`text-xs font-black ${c}`}>{risk}</span>
              </div>
            ))}
          </div>
        ),
      },
      {
        id: 'reengage', num: '03', title: 'Talent Re-Engagement',
        tagline: 'Revive your silver-medalists.',
        body: (
          <div className="space-y-3">
            <div className="bg-cyan-500/8 border border-cyan-500/20 rounded-xl p-4">
              <div className="text-cyan-400 font-black text-xs uppercase mb-2">Auto-Surfaced · 6 months post-rejection</div>
              <p className="text-white/60 text-xs mb-3">Candidate failed your system design round in Feb. Since then: 3 Next.js production deployments, CI/CD pipeline at current employer, 94% test coverage.</p>
              <div className="flex gap-2">
                <div className="bg-emerald-500/15 border border-emerald-500/25 rounded-lg px-3 py-1.5">
                  <div className="text-emerald-400 font-black text-xs">System Design</div>
                  <div className="text-white/30 text-xs">Now: 74/100 (was 38)</div>
                </div>
                <button className="text-xs bg-gradient-to-r from-fuchsia-500/20 to-cyan-500/20 border border-fuchsia-400/30 text-fuchsia-400 font-black px-3 py-1.5 rounded-lg hover:-translate-y-0.5 transition-all">Re-engage →</button>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'onboard', num: '04', title: 'Onboarding Success Predictor',
        tagline: '30 days in. Is this hire going to work?',
        body: (
          <div className="space-y-3">
            <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-emerald-400 text-lg">✅</span>
                <div className="text-emerald-400 font-black text-sm">STABLE — Day 30</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[['14', 'PRs merged', 'text-cyan-400'], ['94%', 'Stack alignment', 'text-emerald-400'], ['3', 'Mentor sessions', 'text-white/60']].map(([v, l, c]) => (
                  <div key={l} className="bg-black/25 rounded-lg p-2">
                    <div className={`text-xl font-black ${c}`}>{v}</div>
                    <div className="text-white/25 text-xs">{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3">
              <div className="text-amber-300 font-black text-xs">⚠ Watch: Velocity dropped 40% in week 3. Cross-team onboarding friction detected.</div>
            </div>
          </div>
        ),
      },
      {
        id: 'resilience', num: '05', title: 'Workforce Resilience Planner',
        tagline: '2028 is closer than your next sprint cycle.',
        body: (
          <div className="space-y-3">
            <div className="bg-rose-500/8 border border-rose-500/30 rounded-xl p-4">
              <div className="text-rose-300 font-black text-sm mb-1">🔴 40% Senior Frontend Deficit by 2028 · Malaysia</div>
              <p className="text-rose-200/60 text-xs leading-relaxed">Malaysian CS graduate supply growing at 3%/yr. Frontend senior demand: 18%/yr. The gap is structural, not cyclical. Manual hiring cannot bridge it.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[['Reactive hiring (current)', 'MYR 12,000/hire · 45 days', 'text-rose-400'], ['Career OS passive pipeline', 'MYR 3,500/hire · 11 days', 'text-emerald-400']].map(([label, val, c]) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="text-white/30 text-xs mb-1">{label}</div>
                  <div className={`font-black text-sm ${c}`}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        ),
      },
    ],
  },

  dataeng: {
    label: 'Senior Data Eng (MYR 12K+)', icon: '📊',
    modules: [
      {
        id: 'match', num: '01', title: 'Smart Talent Matching',
        tagline: 'Spark + Kafka expertise in Malaysia: 847 people. You need 1.',
        body: (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'T-003', init: 'K', title: 'Sr. Data Eng · 6 YOE', loc: 'KL Sentral', skills: [['Apache Spark', 93], ['Kafka/Streaming', 88], ['dbt/Warehouse', 85]], sal: 'MYR 12,500', notice: '1 month', score: 91, grad: 'from-emerald-400 to-cyan-500' },
                { id: 'T-004', init: 'S', title: 'Data Platform Lead · 5 YOE', loc: 'Bangsar South', skills: [['Python/PySpark', 89], ['Snowflake/BQ', 84], ['Airflow', 80]], sal: 'MYR 13,000', notice: 'Negotiable', score: 88, grad: 'from-amber-400 to-orange-500' },
              ].map(c => (
                <div key={c.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-emerald-400/30 transition-all duration-300 hover:-translate-y-0.5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${c.grad} flex items-center justify-center text-black font-black text-sm flex-shrink-0`}>{c.init}</div>
                    <div>
                      <div className="text-white font-black text-xs">{c.title}</div>
                      <div className="text-white/30 text-xs">{c.loc}</div>
                    </div>
                  </div>
                  {(c.skills as [string, number][]).map(([sk, m]) => (
                    <div key={sk} className="mb-1.5">
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-white/40">{sk}</span>
                        <span className={`font-black ${m >= 90 ? 'text-emerald-400' : 'text-cyan-400'}`}>{m}%</span>
                      </div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${m >= 90 ? 'bg-emerald-400' : 'bg-cyan-400'}`} style={{ width: `${m}%` }} />
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                    <div>
                      <div className="text-emerald-400 font-black text-sm">{c.sal}/mo</div>
                      <div className="text-white/20 text-xs">Notice: {c.notice}</div>
                    </div>
                    <button className="text-xs bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 font-black px-3 py-1.5 rounded-lg hover:bg-emerald-500/30 transition-colors">⚡ Connect</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: 'retain', num: '02', title: 'Talent Retention Signals',
        tagline: "Data engineers don't quit. They get poached at 2am.",
        body: (
          <div className="space-y-3">
            <div className="bg-rose-500/8 border border-rose-500/30 rounded-xl p-4">
              <div className="text-rose-300 font-black text-sm mb-1">⚠️ Senior Data Eng · Headhunt Spike Detected</div>
              <p className="text-rose-200/60 text-xs">ByteDance KL and Grab Data team sent 4 InMails to your senior data engineer in 48hrs. Profile views from talent.bytedance.com: +600% above baseline.</p>
            </div>
            <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3">
              <div className="text-amber-300 font-black text-xs">Recommended: Pre-emptive counter-offer within 72hrs. Market rate gap: MYR 2,500/mo. Cost of replacement: MYR 45,000+.</div>
            </div>
          </div>
        ),
      },
      {
        id: 'reengage', num: '03', title: 'Talent Re-Engagement',
        tagline: 'Your best data engineer rejection now has 3 production Spark jobs.',
        body: (
          <div className="space-y-3">
            <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-4">
              <div className="text-emerald-400 font-black text-xs uppercase mb-2">Auto-Surfaced · Silver Medalist · 8 months ago</div>
              <p className="text-white/60 text-xs mb-3">Failed streaming architecture round. Current employer: deployed 3 Kafka consumer groups, 100M+ events/day throughput. Score improvement: 38 → 81 in System Design.</p>
              <button className="text-xs bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/30 text-emerald-400 font-black px-4 py-2 rounded-lg hover:-translate-y-0.5 transition-all">Re-engage at MYR 12,500 →</button>
            </div>
          </div>
        ),
      },
      {
        id: 'onboard', num: '04', title: 'Onboarding Success Predictor',
        tagline: 'Day 60 report. Automated. No manager bias.',
        body: (
          <div className="space-y-3">
            <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-emerald-400 text-lg">✅</span>
                <div className="text-emerald-400 font-black text-sm">THRIVING — Day 60</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[['8', 'Pipelines owned', 'text-cyan-400'], ['100%', 'Data SLA met', 'text-emerald-400'], ['97%', 'Stack alignment', 'text-fuchsia-400']].map(([v, l, c]) => (
                  <div key={l} className="bg-black/25 rounded-lg p-2">
                    <div className={`text-xl font-black ${c}`}>{v}</div>
                    <div className="text-white/25 text-xs">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'resilience', num: '05', title: 'Workforce Resilience Planner',
        tagline: "Malaysia's data talent cliff edge: 2026.",
        body: (
          <div className="space-y-3">
            <div className="bg-rose-500/8 border border-rose-500/30 rounded-xl p-4">
              <div className="text-rose-300 font-black text-sm mb-1">🔴 Critical: Data Engineering Supply Crunch</div>
              <p className="text-rose-200/60 text-xs">Malaysia produces 200 Spark-certified engineers/yr. Demand: 2,400/yr. Deficit: 2,200. By 2028: your sector faces a 40% senior talent hole. AI won't fill this gap — it creates it.</p>
            </div>
            <div className="bg-cyan-500/8 border border-cyan-500/20 rounded-xl px-4 py-3">
              <div className="text-cyan-300 font-black text-xs">→ Automate passive talent spotting now. Every month of delay = MYR 18,000 in foregone retention savings.</div>
            </div>
          </div>
        ),
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// MODULE CARD — animated on key change
// ─────────────────────────────────────────────────────────────────────────────
function ModuleCard({ mod, idx }: {
  mod: { id: string; num: string; title: string; tagline: string; body: React.ReactNode };
  idx: number;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), idx * 80);
    return () => clearTimeout(t);
  }, [idx]);

  return (
    <div
      className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:shadow-xl hover:shadow-fuchsia-500/5"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.45s ease-out ${idx * 80}ms, transform 0.45s ease-out ${idx * 80}ms, box-shadow 0.3s ease, border-color 0.3s ease, translate 0.3s ease`,
      }}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 border border-fuchsia-500/20 flex items-center justify-center">
          <span className="text-fuchsia-400 font-black text-xs">{mod.num}</span>
        </div>
        <div>
          <div className="text-white font-black text-sm">{mod.title}</div>
          <div className="text-white/30 text-xs italic mt-0.5">"{mod.tagline}"</div>
        </div>
      </div>
      {mod.body}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
interface Props {
  onViewDemo: (p: StudentProfile) => void;
  onBuildOwn: () => void;
}

export function CareerOSPortal({ onBuildOwn }: Props) {
  const [viewMode,    setViewMode]    = useState<ViewMode>('talent');
  const [talentTag,   setTalentTag]   = useState<TalentTag | null>(null);
  const [empTag,      setEmpTag]      = useState<EmpTag | null>(null);
  const [animKey,     setAnimKey]     = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const setTTag = (t: TalentTag) => {
    setTalentTag(t === talentTag ? null : t);
    setAnimKey(k => k + 1);
  };
  const setETag = (e: EmpTag) => {
    setEmpTag(e === empTag ? null : e);
    setAnimKey(k => k + 1);
  };
  const switchMode = (m: ViewMode) => {
    setViewMode(m);
    setTalentTag(null);
    setEmpTag(null);
    setAnimKey(k => k + 1);
  };

  const talentData = talentTag ? TALENT_MATRIX[talentTag] : null;
  const empData    = empTag    ? EMPLOYER_MATRIX[empTag]   : null;

  const TALENT_TAGS: { key: TalentTag; icon: string; label: string }[] = [
    { key: 'cs_final',  icon: '🎓', label: 'Final Year CS' },
    { key: 'node_dev',  icon: '⚡', label: '2 YOE Node.js Dev' },
    { key: 'ux_pivot',  icon: '🎨', label: 'Non-Tech → UI/UX' },
  ];
  const EMP_TAGS: { key: EmpTag; icon: string; label: string }[] = [
    { key: 'nextjs',  icon: '⚛️', label: 'Need Next.js Dev (<MYR 7K)' },
    { key: 'dataeng', icon: '📊', label: 'Need Senior Data Eng (MYR 12K+)' },
  ];

  return (
    <div className="bg-[#050810] py-16 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* ── HEADER ──────────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-fuchsia-400 text-xs font-black tracking-widest uppercase border border-fuchsia-400/25 px-4 py-2 rounded-full mb-5">
            <span className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full animate-pulse" />
            Career OS · Interactive Intelligence Layer
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-3">
            Select your situation.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">
              10 modules respond in real time.
            </span>
          </h2>
          <p className="text-white/30 max-w-lg mx-auto text-sm text-center">
            Malaysian IT market data. No placeholder text. No generic AI copy.
          </p>
        </div>

        {/* ── PORTAL TOGGLE — fluid sliding pill ──────────────────── */}
        <div className="flex justify-center mb-10">
          <div className="relative flex bg-slate-950 border border-slate-800 rounded-full p-1.5 w-full max-w-sm shadow-xl shadow-black/40">
            {/* Sliding background pill */}
            <div
              className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-full transition-all duration-400 ease-in-out"
              style={{
                background: 'linear-gradient(135deg, #d946ef, #22d3ee)',
                boxShadow: '0 0 20px rgba(217,70,239,0.35)',
                left: viewMode === 'talent' ? '6px' : 'calc(50% + 3px)',
              }}
            />
            {[{ m: 'talent' as ViewMode, icon: '🧑‍💻', label: 'Talent OS' }, { m: 'employer' as ViewMode, icon: '🏢', label: 'Recruiter Dashboard' }].map(opt => (
              <button
                key={opt.m}
                onClick={() => switchMode(opt.m)}
                className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-black rounded-full transition-all duration-300 ${
                  viewMode === opt.m ? 'text-black' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── SITUATION / CRITERIA TAGS ────────────────────────────── */}
        <div className="mb-8">
          <p className="text-xs font-black text-white/20 uppercase tracking-widest text-center mb-4">
            {viewMode === 'talent' ? 'Step 1 — Your current situation:' : 'Step 1 — Your hiring criteria:'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {viewMode === 'talent'
              ? TALENT_TAGS.map(({ key, icon, label }) => {
                  const active = talentTag === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setTTag(key)}
                      className={`relative flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-black transition-all duration-300 hover:-translate-y-0.5 ${
                        active
                          ? 'bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-black shadow-lg shadow-fuchsia-500/30 scale-105'
                          : 'bg-white/5 border border-white/15 text-white/50 hover:text-white hover:border-white/30 hover:shadow-lg hover:shadow-fuchsia-500/10'
                      }`}
                    >
                      {active && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping opacity-80" />}
                      <span>{icon}</span>
                      <span>{label}</span>
                    </button>
                  );
                })
              : EMP_TAGS.map(({ key, icon, label }) => {
                  const active = empTag === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setETag(key)}
                      className={`relative flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-black transition-all duration-300 hover:-translate-y-0.5 ${
                        active
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-black shadow-lg shadow-blue-500/30 scale-105'
                          : 'bg-white/5 border border-white/15 text-white/50 hover:text-white hover:border-white/30 hover:shadow-lg hover:shadow-blue-500/10'
                      }`}
                    >
                      {active && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping opacity-80" />}
                      <span>{icon}</span>
                      <span>{label}</span>
                    </button>
                  );
                })}
          </div>
        </div>

        {/* ── CONTENT AREA ─────────────────────────────────────────── */}
        <div ref={contentRef}>

          {/* Idle state */}
          {viewMode === 'talent' && !talentData && (
            <div className="text-center py-20 border border-dashed border-white/8 rounded-2xl">
              <div className="text-5xl mb-4 opacity-30">⬆</div>
              <p className="text-white/20 font-bold text-sm">Select a situation to see all 5 modules respond</p>
              <p className="text-white/10 text-xs mt-2">Career Path · Portfolio · Coach · Pay · Life Chapter</p>
            </div>
          )}
          {viewMode === 'employer' && !empData && (
            <div className="text-center py-20 border border-dashed border-white/8 rounded-2xl">
              <div className="text-5xl mb-4 opacity-30">⬆</div>
              <p className="text-white/20 font-bold text-sm">Select a hiring criterion to surface matched candidates</p>
              <p className="text-white/10 text-xs mt-2">Matching · Retention · Re-engagement · Onboarding · Resilience</p>
            </div>
          )}

          {/* Talent modules grid */}
          {viewMode === 'talent' && talentData && (
            <div key={`t-${talentTag}-${animKey}`}>
              {/* Context strip */}
              <div className="flex items-center gap-3 mb-5 bg-fuchsia-500/5 border border-fuchsia-500/15 rounded-2xl px-5 py-3">
                <span className="text-2xl">{talentData.icon}</span>
                <div>
                  <div className="text-fuchsia-400 font-black text-sm">{talentData.label}</div>
                  <div className="text-white/25 text-xs">5 modules · Malaysian IT market · live data</div>
                </div>
                <div className="ml-auto text-xs text-white/20 border border-white/8 rounded-full px-3 py-1">5 modules active</div>
              </div>
              {/* 2-col then 3-col responsive grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {talentData.modules.map((mod, i) => (
                  <div key={mod.id} className={i >= 3 ? 'md:col-span-1' : ''}>
                    <ModuleCard mod={mod} idx={i} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Employer modules grid */}
          {viewMode === 'employer' && empData && (
            <div key={`e-${empTag}-${animKey}`}>
              <div className="flex items-center gap-3 mb-5 bg-blue-500/5 border border-blue-500/15 rounded-2xl px-5 py-3">
                <span className="text-2xl">{empData.icon}</span>
                <div>
                  <div className="text-blue-400 font-black text-sm">{empData.label}</div>
                  <div className="text-white/25 text-xs">5 employer modules · zero talent noise</div>
                </div>
                <div className="ml-auto text-xs text-white/20 border border-white/8 rounded-full px-3 py-1">5 modules active</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {empData.modules.map((mod, i) => (
                  <ModuleCard key={mod.id} mod={mod} idx={i} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── BOTTOM CTA ───────────────────────────────────────────── */}
        <div className="text-center mt-12 pt-8 border-t border-white/5">
          <button
            onClick={onBuildOwn}
            className="px-10 py-4 bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-black font-black text-sm rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-fuchsia-500/30"
          >
            {viewMode === 'talent' ? '🎓 Build My Full Profile →' : '🏢 Access Full Employer Dashboard →'}
          </button>
          <p className="text-xs text-white/15 mt-4">No account · Free · MYR data · PDPA compliant</p>
        </div>
      </div>
    </div>
  );
}
