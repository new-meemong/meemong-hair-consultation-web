import type { ReactNode } from 'react';

import type { Option } from '@/shared/type/option';

export type ConsultingFormOption = Option<string> & {
  additional?: ReactNode;
};
