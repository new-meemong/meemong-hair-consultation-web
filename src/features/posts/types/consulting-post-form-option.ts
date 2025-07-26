import type { ReactNode } from 'react';

export type ConsultingPostFormOption = {
  label: string | ReactNode;
  value: string;
  additional?: ReactNode;
};
