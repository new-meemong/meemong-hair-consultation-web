const PRODUCTION_HAIR_CONSULTATION_WEB_ORIGIN = 'https://meemong-hair-consultation-web.vercel.app';
const TEST_HAIR_CONSULTATION_WEB_ORIGIN = 'https://meemong-hair-consultation-web-test.vercel.app';

function isProductionApi(apiUrl: string | undefined): boolean {
  return apiUrl?.replace(/\/+$/, '') === 'https://api.meemong.com';
}

export function buildHairConsultationMessageLink(
  currentUrl: string,
  apiUrl: string | undefined = process.env.NEXT_PUBLIC_API_URL,
): string {
  const current = new URL(currentUrl);
  const canonicalOrigin = isProductionApi(apiUrl)
    ? PRODUCTION_HAIR_CONSULTATION_WEB_ORIGIN
    : TEST_HAIR_CONSULTATION_WEB_ORIGIN;

  return `${canonicalOrigin}${current.pathname}${current.hash}`;
}
