import type { ReactNode } from 'react';

export type ConsultingPostFormOption = {
  name: string;
  label: string | ReactNode;
  value: string;
  additional?: ReactNode;
};
