export const Pretendard = {
  thin: 'font-thin',
  extraLight: 'font-extralight',
  light: 'font-light',
  regular: 'font-normal',
  medium: 'font-medium',
  semiBold: 'font-semibold',
  bold: 'font-bold',
  extraBold: 'font-extrabold',
  black: 'font-black',
} as const;

export const AppTypography = {
  // Display / Title
  display1Bold: 'typo-title-large-bold',
  display1Medium: 'typo-title-large-medium',

  title1Bold: 'typo-title-1-bold',
  title1Medium: 'typo-title-1-medium',

  title2SemiBold: 'typo-title-2-semibold',
  title2Medium: 'typo-title-2-medium',

  title3Bold: 'typo-title-3-bold',
  title3SemiBold: 'typo-title-3-semibold',
  title3Medium: 'typo-title-3-medium',

  // Headline (18px)
  headlineBold: 'typo-headline-bold',
  headlineSemiBold: 'typo-headline-semibold',
  headlineMedium: 'typo-headline-medium',
  headlineRegular: 'typo-headline-regular',

  // Body 1 (16px)
  body1SemiBold: 'typo-body-1-semibold',
  body1Medium: 'typo-body-1-medium',
  body1Regular: 'typo-body-1-regular',

  // Body 1 - long (16px, 150%)
  body1LongSemiBold: 'typo-body-1-long-semibold',
  body1LongMedium: 'typo-body-1-long-medium',
  body1LongRegular: 'typo-body-1-long-regular',

  // Body 2 (15px)
  body2SemiBold: 'typo-body-2-semibold',
  body2Medium: 'typo-body-2-medium',
  body2Regular: 'typo-body-2-regular',

  // Body 2 - long (15px, 150%)
  body2LongSemiBold: 'typo-body-2-long-semibold',
  body2LongMedium: 'typo-body-2-long-medium',
  body2LongRegular: 'typo-body-2-long-regular',

  // Body 3 (13px)
  body3SemiBold: 'typo-body-3-semibold',
  body3Medium: 'typo-body-3-medium',
  body3Regular: 'typo-body-3-regular',

  // Caption 1 (12px)
  caption1SemiBold: 'typo-caption-1-semibold',
  caption1Medium: 'typo-caption-1-medium',
  caption1Regular: 'typo-caption-1-regular',

  // Caption 2 (11px)
  caption2SemiBold: 'typo-caption-2-semibold',
  caption2Medium: 'typo-caption-2-medium',
  caption2Regular: 'typo-caption-2-regular',
} as const;

export type AppTypographyKey = keyof typeof AppTypography;
