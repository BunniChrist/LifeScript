import { CRITERIA } from './data';
import {
  computeCriterionMode,
  aggregateDomain,
  type DiagnosticSummary,
  type CriterionResult
} from '@/src/lib/scoring';

export type AnswersInput = Record<string, [boolean, boolean, boolean]>;

export function buildSummaryFromAnswers(answers: AnswersInput): DiagnosticSummary {
  const criteria: CriterionResult[] = CRITERIA.map((criterion) => {
    const entry = answers[criterion.id] ?? [false, false, false];
    return {
      id: criterion.id,
      domain: criterion.domain,
      title: `${criterion.domainLabel}: ${criterion.title}`,
      answers: entry,
      mode: computeCriterionMode(entry)
    };
  });
  const grouped = criteria.reduce<Record<string, CriterionResult[]>>((acc, result) => {
    acc[result.domain] = acc[result.domain] ?? [];
    acc[result.domain].push(result);
    return acc;
  }, {});
  const domains = Object.values(grouped).map((items) => aggregateDomain(items));
  const score = domains.reduce((acc, domain) => acc + domain.score, 0) / domains.length;
  const mode = score < 1.5 ? 'survival' : score < 2.5 ? 'existential' : 'life';
  return { domains, score, mode };
}
