import type { KeyOf } from './types';

export type FormStep<T extends Record<string, unknown>> = {
  name: KeyOf<T> | Array<KeyOf<T>>;
  question?: string;
  description?: string | React.ReactNode;
  required: boolean;
  children: React.ReactNode;
  containerClassName?: string;
  questionClassName?: string;
  descriptionClassName?: string;
  hideRequired?: boolean;
};
