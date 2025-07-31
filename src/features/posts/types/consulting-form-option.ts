import type { Option } from '@/shared/type/option';
import type { ReactNode } from 'react';

export type ConsultingFormOption = Option<string | ReactNode> & {
  additional?: ReactNode;
};
