import { type StaticImageData } from 'next/image';
import { z } from 'zod';

import { StepIdSchema } from '@/shared/constants/consultation-steps';

export const BrandConfigSchema = z.object({
  slug: z.string(),
  name: z.string(),
  displayName: z.string(), // 웰컴 페이지 등 UI에 노출되는 브랜드명
  brandCode: z.string().nullable(), // null = meemong (ALL 타입), 그 외 브랜드는 대문자 6자리 코드
  logo: z.object({
    // StaticImageData 최소 shape 검증 — z.custom() 단독 사용 시 어떤 값도 통과하는 문제 방지
    src: z.custom<StaticImageData>(
      (val) =>
        typeof val === 'object' && val !== null && typeof (val as StaticImageData).src === 'string',
      { message: 'logo.src는 StaticImageData 형식이어야 합니다' },
    ),
    width: z.number(),
    height: z.number(),
  }),
  smallLogo: z.object({
    src: z.custom<StaticImageData>(
      (val) =>
        typeof val === 'object' && val !== null && typeof (val as StaticImageData).src === 'string',
      { message: 'smallLogo.src는 StaticImageData 형식이어야 합니다' },
    ),
  }),
  theme: z.object({
    colorCautionary: z.string().optional(),
  }),
  // .min(1): 빈 배열로 전체 step을 숨기는 의도하지 않은 사용 방지
  // .refine: 중복 stepId 방지 (동일 step 두 번 → 라우팅 오류)
  consultationFlowOverride: z
    .array(StepIdSchema)
    .min(1, 'consultationFlowOverride는 최소 1개 이상이어야 합니다')
    .refine(
      (steps) => new Set(steps).size === steps.length,
      'consultationFlowOverride에 중복된 stepId가 있습니다',
    )
    .optional(),
  features: z.object({
    chat: z.boolean(),
    mong: z.boolean(),
    growthPass: z.boolean(),
  }),
});

export type BrandConfig = z.infer<typeof BrandConfigSchema>;
