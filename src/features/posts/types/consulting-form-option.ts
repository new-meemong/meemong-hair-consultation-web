import type { ReactNode } from 'react';

export type ConsultingFormOption = {
  label: string | ReactNode;
  value: string;
  additional?: ReactNode;
};
