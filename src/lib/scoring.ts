export type CriterionAnswers = [boolean, boolean, boolean];
export type Mode = 'survival' | 'existential' | 'life';

export interface CriterionResult {
  id: string;
  domain: DomainKey;
  title: string;
  answers: CriterionAnswers;
  mode: Mode;
}

export type DomainKey = 'mind' | 'soul' | 'body';

export interface DomainResult {
  key: DomainKey;
  title: string;
  criteria: CriterionResult[];
  mode: Mode;
  score: number;
}

export interface DiagnosticSummary {
  domains: DomainResult[];
  mode: Mode;
  score: number;
}

export const MODE_LABELS: Record<Mode, { en: string; fr: string }> = {
  survival: { en: 'Survival Mode', fr: 'Survival Mode' },
  existential: { en: 'Existential Mode', fr: 'Existential Mode' },
  life: { en: 'Life Mode', fr: 'Life Mode' }
};

export function computeCriterionMode(answers: CriterionAnswers): Mode {
  const yesCount = answers.filter(Boolean).length;
  if (yesCount <= 1) return 'survival';
  if (yesCount === 2) return 'existential';
  return 'life';
}

export function aggregateDomain(results: CriterionResult[]): DomainResult {
  if (results.length === 0) {
    throw new Error('Domain requires at least one criterion');
  }
  const score = results.reduce((acc, result) => acc + scoreForMode(result.mode), 0);
  const average = score / results.length;
  const mode = modeFromScore(average);
  return {
    key: results[0].domain,
    title: results[0].title.split(':')[0] ?? results[0].title,
    criteria: results,
    mode,
    score: average
  };
}

export function toChartData(summary: DiagnosticSummary) {
  return {
    radar: {
      labels: summary.domains.map((domain) => domain.title),
      datasets: [
        {
          label: 'Mode score',
          data: summary.domains.map((domain) => domain.score),
          backgroundColor: 'rgba(21, 128, 61, 0.3)',
          borderColor: '#15803d'
        }
      ]
    },
    line: {
      labels: summary.domains.map((domain) => domain.title),
      datasets: [
        {
          label: 'Progress',
          data: summary.domains.map((domain) => domain.score),
          fill: false,
          borderColor: '#0f172a'
        }
      ]
    }
  };
}

function scoreForMode(mode: Mode) {
  switch (mode) {
    case 'survival':
      return 1;
    case 'existential':
      return 2;
    case 'life':
      return 3;
  }
}

function modeFromScore(score: number): Mode {
  if (score < 1.5) return 'survival';
  if (score < 2.5) return 'existential';
  return 'life';
}
