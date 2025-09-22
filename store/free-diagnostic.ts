'use client';

import { create } from 'zustand';
import { CRITERIA, type CriterionId } from '@/lib/diagnostic/data';
import { computeCriterionMode, type CriterionAnswers } from '@/src/lib/scoring';

type AnswersState = Record<CriterionId, CriterionAnswers>;

function createInitialState(): AnswersState {
  return CRITERIA.reduce((acc, criterion) => {
    acc[criterion.id] = [false, false, false];
    return acc;
  }, {} as AnswersState);
}

interface DiagnosticState {
  answers: AnswersState;
  setAnswer: (id: CriterionId, index: number, value: boolean) => void;
  reset: () => void;
}

export const useFreeDiagnostic = create<DiagnosticState>()((set) => ({
  answers: createInitialState(),
  setAnswer: (id, index, value) =>
    set((state) => {
      const current = state.answers[id];
      const updated: CriterionAnswers = [...current] as CriterionAnswers;
      updated[index] = value;
      return { answers: { ...state.answers, [id]: updated } };
    }),
  reset: () => set({ answers: createInitialState() })
}));

export function computeSummary(answers: AnswersState) {
  return CRITERIA.map((criterion) => ({
    id: criterion.id,
    domain: criterion.domain,
    domainLabel: criterion.domainLabel,
    title: `${criterion.domainLabel}: ${criterion.title}`,
    answers: answers[criterion.id],
    mode: computeCriterionMode(answers[criterion.id])
  }));
}
