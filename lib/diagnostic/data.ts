export type CriterionId =
  | 'mission'
  | 'money'
  | 'work'
  | 'lifestyle'
  | 'relationships'
  | 'emotions'
  | 'attitude'
  | 'hurts'
  | 'health'
  | 'nutrition'
  | 'sport'
  | 'image';

export interface CriterionDefinition {
  id: CriterionId;
  domain: 'mind' | 'soul' | 'body';
  domainLabel: string;
  title: string;
}

export const CRITERIA: CriterionDefinition[] = [
  { id: 'mission', domain: 'mind', domainLabel: 'Mind', title: 'Mission' },
  { id: 'money', domain: 'mind', domainLabel: 'Mind', title: 'Money' },
  { id: 'work', domain: 'mind', domainLabel: 'Mind', title: 'Work' },
  { id: 'lifestyle', domain: 'mind', domainLabel: 'Mind', title: 'Lifestyle' },
  { id: 'relationships', domain: 'soul', domainLabel: 'Soul', title: 'Relationships' },
  { id: 'emotions', domain: 'soul', domainLabel: 'Soul', title: 'Emotions' },
  { id: 'attitude', domain: 'soul', domainLabel: 'Soul', title: 'Attitude' },
  { id: 'hurts', domain: 'soul', domainLabel: 'Soul', title: 'Hurts / Traumas' },
  { id: 'health', domain: 'body', domainLabel: 'Body', title: 'Health' },
  { id: 'nutrition', domain: 'body', domainLabel: 'Body', title: 'Nutrition' },
  { id: 'sport', domain: 'body', domainLabel: 'Body', title: 'Sport' },
  { id: 'image', domain: 'body', domainLabel: 'Body', title: 'Image' }
];

export const QUESTIONS = [
  'Are you satisfied?',
  'Do you know why/what to do?',
  'Will you keep doing it (commit)?'
];
