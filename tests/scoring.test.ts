import { describe, expect, it } from 'vitest';
import {
  computeCriterionMode,
  aggregateDomain,
  toChartData,
  type CriterionResult,
  type DiagnosticSummary
} from '@/src/lib/scoring';

describe('computeCriterionMode', () => {
  it('returns survival with 0 yes', () => {
    expect(computeCriterionMode([false, false, false])).toBe('survival');
  });

  it('returns survival with 1 yes', () => {
    expect(computeCriterionMode([true, false, false])).toBe('survival');
  });

  it('returns existential with 2 yes', () => {
    expect(computeCriterionMode([true, true, false])).toBe('existential');
  });

  it('returns life with 3 yes', () => {
    expect(computeCriterionMode([true, true, true])).toBe('life');
  });
});

describe('aggregateDomain', () => {
  const sample: CriterionResult[] = [
    {
      id: 'mission',
      domain: 'mind',
      title: 'Mind: Mission',
      answers: [true, true, true],
      mode: 'life'
    },
    {
      id: 'money',
      domain: 'mind',
      title: 'Mind: Money',
      answers: [true, false, false],
      mode: 'survival'
    }
  ];

  it('aggregates score and mode', () => {
    const domain = aggregateDomain(sample);
    expect(domain.mode).toBe('existential');
    expect(domain.score).toBeCloseTo(2);
  });

  it('throws with no criteria', () => {
    expect(() => aggregateDomain([])).toThrow();
  });
});

describe('toChartData', () => {
  const summary: DiagnosticSummary = {
    score: 2,
    mode: 'existential',
    domains: [
      {
        key: 'mind',
        title: 'Mind',
        mode: 'life',
        score: 3,
        criteria: []
      },
      {
        key: 'soul',
        title: 'Soul',
        mode: 'survival',
        score: 1,
        criteria: []
      }
    ]
  };

  it('builds radar and line datasets', () => {
    const data = toChartData(summary);
    expect(data.radar.labels).toEqual(['Mind', 'Soul']);
    expect(data.line.datasets[0].data).toEqual([3, 1]);
  });
});
