import { Evidence, ReadinessProfile, StudentProfile } from '../types/evidence';

interface Props {
  profile: StudentProfile;
  evidence: Evidence[];
  readinessProfile: ReadinessProfile;
  onBuildOwn: () => void;
  onBack: () => void;
}

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
  const decision = getDecision(readinessProfile.overall);
  const skills = splitTechnologies(evidence);
  const strongest = strongestEvidence(evidence);
  const topDimensions = [...readinessProfile.dimensions].sort((a, b) => b.score - a.score).slice(0, 2);
  const weakDimensions = [...readinessProfile.dimensions].sort((a, b) => a.score - b.score).slice(0, 2);
  const questions = buildQuestions(readinessProfile, evidence);

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
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 md:p-9">
          <div className="text-xs text-blue-200 font-black uppercase tracking-[0.22em]">
            Same evidence, employer readout
          </div>
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-7 items-start">
            <div>
              <h1 className="text-4xl md:text-6xl font-black leading-[0.95]">
                Should I shortlist {profile.name || 'this candidate'}?
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
            <div className="text-5xl font-black mt-3">{readinessProfile.overall}/100</div>
            <div className="text-white/45 text-sm mt-2">{readinessProfile.level}</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <div className="text-white/35 text-xs font-black uppercase tracking-[0.18em]">Evidence</div>
            <div className="text-5xl font-black mt-3">{evidence.length}</div>
            <div className="text-white/45 text-sm mt-2">proof blocks from the candidate profile</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <div className="text-white/35 text-xs font-black uppercase tracking-[0.18em]">Target role</div>
            <div className="text-2xl font-black mt-3">{profile.targetRole || 'Not specified'}</div>
            <div className="text-white/45 text-sm mt-2">{profile.major || 'Candidate profile'}</div>
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
