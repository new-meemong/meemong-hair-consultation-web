import type { ReactNode } from 'react';

export type Option<T> = {
  label: string | ReactNode;
  value: T;
};
