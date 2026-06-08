import { useMemo, useState } from 'react';
import { Evidence, ReadinessProfile, StudentProfile } from '../types/evidence';
import { danielLeeProfile, priyaSharmaProfile, kaiChenProfile, aishaPatelProfile } from '../data/mockStudent';
import { calculateReadinessProfile } from '../utils/readinessScoring';

interface Props {
  profile: StudentProfile;
  evidence: Evidence[];
  readinessProfile: ReadinessProfile;
  onBuildOwn: () => void;
  onBack: () => void;
}

const DEMO_CANDIDATES = [danielLeeProfile, priyaSharmaProfile, kaiChenProfile, aishaPatelProfile];

function splitTechnologies(evidence: Evidence[]) {
  return Array.from(
    new Set(
      evidence.flatMap((item) =>
        (item.technologies ?? '')
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean)
      )
    )
  ).slice(0, 12);
}

function strongestEvidence(evidence: Evidence[]) {
  return [...evidence].sort((a, b) => {
    const aScore = (a.outcome ? 2 : 0) + (a.link || a.verified ? 2 : 0) + ((a.technologies ?? '').length ? 1 : 0);
    const bScore = (b.outcome ? 2 : 0) + (b.link || b.verified ? 2 : 0) + ((b.technologies ?? '').length ? 1 : 0);
    return bScore - aScore;
  })[0];
}

function getDecision(score: number) {
  if (score >= 75) {
    return {
      label: 'Shortlist',
      tone: 'emerald',
      reason: 'Evidence is strong enough to justify an interview. Use the questions below to verify scope, ownership, and production depth.',
    };
  }

  if (score >= 55) {
    return {
      label: 'Phone screen first',
      tone: 'amber',
      reason: 'The profile has useful signals, but the interview should validate the weakest dimension before a full technical loop.',
    };
  }

  return {
    label: 'Do not shortlist yet',
    tone: 'rose',
    reason: 'The current evidence is too thin for a confident shortlist. Ask the candidate to add stronger proof and reapply.',
  };
}

function toneClasses(tone: string) {
  if (tone === 'emerald') return 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100';
  if (tone === 'amber') return 'border-amber-300/25 bg-amber-300/10 text-amber-100';
  return 'border-rose-300/25 bg-rose-300/10 text-rose-100';
}

function buildQuestions(profile: ReadinessProfile, evidence: Evidence[]) {
  const weakest = [...profile.dimensions].sort((a, b) => a.score - b.score).slice(0, 3);
  const strongest = strongestEvidence(evidence);

  return [
    strongest
      ? `Walk me through "${strongest.title}". What exactly did you own, and what proof can you show?`
      : 'Which project best proves your target role readiness, and where can I inspect it?',
    `Your weakest signal is ${weakest[0]?.dimension ?? 'Portfolio Evidence'}. What have you done recently to close that gap?`,
    `Show one source phrase or artifact that proves ${profile.allExtractedSkills[0]?.skill ?? 'your strongest skill'}.`,
    'What would you improve in this work if you had another 30 days?',
  ];
}

export function EmployerPortal({ profile, evidence, readinessProfile, onBuildOwn, onBack }: Props) {
  const candidateOptions = useMemo(() => {
    const demoOptions = DEMO_CANDIDATES.map((candidate) => ({
      profile: candidate,
      evidence: candidate.evidence,
      readiness: calculateReadinessProfile(candidate.evidence),
    }));

    const hasCustomProfile = profile.name && evidence.length > 0 && !demoOptions.some((item) => item.profile.id === profile.id);
    if (!hasCustomProfile) return demoOptions;

    return [
      { profile, evidence, readiness: readinessProfile },
      ...demoOptions,
    ];
  }, [evidence, profile, readinessProfile]);

  const [selectedId, setSelectedId] = useState(candidateOptions[0]?.profile.id ?? profile.id);
  const selectedCandidate = candidateOptions.find((candidate) => candidate.profile.id === selectedId) ?? candidateOptions[0];
  const bestCandidate = candidateOptions.reduce((best, candidate) =>
    candidate.readiness.overall > best.readiness.overall ? candidate : best
  , candidateOptions[0]);

  const activeProfile = selectedCandidate.profile;
  const activeEvidence = selectedCandidate.evidence;
  const activeReadiness = selectedCandidate.readiness;
  const decision = getDecision(activeReadiness.overall);
  const skills = splitTechnologies(activeEvidence);
  const strongest = strongestEvidence(activeEvidence);
  const topDimensions = [...activeReadiness.dimensions].sort((a, b) => b.score - a.score).slice(0, 2);
  const weakDimensions = [...activeReadiness.dimensions].sort((a, b) => a.score - b.score).slice(0, 2);
  const questions = buildQuestions(activeReadiness, activeEvidence);

  return (
    <div className="min-h-screen bg-[#070b13] text-white">
      <div className="border-b border-white/10 bg-[#050810]/95">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-wrap items-center gap-5">
          <button onClick={onBack} className="text-white/45 hover:text-white text-sm font-bold transition-colors">
            Back to home
          </button>
          <div className="h-4 w-px bg-white/15" />
          <div>
            <div className="text-xs text-blue-300 font-black uppercase tracking-[0.22em]">Employer View</div>
            <div className="text-white font-black text-sm">Evidence-backed hiring brief</div>
          </div>
          <button
            onClick={onBuildOwn}
            className="ml-auto rounded-full border border-white/15 px-4 py-2 text-xs font-black text-white/70 transition-all hover:border-blue-300/50 hover:text-white hover:bg-white/[0.05]"
          >
            Use another profile
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <section className="mb-6 rounded-[2rem] border border-white/10 bg-white/[0.035] p-5">
          <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs text-blue-200 font-black uppercase tracking-[0.22em]">Candidate shortlist set</div>
              <p className="mt-1 text-sm text-white/45">Switch personas to compare the hiring brief generated from each resume.</p>
            </div>
            <div className="text-xs font-black text-emerald-200">
              Top choice: {bestCandidate.profile.name} ({bestCandidate.readiness.overall}/100)
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {candidateOptions.map((candidate) => {
              const active = candidate.profile.id === activeProfile.id;
              const topChoice = candidate.profile.id === bestCandidate.profile.id;
              const candidateDecision = getDecision(candidate.readiness.overall);
              return (
                <button
                  key={candidate.profile.id}
                  onClick={() => setSelectedId(candidate.profile.id)}
                  className={`relative min-h-[150px] rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-1 ${
                    active
                      ? 'border-blue-300/70 bg-blue-300/12 shadow-[0_0_26px_rgba(96,165,250,0.18)]'
                      : 'border-white/10 bg-slate-950/55 hover:border-white/25 hover:bg-white/[0.05]'
                  }`}
                >
                  {topChoice && (
                    <div className="absolute right-3 top-3 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-emerald-100">
                      Best fit
                    </div>
                  )}
                  <div className="pr-20 text-xl font-black text-white">{candidate.profile.name}</div>
                  <div className="mt-1 text-xs text-white/40">{candidate.profile.targetRole}</div>
                  <div className="mt-4 flex items-end justify-between gap-3">
                    <div>
                      <div className="text-3xl font-black text-white">{candidate.readiness.overall}</div>
                      <div className="text-[10px] font-black uppercase tracking-[0.14em] text-white/30">readiness</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-blue-100">{candidateDecision.label}</div>
                      <div className="text-[11px] text-white/35">{candidate.evidence.length} evidence blocks</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 md:p-9">
          <div className="text-xs text-blue-200 font-black uppercase tracking-[0.22em]">
            Same evidence, employer readout
          </div>
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-7 items-start">
            <div>
              <h1 className="text-4xl md:text-6xl font-black leading-[0.95]">
                Should I shortlist {activeProfile.name || 'this candidate'}?
              </h1>
              <p className="text-white/55 text-lg leading-relaxed mt-5 max-w-3xl">
                This is not an employer product suite. It is a lightweight hiring brief generated from the same student evidence used in Talent View.
              </p>
            </div>
            <div className={`rounded-3xl border p-5 ${toneClasses(decision.tone)}`}>
              <div className="text-xs font-black uppercase tracking-[0.18em] opacity-70">Recommendation</div>
              <div className="text-4xl font-black mt-3">{decision.label}</div>
              <p className="text-sm leading-relaxed mt-4 opacity-80">{decision.reason}</p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <div className="text-white/35 text-xs font-black uppercase tracking-[0.18em]">Readiness</div>
            <div className="text-5xl font-black mt-3">{activeReadiness.overall}/100</div>
            <div className="text-white/45 text-sm mt-2">{activeReadiness.level}</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <div className="text-white/35 text-xs font-black uppercase tracking-[0.18em]">Evidence</div>
            <div className="text-5xl font-black mt-3">{activeEvidence.length}</div>
            <div className="text-white/45 text-sm mt-2">proof blocks from the candidate profile</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <div className="text-white/35 text-xs font-black uppercase tracking-[0.18em]">Target role</div>
            <div className="text-2xl font-black mt-3">{activeProfile.targetRole || 'Not specified'}</div>
            <div className="text-white/45 text-sm mt-2">{activeProfile.major || 'Candidate profile'}</div>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-5">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <div className="text-blue-200 text-xs font-black uppercase tracking-[0.22em]">Why shortlist</div>
            <div className="mt-5 space-y-3">
              {topDimensions.map((dimension) => (
                <div key={dimension.dimension} className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <strong className="text-emerald-100">{dimension.dimension}</strong>
                    <span className="text-emerald-100 font-black">{dimension.score}/100</span>
                  </div>
                  <p className="text-emerald-100/65 text-sm mt-2">{dimension.explanation}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <div className="text-amber-200 text-xs font-black uppercase tracking-[0.22em]">What to probe</div>
            <div className="mt-5 space-y-3">
              {weakDimensions.map((dimension) => (
                <div key={dimension.dimension} className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <strong className="text-amber-100">{dimension.dimension}</strong>
                    <span className="text-amber-100 font-black">{dimension.score}/100</span>
                  </div>
                  <p className="text-amber-100/70 text-sm mt-2">{dimension.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-5">
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
            <div className="text-blue-200 text-xs font-black uppercase tracking-[0.22em]">Interview questions</div>
            <div className="mt-5 space-y-3">
              {questions.map((question, index) => (
                <div key={question} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="text-blue-100 text-xs font-black">Question {index + 1}</div>
                  <p className="text-white/70 text-sm leading-relaxed mt-2">{question}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <div className="text-blue-200 text-xs font-black uppercase tracking-[0.22em]">Source trail</div>
            <h2 className="text-2xl font-black mt-4">{strongest?.title || 'No evidence yet'}</h2>
            <p className="text-white/50 text-sm leading-relaxed mt-3">
              {strongest?.outcome || strongest?.description || 'Add evidence in Talent View before using the employer brief.'}
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              {(skills.length ? skills : ['No extracted skills yet']).map((skill) => (
                <span key={skill} className="rounded-full border border-blue-300/20 bg-blue-300/10 px-3 py-1 text-xs font-black text-blue-100">
                  {skill}
                </span>
              ))}
            </div>
          </aside>
        </section>

        <p className="text-center text-xs text-white/25 mt-8">
          Scope boundary: no employer login, job posting system, applicant tracking, candidate comparison, messaging, or marketplace.
        </p>
      </main>
    </div>
  );
}
