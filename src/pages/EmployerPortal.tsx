import { useMemo, useState } from 'react';
import { CareerOSPortal } from '../components/CareerOSPortal';
import { Evidence, StudentProfile } from '../types/evidence';
import { priyaSharmaProfile, kaiChenProfile, aishaPatelProfile } from '../data/mockStudent';

interface Props {
  onBuildOwn: () => void;
  onBack: () => void;
}

type EmployerPage = 'shortlist' | 'evidence' | 'fit' | 'risk' | 'onboarding';
type RoleId = 'backend' | 'data' | 'product';

const CANDIDATES = [
  {
    profile: priyaSharmaProfile,
    role: 'Backend Platform',
    location: 'Grab, Singapore',
    expected: 'MYR 45K/mo',
    status: 'Ready for senior platform loop',
    accent: 'from-cyan-400 to-emerald-300',
  },
  {
    profile: kaiChenProfile,
    role: 'Data Infrastructure',
    location: 'ByteDance, Singapore',
    expected: 'MYR 38K/mo',
    status: 'Strong streaming systems signal',
    accent: 'from-violet-400 to-cyan-300',
  },
  {
    profile: aishaPatelProfile,
    role: 'Marketplace Product',
    location: 'Lazada, Southeast Asia',
    expected: 'MYR 28K/mo',
    status: 'Expansion PM signal',
    accent: 'from-amber-300 to-rose-300',
  },
];

const ROLES: Record<RoleId, { title: string; budget: string; needs: string[]; market: string }> = {
  backend: {
    title: 'Senior Backend Engineer',
    budget: 'MYR 30K-48K/mo',
    needs: ['Distributed systems', 'Go or Python', 'High-scale APIs', 'Reliability ownership'],
    market: 'KL and Singapore platform teams are paying for proof of scale, not framework familiarity.',
  },
  data: {
    title: 'Senior Data Engineer',
    budget: 'MYR 28K-42K/mo',
    needs: ['Kafka', 'Flink or Spark', 'Warehouse cost control', 'Data quality monitoring'],
    market: 'Streaming data roles are thin. Recruiters should privilege real event-volume proof.',
  },
  product: {
    title: 'Marketplace Product Manager',
    budget: 'MYR 20K-32K/mo',
    needs: ['Market expansion', 'P&L modeling', 'Search or marketplace experience', 'Cross-functional delivery'],
    market: 'Marketplace PM hiring fails when teams screen only generic agile vocabulary.',
  },
};

const PAGE_NAV: { id: EmployerPage; title: string; helper: string }[] = [
  { id: 'shortlist', title: 'Shortlist', helper: 'ranked candidate view' },
  { id: 'evidence', title: 'Evidence', helper: 'resume proof blocks' },
  { id: 'fit', title: 'Role Fit', helper: 'why this candidate matches' },
  { id: 'risk', title: 'Risk', helper: 'what might break hiring' },
  { id: 'onboarding', title: 'Onboarding', helper: 'first 60 days' },
];

function splitTechnologies(profile: StudentProfile) {
  return Array.from(
    new Set(
      profile.evidence.flatMap(item =>
        (item.technologies ?? '')
          .split(',')
          .map(skill => skill.trim())
          .filter(Boolean)
      )
    )
  ).slice(0, 14);
}

function textOf(profile: StudentProfile) {
  return profile.evidence
    .map(item => `${item.title} ${item.description} ${item.technologies ?? ''} ${item.outcome ?? ''}`)
    .join(' ')
    .toLowerCase();
}

function getImpactSignals(profile: StudentProfile) {
  const text = profile.evidence.map(item => `${item.description} ${item.outcome ?? ''}`).join(' ');
  const matches = text.match(/\d+(?:\.\d+)?%|\d+(?:,\d{3})?\+?\s?(?:users|events\/day|requests\/day|transactions|stakeholders|countries|sellers|qps)/gi);
  return matches ? Array.from(new Set(matches)).slice(0, 6) : [];
}

function scoreCandidate(profile: StudentProfile, role: RoleId) {
  const content = textOf(profile);
  const requirements = ROLES[role].needs;
  const hits = requirements.filter(need => {
    const words = need.toLowerCase().split(/\s+|or/).filter(word => word.length > 2);
    return words.some(word => content.includes(word));
  });

  const roleBonus =
    role === 'backend' && profile.targetRole.toLowerCase().includes('software') ? 18 :
    role === 'data' && profile.targetRole.toLowerCase().includes('data') ? 18 :
    role === 'product' && profile.targetRole.toLowerCase().includes('product') ? 18 :
    0;

  return Math.min(96, 48 + hits.length * 10 + roleBonus + Math.min(profile.evidence.length * 3, 12));
}

function getCandidateInsight(profile: StudentProfile, role: RoleId) {
  const skills = splitTechnologies(profile);
  const content = textOf(profile);

  if (role === 'backend') {
    return {
      why: content.includes('distributed') || content.includes('microservices')
        ? `${profile.name} has direct distributed systems and high-scale service evidence.`
        : `${profile.name} has adjacent engineering proof, but backend architecture depth needs verification.`,
      blocker: content.includes('99.99') || content.includes('microservices')
        ? 'Ask for one architecture walkthrough. The resume already gives strong prompts.'
        : 'Missing hard backend scale evidence. Do not over-rank based on general tech keywords.',
      skills: skills.filter(skill => /go|python|distributed|microservices|postgres|aws|kafka/i.test(skill)).slice(0, 6),
    };
  }

  if (role === 'data') {
    return {
      why: content.includes('kafka') || content.includes('flink') || content.includes('spark')
        ? `${profile.name} shows real data infrastructure proof, including streaming or pipeline ownership.`
        : `${profile.name} may be a stretch for data engineering unless the interview uncovers deeper pipeline work.`,
      blocker: content.includes('events/day')
        ? 'Validate data-quality ownership and failure handling, not only throughput.'
        : 'Event volume and pipeline operations proof are thin for this role.',
      skills: skills.filter(skill => /kafka|flink|spark|python|sql|clickhouse|data/i.test(skill)).slice(0, 6),
    };
  }

  return {
    why: content.includes('market') || content.includes('product') || content.includes('stakeholder')
      ? `${profile.name} has product-market evidence that can be tested against marketplace expansion work.`
      : `${profile.name} is not a natural PM match from the current resume evidence.`,
    blocker: content.includes('p&l') || content.includes('conversion')
      ? 'Ask for the decision memo behind the launch, not just the result.'
      : 'Commercial decision-making proof is not explicit enough.',
    skills: skills.filter(skill => /product|market|strategy|research|sql|stakeholder|analysis/i.test(skill)).slice(0, 6),
  };
}

function strongestEvidence(profile: StudentProfile, role: RoleId) {
  const terms = ROLES[role].needs.join(' ').toLowerCase().split(/\s+/).filter(word => word.length > 3);
  return [...profile.evidence]
    .map(item => ({
      item,
      score: terms.reduce((sum, term) => {
        const source = `${item.title} ${item.description} ${item.technologies ?? ''}`.toLowerCase();
        return sum + (source.includes(term) ? 1 : 0);
      }, 0),
    }))
    .sort((a, b) => b.score - a.score)
    .map(result => result.item);
}

function CandidateSelector({
  selectedId,
  role,
  onSelect,
}: {
  selectedId: string;
  role: RoleId;
  onSelect: (profile: StudentProfile) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {CANDIDATES.map(candidate => {
        const active = candidate.profile.id === selectedId;
        const score = scoreCandidate(candidate.profile, role);
        return (
          <button
            key={candidate.profile.id}
            onClick={() => onSelect(candidate.profile)}
            className={`text-left rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1 ${
              active
                ? 'border-blue-300/60 bg-blue-300/10 shadow-[0_0_30px_rgba(96,165,250,0.14)]'
                : 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]'
            }`}
          >
            <div className={`h-1.5 rounded-full bg-gradient-to-r ${candidate.accent} mb-4`} />
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-white font-black text-sm">{candidate.profile.name}</div>
                <div className="text-white/45 text-xs mt-1">{candidate.role}</div>
              </div>
              <div className="text-blue-100 font-black text-sm">{score}%</div>
            </div>
            <div className="text-white/30 text-xs mt-2">{candidate.status}</div>
          </button>
        );
      })}
    </div>
  );
}

function RoleSelector({ role, onChange }: { role: RoleId; onChange: (role: RoleId) => void }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-2 grid grid-cols-1 md:grid-cols-3 gap-2">
      {(Object.keys(ROLES) as RoleId[]).map(roleId => {
        const active = roleId === role;
        return (
          <button
            key={roleId}
            onClick={() => onChange(roleId)}
            className={`rounded-xl p-4 text-left transition-all duration-300 ${
              active
                ? 'bg-white text-slate-950 shadow-lg'
                : 'text-white/55 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <div className="text-sm font-black">{ROLES[roleId].title}</div>
            <div className={`text-xs mt-1 ${active ? 'text-slate-500' : 'text-white/30'}`}>{ROLES[roleId].budget}</div>
          </button>
        );
      })}
    </div>
  );
}

function PageTabs({ page, onChange }: { page: EmployerPage; onChange: (page: EmployerPage) => void }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-2 grid grid-cols-2 md:grid-cols-5 gap-2">
      {PAGE_NAV.map(item => {
        const active = item.id === page;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`rounded-xl px-3 py-3 text-left transition-all duration-300 ${
              active
                ? 'bg-white text-slate-950 shadow-lg'
                : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <div className="text-sm font-black">{item.title}</div>
            <div className={`text-[11px] mt-0.5 ${active ? 'text-slate-500' : 'text-white/25'}`}>{item.helper}</div>
          </button>
        );
      })}
    </div>
  );
}

function MetricCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="text-white/35 text-xs uppercase tracking-[0.18em] font-black">{label}</div>
      <div className="text-3xl font-black text-white mt-3">{value}</div>
      <div className="text-white/45 text-sm mt-2 leading-relaxed">{note}</div>
    </div>
  );
}

function EvidenceCard({ item, rank }: { item: Evidence; rank: number }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-300/40 hover:shadow-[0_0_22px_rgba(96,165,250,0.12)]">
      <div className="text-blue-200 text-xs font-black uppercase tracking-[0.18em]">
        Evidence {String(rank).padStart(2, '0')}
      </div>
      <h3 className="text-white font-black text-lg mt-2">{item.title}</h3>
      <p className="text-white/55 text-sm leading-relaxed mt-4">{item.description}</p>
      {item.technologies && <p className="text-white/35 text-xs mt-4">Stack: {item.technologies}</p>}
      {item.outcome && (
        <div className="mt-4 rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-sm text-emerald-100">
          {item.outcome}
        </div>
      )}
    </article>
  );
}

function ShortlistPage({
  selected,
  role,
  impactSignals,
}: {
  selected: StudentProfile;
  role: RoleId;
  impactSignals: string[];
}) {
  const selectedMeta = CANDIDATES.find(candidate => candidate.profile.id === selected.id);
  const score = scoreCandidate(selected, role);
  const insight = getCandidateInsight(selected, role);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-[fadeIn_0.25s_ease-out]">
      <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/[0.04] p-7">
        <div className="text-blue-200 text-xs font-black uppercase tracking-[0.22em]">Recruiter shortlist</div>
        <h2 className="text-3xl md:text-5xl font-black text-white mt-4 leading-tight">
          {selected.name} is being evaluated for {ROLES[role].title}.
        </h2>
        <p className="text-white/55 text-base leading-relaxed mt-5">
          The employer view should read the candidate resume and expose hiring signal: why this person fits, where evidence is thin, and what to ask next.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-7">
          <MetricCard label="Fit score" value={`${score}%`} note="derived from role needs and resume evidence" />
          <MetricCard label="Evidence" value={String(selected.evidence.length)} note="proof blocks available before interview" />
          <MetricCard label="Expected" value={selectedMeta?.expected ?? 'TBD'} note="compensation band to qualify early" />
        </div>
      </div>

      <aside className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
        <div className="text-white/35 text-xs font-black uppercase tracking-[0.18em]">Recruiter notes</div>
        <div className="mt-5 rounded-2xl border border-blue-300/20 bg-blue-300/10 p-4">
          <div className="text-blue-100 font-black text-sm">Why the system surfaced this profile</div>
          <p className="text-blue-100/65 text-sm mt-2">{insight.why}</p>
        </div>
        <div className="mt-4">
          <div className="text-white/35 text-xs">Hard impact signals</div>
          <div className="flex flex-wrap gap-2 mt-2">
            {(impactSignals.length ? impactSignals : ['No quantified impact found']).map(signal => (
              <span key={signal} className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
                {signal}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <div className="text-white/35 text-xs">Current profile source</div>
          <div className="text-white font-bold mt-1">{selected.university ?? 'Unknown education'}</div>
          <div className="text-white/35 text-xs mt-1">{selected.major}</div>
        </div>
      </aside>
    </div>
  );
}

function EvidencePage({ profile, role }: { profile: StudentProfile; role: RoleId }) {
  const evidence = strongestEvidence(profile, role);
  return (
    <div className="space-y-4 animate-[fadeIn_0.25s_ease-out]">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <div className="text-blue-200 text-xs font-black uppercase tracking-[0.22em]">Resume proof for recruiters</div>
        <h2 className="text-3xl font-black text-white mt-3">Evidence is sorted by relevance to the hiring brief.</h2>
        <p className="text-white/50 mt-3 max-w-3xl">
          The employer does not need a starter-kit explanation. They need the exact resume blocks that prove or weaken the candidate's match.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {evidence.map((item, index) => (
          <EvidenceCard key={item.id} item={item} rank={index + 1} />
        ))}
      </div>
    </div>
  );
}

function FitPage({ profile, role }: { profile: StudentProfile; role: RoleId }) {
  const insight = getCandidateInsight(profile, role);
  const matchedNeeds = ROLES[role].needs.map(need => {
    const content = textOf(profile);
    const hit = need.toLowerCase().split(/\s+|or/).some(word => word.length > 2 && content.includes(word));
    return { need, hit };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-5 animate-[fadeIn_0.25s_ease-out]">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7">
        <div className="text-blue-200 text-xs font-black uppercase tracking-[0.22em]">Role fit</div>
        <h2 className="text-3xl font-black text-white mt-3">Match the job brief to resume evidence.</h2>
        <p className="text-white/55 mt-4">{ROLES[role].market}</p>
        <div className="mt-6 space-y-3">
          {matchedNeeds.map(item => (
            <div
              key={item.need}
              className={`rounded-2xl border p-4 ${
                item.hit
                  ? 'border-emerald-300/20 bg-emerald-300/10'
                  : 'border-amber-300/20 bg-amber-300/10'
              }`}
            >
              <div className={item.hit ? 'text-emerald-100 font-black' : 'text-amber-100 font-black'}>
                {item.hit ? 'Supported' : 'Needs validation'}
              </div>
              <div className="text-white/70 text-sm mt-1">{item.need}</div>
            </div>
          ))}
        </div>
      </div>
      <aside className="rounded-3xl border border-white/10 bg-slate-950/70 p-7">
        <div className="text-white/35 text-xs font-black uppercase tracking-[0.18em]">Interview prompts</div>
        <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
          <div className="text-cyan-100 font-black text-sm">Ask this first</div>
          <p className="text-cyan-100/65 text-sm mt-2">{insight.blocker}</p>
        </div>
        <div className="mt-5">
          <div className="text-white/35 text-xs">Relevant extracted skills</div>
          <div className="flex flex-wrap gap-2 mt-2">
            {(insight.skills.length ? insight.skills : splitTechnologies(profile).slice(0, 6)).map(skill => (
              <span key={skill} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/65">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

function RiskPage({ profile, role }: { profile: StudentProfile; role: RoleId }) {
  const insight = getCandidateInsight(profile, role);
  const score = scoreCandidate(profile, role);
  const riskLevel = score >= 85 ? 'Low evidence risk' : score >= 72 ? 'Medium evidence risk' : 'High evidence risk';

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 animate-[fadeIn_0.25s_ease-out]">
      <div className="text-blue-200 text-xs font-black uppercase tracking-[0.22em]">Hiring risk</div>
      <h2 className="text-3xl font-black text-white mt-3">The system should tell recruiters what can go wrong.</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-7">
        <MetricCard label="Risk level" value={riskLevel} note="based on role fit and missing evidence" />
        <MetricCard label="Budget" value={ROLES[role].budget} note="use this before wasting interview time" />
        <MetricCard label="Evidence depth" value={`${profile.evidence.length} blocks`} note="resume pages available for review" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
        <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-5">
          <div className="text-amber-100 font-black">Main blocker</div>
          <p className="text-amber-100/70 text-sm mt-2">{insight.blocker}</p>
        </div>
        <div className="rounded-2xl border border-rose-300/20 bg-rose-300/10 p-5">
          <div className="text-rose-100 font-black">Do not over-index on</div>
          <p className="text-rose-100/70 text-sm mt-2">
            Job titles alone. The recruiter view should rank proof: scale handled, decisions owned, and outcomes shipped.
          </p>
        </div>
      </div>
    </div>
  );
}

function OnboardingPage({ profile, role }: { profile: StudentProfile; role: RoleId }) {
  const score = scoreCandidate(profile, role);
  const firstTask =
    role === 'backend' ? 'Ship one reliability improvement in an existing service' :
    role === 'data' ? 'Own one data quality monitor for a production pipeline' :
    'Write a marketplace opportunity memo from one live funnel';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-5 animate-[fadeIn_0.25s_ease-out]">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7">
        <div className="text-blue-200 text-xs font-black uppercase tracking-[0.22em]">Onboarding predictor</div>
        <h2 className="text-3xl font-black text-white mt-3">Hiring does not end at offer accepted.</h2>
        <p className="text-white/55 mt-4">
          The employer workspace should translate resume evidence into a first-60-days plan that tests the same skills used for matching.
        </p>
        <div className="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-5">
          <div className="text-emerald-100 text-xs font-black uppercase tracking-[0.18em]">Predicted ramp</div>
          <div className="text-4xl font-black text-white mt-3">{score >= 85 ? 'Fast' : score >= 72 ? 'Managed' : 'Needs support'}</div>
          <p className="text-emerald-100/65 text-sm mt-2">Based on resume proof alignment with {ROLES[role].title}.</p>
        </div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-7">
        <div className="text-white/35 text-xs font-black uppercase tracking-[0.18em]">First 60 days</div>
        <div className="mt-5 space-y-3">
          {[
            ['Day 1-10', 'Validate claimed evidence', `Walk through ${profile.evidence[0]?.title ?? 'top resume item'}.`],
            ['Day 11-30', 'Assign proof-matched task', firstTask],
            ['Day 31-60', 'Measure ramp signal', 'Compare delivery quality, stakeholder load, and support needed.'],
          ].map(([time, title, body]) => (
            <div key={time} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-blue-100 text-xs font-black">{time}</div>
              <div className="text-white font-black mt-1">{title}</div>
              <div className="text-white/45 text-sm mt-1">{body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function EmployerPortal({ onBuildOwn, onBack }: Props) {
  const [role, setRole] = useState<RoleId>('backend');
  const [selectedProfile, setSelectedProfile] = useState<StudentProfile>(priyaSharmaProfile);
  const [page, setPage] = useState<EmployerPage>('shortlist');

  const impactSignals = useMemo(() => getImpactSignals(selectedProfile), [selectedProfile]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#070b13] text-white">
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      <div className="border-b border-white/10 bg-[#050810]/95">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center gap-5">
          <button
            onClick={onBack}
            className="text-white/45 hover:text-white text-sm font-bold transition-colors"
          >
            Back to home
          </button>
          <div className="h-4 w-px bg-white/15" />
          <div>
            <div className="text-xs text-blue-300 font-black uppercase tracking-[0.22em]">Recruiter Dashboard</div>
            <div className="text-white font-black text-sm">Resume-driven talent intelligence</div>
          </div>
          <div className="ml-auto">
            <button
              onClick={onBuildOwn}
              title="Add a new candidate resume/profile to test against the employer workspace"
              className="rounded-full border border-white/15 px-4 py-2 text-xs font-black text-white/70 transition-all hover:border-blue-300/50 hover:text-white hover:bg-white/[0.05]"
            >
              Add candidate resume
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 items-end">
          <div>
            <div className="inline-flex rounded-full border border-blue-300/20 bg-blue-300/10 px-3 py-1 text-xs font-black text-blue-100 uppercase tracking-[0.18em]">
              Employer pages, powered by candidate resumes
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-[0.95] mt-5">
              Review candidates by proof, not module descriptions.
            </h1>
            <p className="text-white/55 text-lg leading-relaxed mt-5 max-w-2xl">
              Select a hiring brief, then inspect each candidate through employer pages: shortlist, evidence, role fit, risk, and onboarding.
            </p>
          </div>
          <RoleSelector role={role} onChange={nextRole => {
            setRole(nextRole);
            setPage('shortlist');
          }} />
        </section>

        <section className="mt-8">
          <CandidateSelector
            selectedId={selectedProfile.id}
            role={role}
            onSelect={profile => {
              setSelectedProfile(profile);
              setPage('shortlist');
            }}
          />
        </section>

        <section className="mt-10">
          <div className="mb-5">
            <div className="text-xs text-blue-200 font-black uppercase tracking-[0.22em]">Recruiter Dashboard components</div>
            <h2 className="text-2xl md:text-3xl font-black text-white mt-2">
              Five Career OS modules for the employer side.
            </h2>
            <p className="text-white/45 text-sm mt-2 max-w-3xl">
              This is the official starter-kit layer, now tied to the recruiter role instead of floating on the landing page. It explains the system components behind the candidate review workspace below.
            </p>
          </div>
          <CareerOSPortal defaultMode="employer" hideToggle hideCta onBuildOwn={onBuildOwn} />
        </section>

        <section className="mt-8">
          <PageTabs page={page} onChange={setPage} />
        </section>

        <section className="mt-6">
          {page === 'shortlist' && (
            <ShortlistPage selected={selectedProfile} role={role} impactSignals={impactSignals} />
          )}
          {page === 'evidence' && <EvidencePage profile={selectedProfile} role={role} />}
          {page === 'fit' && <FitPage profile={selectedProfile} role={role} />}
          {page === 'risk' && <RiskPage profile={selectedProfile} role={role} />}
          {page === 'onboarding' && <OnboardingPage profile={selectedProfile} role={role} />}
        </section>
      </main>
    </div>
  );
}
