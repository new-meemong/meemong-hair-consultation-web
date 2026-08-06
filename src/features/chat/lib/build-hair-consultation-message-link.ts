const PRODUCTION_HAIR_CONSULTATION_WEB_ORIGIN = 'https://meemong-hair-consultation-web.vercel.app';
const TEST_HAIR_CONSULTATION_WEB_ORIGIN = 'https://meemong-hair-consultation-web-test.vercel.app';

function isProductionApi(apiUrl: string | undefined): boolean {
  return apiUrl?.replace(/\/+$/, '') === 'https://api.meemong.com';
}

function resolveConfiguredWebOrigin(webOrigin: string | undefined): string | null {
  if (!webOrigin) return null;
  try {
    const configuredUrl = new URL(webOrigin);
    if (configuredUrl.protocol !== 'http:' && configuredUrl.protocol !== 'https:') return null;
    return configuredUrl.origin;
  } catch {
    return null;
  }
}

export function buildHairConsultationMessageLink(
  currentUrl: string,
  apiUrl: string | undefined = process.env.NEXT_PUBLIC_API_URL,
  webOrigin: string | undefined = process.env.NEXT_PUBLIC_WEB_ORIGIN,
): string {
  const current = new URL(currentUrl);
  const canonicalOrigin =
    resolveConfiguredWebOrigin(webOrigin) ??
    (isProductionApi(apiUrl)
      ? PRODUCTION_HAIR_CONSULTATION_WEB_ORIGIN
      : TEST_HAIR_CONSULTATION_WEB_ORIGIN);

  return `${canonicalOrigin}${current.pathname}${current.hash}`;
}
