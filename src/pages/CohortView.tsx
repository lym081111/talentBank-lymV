import { useMemo, useState } from 'react';
import { CohortInsight, ReadinessProfile, StudentProfile } from '../types/evidence';
import { CohortInsightCard } from '../components/CohortInsightCard';
import { submitToCohort, getCohortSubmissionCount } from '../utils/cohortApi';

interface Props {
  cohort: CohortInsight;
  readinessProfile: ReadinessProfile;
  studentProfile: StudentProfile;
  onBack: () => void;
  backLabel?: string;
}

function getUniversityIntervention(dimension: string, percentage?: number) {
  const affected = percentage ? `${percentage}% of the mock cohort` : 'the target cohort';

  if (dimension.includes('Production')) {
    return {
      title: 'Run a production proof sprint',
      body: `${affected} lacks testing, deployment, and monitoring proof. Run a two-week sprint where students add CI, tests, live URLs, and one short incident note to an existing project.`,
      owner: 'Faculty + lab assistants',
      measure: 'New evidence blocks with test/deployment links',
    };
  }

  if (dimension.includes('System')) {
    return {
      title: 'Add a system design clinic',
      body: `${affected} needs clearer architecture evidence. Require a one-page design note for capstone projects: constraints, trade-offs, data flow, and failure handling.`,
      owner: 'Programme team',
      measure: 'Architecture notes attached to student profiles',
    };
  }

  if (dimension.includes('Work')) {
    return {
      title: 'Create micro-internship briefs',
      body: `${affected} needs work-readiness proof. Convert employer problems into 10-hour briefs with roles, feedback, delivery dates, and review notes.`,
      owner: 'Career services + employer partners',
      measure: 'Team-based evidence blocks created',
    };
  }

  if (dimension.includes('Portfolio')) {
    return {
      title: 'Hold a portfolio evidence clinic',
      body: `${affected} needs clearer proof. Review README quality, outcomes, live URLs, source links, and screenshots before internship season opens.`,
      owner: 'Career services',
      measure: 'Portfolio dimension movement after 30 days',
    };
  }

  return {
    title: `Target ${dimension}`,
    body: `${affected} shows a readiness gap in ${dimension}. Create a focused workshop, collect new evidence, then rerun the cohort board.`,
    owner: 'Programme team',
    measure: 'Dimension score movement',
  };
}

export function CohortView({ cohort, readinessProfile, studentProfile, onBack, backLabel }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submissionCount = getCohortSubmissionCount();

  async function handleSubmitToCohort() {
    setSubmitting(true);
    await submitToCohort(readinessProfile);
    setSubmitted(true);
    setSubmitting(false);
  }

  const weakestDimensions = useMemo(
    () => [...readinessProfile.dimensions].sort((a, b) => a.score - b.score).slice(0, 3),
    [readinessProfile.dimensions]
  );

  const recommendedInterventions = useMemo(
    () =>
      weakestDimensions.map((dimension) => {
        const cohortGap = cohort.topGaps.find((gap) => gap.dimension === dimension.dimension);
        return {
          dimension,
          cohortGap,
          intervention: getUniversityIntervention(dimension.dimension, cohortGap?.percentage),
        };
      }),
    [cohort.topGaps, weakestDimensions]
  );

  const topGap = cohort.topGaps[0];

  return (
    <div className="min-h-screen bg-[#07101d] px-5 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200">
              University View
            </div>
            <h1 className="mt-3 text-4xl font-black leading-tight md:text-5xl">
              Cohort intervention board.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/55 md:text-base">
              This is not a university integration. It uses mock cohort data plus the same readiness profile to show where a programme should intervene before students reach application season.
            </p>
          </div>
          <button
            onClick={onBack}
            className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-black text-white/70 transition-all hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-white/[0.06] hover:text-white"
          >
            {backLabel ?? 'Back to readiness dashboard'}
          </button>
        </div>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-100">
              Current profile
            </div>
            <div className="mt-3 text-2xl font-black">{studentProfile.name || 'Unnamed student'}</div>
            <p className="mt-2 text-sm text-white/55">
              {studentProfile.targetRole || 'No target role yet'} · readiness {readinessProfile.overall}/100
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-white/35">
              Mock cohort
            </div>
            <div className="mt-3 text-2xl font-black">{cohort.totalStudents} students</div>
            <p className="mt-2 text-sm text-white/55">
              {cohort.readinessDistribution.internshipReady} internship-ready, {cohort.readinessDistribution.developing} developing, {cohort.readinessDistribution.emerging} emerging
            </p>
          </div>
          <div className="rounded-3xl border border-amber-300/20 bg-amber-300/10 p-5">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-amber-100">
              Highest cohort gap
            </div>
            <div className="mt-3 text-2xl font-black">{topGap?.dimension ?? 'No gap data'}</div>
            <p className="mt-2 text-sm text-white/55">
              {topGap ? `${topGap.studentCount} students affected (${topGap.percentage}%)` : 'Add mock gap data to generate interventions.'}
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-4 md:p-6">
          <CohortInsightCard cohort={cohort} />
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">
                Recommended university interventions
              </div>
              <h2 className="mt-3 text-2xl font-black md:text-3xl">
                Action, not another analytics chart.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-white/55">
              Recommendations come from the weakest readiness dimensions and cohort gap frequency. Run the intervention, collect evidence, then rerun the board.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {recommendedInterventions.map(({ dimension, cohortGap, intervention }, index) => (
              <article
                key={dimension.dimension}
                className="rounded-2xl border border-cyan-300/20 bg-slate-950/55 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/45 hover:shadow-[0_0_18px_rgba(34,211,238,0.14)]"
              >
                <div className="text-cyan-200 text-3xl font-black">{index + 1}</div>
                <h3 className="mt-3 text-lg font-black">{intervention.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{intervention.body}</p>
                <div className="mt-4 space-y-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-xs text-white/55">
                  <p>
                    <strong className="text-white">Gap:</strong> {dimension.dimension} ({dimension.score}/100)
                    {cohortGap ? ` · ${cohortGap.studentCount} students affected` : ''}
                  </p>
                  <p><strong className="text-white">Owner:</strong> {intervention.owner}</p>
                  <p><strong className="text-white">Measure:</strong> {intervention.measure}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">
                What universities do with this data
              </div>
              <h2 className="mt-3 text-2xl font-black">Close readiness gaps before rejection season.</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                The board is deliberately lightweight: it tells the university what to run next, who owns it, and what evidence should improve.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                ['Identify priority gaps', 'See whether the issue is production practice, portfolio evidence, system design, or work readiness.'],
                ['Run targeted interventions', 'Create specific workshops and micro-briefs instead of generic career talks.'],
                ['Collect new evidence', 'Ask students to attach test links, deployment URLs, design notes, or employer feedback.'],
                ['Re-check the cohort', 'Measure score movement after 30 days and prove whether the intervention worked.'],
              ].map(([title, body], index) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-slate-950/55 p-5">
                  <div className="text-cyan-200 text-xl font-black">{index + 1}</div>
                  <h3 className="mt-3 font-black">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Career OS Data Layer — localStorage seam showing backend integration pattern */}
        <section className="mt-6 rounded-3xl border border-cyan-300/15 bg-cyan-300/[0.06] p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200 mb-2">
                Career OS — Cohort Data Layer
              </div>
              <h3 className="text-lg font-black text-white">
                Submit your profile to the cohort anonymously
              </h3>
              <p className="mt-1 text-sm text-white/50 max-w-xl">
                In production, this writes to a university API. Here it uses localStorage —
                the same interface, a different transport.{' '}
                {submissionCount > 0 && (
                  <span className="text-cyan-200 font-bold">{submissionCount} submission{submissionCount !== 1 ? 's' : ''} stored locally.</span>
                )}
              </p>
            </div>
            <button
              onClick={handleSubmitToCohort}
              disabled={submitted || submitting || readinessProfile.overall === 0}
              className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-6 py-3 text-sm font-black text-cyan-100 transition-all hover:-translate-y-0.5 hover:bg-cyan-300/20 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              {submitted ? '✓ Submitted to cohort' : submitting ? 'Submitting…' : 'Submit to cohort (anonymous)'}
            </button>
          </div>
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-xs text-white/40 font-mono leading-relaxed">
            <span className="text-cyan-300/70">// Integration seam — swap transport to go live</span><br />
            <span className="text-white/30">{'// localStorage → '}</span><span className="text-emerald-300/70">await fetch('/api/cohort/submit', {'{ method: "POST", body: JSON.stringify(profile) }'})</span>
          </div>
        </section>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/45">
          Cohort data is mock + locally submitted profiles only. No backend, no real university integration, no student surveillance.
        </div>
      </div>
    </div>
  );
}
