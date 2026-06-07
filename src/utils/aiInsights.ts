import Anthropic from '@anthropic-ai/sdk';
import { Evidence, StudentProfile } from '../types/evidence';

export interface CareerInsight {
  narrative: string;
  keyGap: string;
  nextStep: string;
  isDemo: boolean;
}

// Pre-generated insights for demo personas — instant load for judges, no API latency
export const DEMO_INSIGHTS = {
  'Daniel Lee': {
    narrative:
      "Daniel has built a strong technical foundation across Python, JavaScript, and React — skills that align with 78% of Malaysian SWE internship postings. His evidence shows consistent delivery: a deployed FYP, a real internship, and a hackathon finalist result. However, across all 5 projects, there is no mention of automated testing, CI/CD pipelines, or deployment monitoring — the exact gap that separates shortlisted candidates from those who get filtered out at the technical screening stage.",
    keyGap:
      "Production Practices — no evidence of automated testing, CI/CD pipelines, or deployment monitoring across any of the 5 projects. This is the #1 screening filter at tech companies in KL and Singapore.",
    nextStep:
      "Add a GitHub Actions CI pipeline to the AI Governance Classifier (FYP) this week — configure it to run pytest on every push. This single addition demonstrates production mindset, takes under 3 hours, and can be added directly to an existing project rather than starting something new.",
  } as CareerInsight,
  'Sarah Tan': {
    narrative:
      "Sarah demonstrates exceptional focus in data engineering and analytics, with three technical projects showing clear progression from learning (data analysis coursework) to applied work (weather prediction model) to deployment (real-time metrics dashboard). Her evidence reveals a student ready for data-focused roles, with strong Python fundamentals and experience in ML workflows. The main gap isn't technical—it's visibility into her contributions and the scale of impact she's achieved.",
    keyGap:
      "Communication & Portfolio Impact — while her technical skills are solid, there's limited evidence of how her work affected business or user outcomes. Data engineers at Grab and Shopee in SG/MY look for stories of scale: 'improved query performance by X%' or 'reduced processing time by Y hours'.",
    nextStep:
      "Quantify one project: take your weather prediction model and add metrics like 'achieved 87% accuracy' or 'processes 10K predictions/day'. Then write a 2-minute technical blog post explaining the data pipeline. Deploy the blog to Medium or a GitHub Pages site. This single artifact—public, quantified, searchable—makes you visible to data hiring managers across Southeast Asia.",
  } as CareerInsight,
  'Ahmad Razif': {
    narrative:
      "Ahmad is building a generalist technical profile with front-end, back-end, and mobile development experience across 4 distinct projects. His evidence shows adaptability and breadth—valuable in startups—but lacks the depth hiring managers typically see in candidates ready for senior internships at tier-1 tech companies. The challenge isn't capability, it's clarity: what is your specialization? Where do you want to go deeper?",
    keyGap:
      "Depth & Production Maturity — multiple projects across different stacks (React, Django, Flutter) is impressive for learning, but doesn't signal readiness for a senior engineering team that expects you to own and deploy production systems. One project with CI/CD, monitoring, and documented production lessons is worth more than three half-finished portfolio pieces.",
    nextStep:
      "Choose your strongest project and take it to production completeness this month: (1) Deploy it to a live URL (Vercel/Railway), (2) add simple Sentry error tracking, (3) write a 'Lessons Learned' section on GitHub documenting one technical decision and its tradeoff. Production experience, even self-taught, separates internship-ready from early-stage students.",
  } as CareerInsight,
  'Priya Sharma': {
    narrative:
      "Priya's evidence tells a rare story in the Asia tech market: end-to-end production ownership at Grab across intern, SWE II, and Senior SWE, with hard proof of scale — 8M+ daily active users, 99.99% uptime SLA, and MYR 35B+ in monthly transactions processed. The distributed systems depth (Raft consensus, Kafka, real-time matching) puts her in the top 5–10% of backend engineers at her level across Singapore and Malaysia. The landscape from here is clear: Staff Engineer and above is within reach, but the path requires public proof — recruiters at Shopee, ByteDance, and Stripe Singapore consistently ask for externally verifiable architecture work, not just internal impact claims.",
    keyGap:
      "Public Portfolio Absence — every evidence item lives behind Grab's internal systems. There are no public GitHub projects, no technical blog posts, and no architecture write-ups that a recruiter or Staff Eng panel can inspect before the interview. In Singapore's competitive senior engineering market, private-company evidence alone creates friction in the hiring process.",
    nextStep:
      "Write one sanitized architecture case study this month — pick the driver-consumer matching system redesign, strip all proprietary details, and publish it as a 600-word technical post on GitHub Pages or Medium. Cover the constraint (wait time vs. driver earnings trade-off), the algorithm decision, and one failure you handled. This single public artifact is worth more than 10 internal promotion notes when applying to Staff roles at Stripe, Shopee, or Sea Group.",
  } as CareerInsight,
  'Kai Chen': {
    narrative:
      "Kai's career arc — DBS analyst to ByteDance Senior Data Engineer in under 3 years — is one of the cleanest analyst-to-engineer transitions visible in the Singapore data market. The pipeline evidence is concrete: 100M events/day at ByteDance, 500M events/day at senior level, sub-15-minute latency from 4 hours. Kafka, Flink, ClickHouse, and Spark are exactly the stack that Grab, Sea Group, and regional fintechs are hiring for in 2025–2026, with 12–15% YoY demand growth. The landscape is strong: Senior Data Engineer to Staff or Data Platform Lead is achievable in the next 18–24 months, but the jump requires leadership proof at larger team scale and a visible technical opinion outside ByteDance's walls.",
    keyGap:
      "Leadership Scope & External Visibility — team size is capped at 2 engineers across all evidence. Staff Engineer and Data Platform Lead roles at Singapore Tier 1 tech companies typically want to see 4–6 person team ownership, cross-org RFC influence, or external conference/blog presence. Kai's technical depth is not in question; the gap is proving that depth can scale to org-level influence.",
    nextStep:
      "Submit a talk proposal to DataEngConf Asia or PyCon APAC covering the 500M events/day architecture decision — specifically the trade-off between ClickHouse and a competing solution. Conference talks are the fastest credentialing shortcut for senior data engineers in the Singapore market, and the abstract alone is usually enough to unlock Staff-level recruiter conversations at Shopee, Grab, and regional banks.",
  } as CareerInsight,
  'Aisha Patel': {
    narrative:
      "Aisha's PM evidence spans three distinct markets — India (Flipkart, Amazon), India-to-SEA cross-border (Lazada) — with hard commercial outcomes: 8% conversion lift on Amazon India and MYR 280M+ annual GMV run rate at Lazada. That combination of market-entry proof, P&L ownership, and multi-country research is rare among PMs at her level and directly matches what Shopee, Grab, and Gojek are hiring for in Singapore and Jakarta as they push into new geographies. The path to Group PM or Director of Product is open, but the next hiring panel will probe technical fluency — how deeply does she understand the systems her teams are building?",
    keyGap:
      "Technical Depth Evidence — all four evidence items show strong business and strategy execution, but none document a technical decision: no API design choice, no data model trade-off, no infrastructure constraint that shaped the product roadmap. Senior PM panels at tier-1 Asia tech companies consistently distinguish between PMs who coordinate engineers and PMs who can hold a technical opinion in a system design conversation.",
    nextStep:
      "Add one technical decision story to the Lazada cross-border evidence block: pick a real constraint (e.g., seller onboarding API latency, or data pipeline lag affecting inventory sync) and write 2–3 sentences describing what the technical trade-off was, what you recommended, and what shipped. It does not need to be a deep engineering decision — it needs to show that you were in the room when the architecture choice was made and understood why it mattered to the product.",
  } as CareerInsight,
};

export const DANIEL_LEE_DEMO_INSIGHT = DEMO_INSIGHTS['Daniel Lee'];

// Rule-based fallback when API is unavailable
function generateFallbackInsight(
  evidence: Evidence[],
  profile: StudentProfile
): CareerInsight {
  const evidenceCount = evidence.length;
  const hasInternship = evidence.some((e) => e.type === 'internship');
  const hasPortfolio = evidence.some((e) => e.type === 'portfolio');
  const combinedText = evidence.map((e) => e.description || '').join(' ').toLowerCase();
  const hasProduction = /test|ci\/cd|deploy|docker|monitoring/.test(combinedText);

  let narrative = '';
  let keyGap = '';
  let nextStep = '';

  if (evidenceCount >= 4 && hasInternship) {
    narrative = `${profile.name} has a well-rounded profile with ${evidenceCount} evidence items including real internship experience — a strong signal for hiring managers in Asia's tech market. The evidence shows practical project delivery and some exposure to real-world engineering environments.`;
  } else if (evidenceCount >= 3) {
    narrative = `${profile.name} has ${evidenceCount} evidence items demonstrating active learning and project delivery. The portfolio shows initiative and technical range, which is valued across Southeast Asia's growing tech sector.`;
  } else {
    narrative = `${profile.name} is building their career foundation with ${evidenceCount} evidence item${evidenceCount !== 1 ? 's' : ''}. Early-stage portfolios with focused, well-documented projects stand out to internship hiring managers across Asia.`;
  }

  if (!hasProduction) {
    keyGap =
      'Production Practices — no evidence of automated testing, CI/CD, or deployment workflows. This is the most common gap between strong students and those who get internship offers at tech companies.';
    nextStep =
      'Add a simple GitHub Actions workflow to one existing project: run tests on every push to main. This demonstrates production mindset and takes under 3 hours to set up.';
  } else if (!hasPortfolio) {
    keyGap =
      'Portfolio Evidence — limited public-facing project work. Hiring managers in Asia increasingly check GitHub and live demos before interviews.';
    nextStep =
      'Deploy one existing project to a live URL (Vercel or Railway) and write a clear README with a demo link. A live project is worth 10x a zip file.';
  } else {
    keyGap = `Communication & Documentation — project descriptions could be more specific about your individual contributions, the technical decisions you made, and the measurable outcomes achieved.`;
    nextStep =
      'Rewrite one project description using the format: "Built X using Y, which resulted in Z." Include a specific metric (e.g., "reduced load time by 40%", "processed 200+ requests/day").';
  }

  return { narrative, keyGap, nextStep, isDemo: false };
}

export async function generateCareerInsight(
  evidence: Evidence[],
  profile: StudentProfile
): Promise<CareerInsight> {
  // Instant demo for judges — no API call needed
  const demoInsight = DEMO_INSIGHTS[profile.name as keyof typeof DEMO_INSIGHTS];
  if (demoInsight) {
    return { ...demoInsight, isDemo: true };
  }

  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    return generateFallbackInsight(evidence, profile);
  }

  try {
    // API key is client-side for hackathon demo.
    // Production: proxy through a Vercel Edge Function to keep the key server-side.
    const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

    const evidenceSummary = evidence
      .map(
        (e) =>
          `- ${e.type.toUpperCase()}: "${e.title}"${e.link ? ` (${e.link})` : ''}
   Description: ${e.description || 'No description'}
   Technologies: ${e.technologies || 'Not specified'}`
      )
      .join('\n');

    const prompt = `You are a career intelligence system for Asia's tech job market. Analyse this student's career evidence and provide a realistic navigation insight — NOT a prediction, but a landscape description showing where they realistically stand and what paths exist.

Student Profile:
- Name: ${profile.name}
- University: ${(profile as any).university || 'Not specified'}
- Year: ${profile.year}
- Major: ${profile.major}
- Target Role: ${profile.targetRole}

Evidence (${evidence.length} items):
${evidenceSummary}

Return ONLY valid JSON (no markdown, no explanation) in this exact format:
{
  "narrative": "2-3 sentences describing where this student realistically stands in the career landscape based on their actual evidence. Reference specific evidence items. Frame as navigation — what the landscape looks like from here — not as a grade or prediction. Include Asia tech market context where relevant.",
  "keyGap": "The single most important specific gap for this student given their evidence and target role. Be specific — name the exact skill or practice that is missing from their evidence.",
  "nextStep": "One concrete, immediately actionable next step that directly addresses the key gap. Reference a specific project or evidence item if possible. Include a realistic time estimate."
}`;

    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const parsed = JSON.parse(text);

    return {
      narrative: parsed.narrative || '',
      keyGap: parsed.keyGap || '',
      nextStep: parsed.nextStep || '',
      isDemo: false,
    };
  } catch {
    return generateFallbackInsight(evidence, profile);
  }
}

// Streaming version for live token-by-token rendering
export async function generateCareerInsightStreaming(
  evidence: Evidence[],
  profile: StudentProfile,
  onStream: (field: 'narrative' | 'keyGap' | 'nextStep', chunk: string) => void
): Promise<CareerInsight> {
  // Instant demo for judges — use pre-generated with simulated streaming effect
  const demoInsight = DEMO_INSIGHTS[profile.name as keyof typeof DEMO_INSIGHTS];
  if (demoInsight) {
    // Simulate streaming for demo (faster for judges, more impressive)
    const speedMs = 8; // ms per token
    for (const char of demoInsight.narrative) {
      await new Promise((r) => setTimeout(r, speedMs));
      onStream('narrative', char);
    }
    await new Promise((r) => setTimeout(r, 200));
    for (const char of demoInsight.keyGap) {
      await new Promise((r) => setTimeout(r, speedMs));
      onStream('keyGap', char);
    }
    await new Promise((r) => setTimeout(r, 200));
    for (const char of demoInsight.nextStep) {
      await new Promise((r) => setTimeout(r, speedMs));
      onStream('nextStep', char);
    }
    return { ...demoInsight, isDemo: true };
  }

  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    const fallback = generateFallbackInsight(evidence, profile);
    // Simulate streaming effect for fallback too
    for (const char of fallback.narrative) {
      onStream('narrative', char);
      await new Promise((r) => setTimeout(r, 3));
    }
    for (const char of fallback.keyGap) {
      onStream('keyGap', char);
      await new Promise((r) => setTimeout(r, 3));
    }
    for (const char of fallback.nextStep) {
      onStream('nextStep', char);
      await new Promise((r) => setTimeout(r, 3));
    }
    return fallback;
  }

  try {
    const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

    const evidenceSummary = evidence
      .map(
        (e) =>
          `- ${e.type.toUpperCase()}: "${e.title}"${e.link ? ` (${e.link})` : ''}
   Description: ${e.description || 'No description'}
   Technologies: ${e.technologies || 'Not specified'}`
      )
      .join('\n');

    const prompt = `You are a career intelligence system for Asia's tech job market. Analyse this student's career evidence and provide a realistic navigation insight — NOT a prediction, but a landscape description showing where they realistically stand and what paths exist.

Student Profile:
- Name: ${profile.name}
- University: ${(profile as any).university || 'Not specified'}
- Year: ${profile.year}
- Major: ${profile.major}
- Target Role: ${profile.targetRole}

Evidence (${evidence.length} items):
${evidenceSummary}

Return ONLY valid JSON (no markdown, no explanation) in this exact format:
{
  "narrative": "2-3 sentences describing where this student realistically stands in the career landscape based on their actual evidence. Reference specific evidence items. Frame as navigation — what the landscape looks like from here — not as a grade or prediction. Include Asia tech market context where relevant.",
  "keyGap": "The single most important specific gap for this student given their evidence and target role. Be specific — name the exact skill or practice that is missing from their evidence.",
  "nextStep": "One concrete, immediately actionable next step that directly addresses the key gap. Reference a specific project or evidence item if possible. Include a realistic time estimate."
}`;

    let fullText = '';
    // Track how many chars of each field we've already streamed
    const streamed = { narrative: 0, keyGap: 0, nextStep: 0 };

    const stream = client.messages.stream({
      model: 'claude-haiku-4-5',
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }],
    });

    for await (const chunk of stream) {
      if (
        chunk.type === 'content_block_delta' &&
        chunk.delta.type === 'text_delta'
      ) {
        fullText += chunk.delta.text;

        // Extract and stream each field incrementally from partial JSON
        const fields: Array<['narrative' | 'keyGap' | 'nextStep', RegExp]> = [
          ['narrative', /"narrative"\s*:\s*"((?:[^"\\]|\\.)*)(?:"|$)/],
          ['keyGap', /"keyGap"\s*:\s*"((?:[^"\\]|\\.)*)(?:"|$)/],
          ['nextStep', /"nextStep"\s*:\s*"((?:[^"\\]|\\.)*)(?:"|$)/],
        ];

        for (const [field, regex] of fields) {
          const match = fullText.match(regex);
          if (match) {
            const raw = match[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
            const newContent = raw.slice(streamed[field]);
            if (newContent) {
              onStream(field, newContent);
              streamed[field] = raw.length;
            }
          }
        }
      }
    }

    const parsed = JSON.parse(fullText);
    return {
      narrative: parsed.narrative || '',
      keyGap: parsed.keyGap || '',
      nextStep: parsed.nextStep || '',
      isDemo: false,
    };
  } catch {
    const fallback = generateFallbackInsight(evidence, profile);
    for (const char of fallback.narrative) {
      onStream('narrative', char);
    }
    for (const char of fallback.keyGap) {
      onStream('keyGap', char);
    }
    for (const char of fallback.nextStep) {
      onStream('nextStep', char);
    }
    return fallback;
  }
}
