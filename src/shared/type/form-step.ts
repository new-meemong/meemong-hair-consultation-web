import type { KeyOf } from './types';

export type FormStep<T extends Record<string, unknown>> = {
  name: KeyOf<T>;
  question: string;
  description?: string;
  required: boolean;
  children: React.ReactNode;
};
