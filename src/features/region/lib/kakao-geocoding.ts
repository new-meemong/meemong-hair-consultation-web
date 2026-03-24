export const KAKAO_CITY_NORMALIZE: Record<string, string> = {
  서울특별시: '서울',
  부산광역시: '부산',
  인천광역시: '인천',
  대구광역시: '대구',
  광주광역시: '광주',
  대전광역시: '대전',
  울산광역시: '울산',
  세종특별자치시: '세종시',
  제주특별자치도: '제주도',
  강원특별자치도: '강원도',
  강원도: '강원도',
  충청북도: '충청북도',
  충청남도: '충청남도',
  경상북도: '경상북도',
  경상남도: '경상남도',
  전북특별자치도: '전라북도',
  전라남도: '전라남도',
  경기도: '경기도',
};

export type RegionResult = { key: string; value: string };

export async function reverseGeocodeToRegion(
  lat: number,
  lng: number,
): Promise<RegionResult | null> {
  try {
    const res = await fetch(`/api/region/reverse-geocode?lat=${lat}&lng=${lng}`);
    const data = await res.json();
    console.log('[geocode] raw data:', data);
    const region = data.documents?.find((d: { region_type: string }) => d.region_type === 'H');
    console.log('[geocode] region:', region);
    if (!region) return null;

    const key = KAKAO_CITY_NORMALIZE[region.region_1depth_name] ?? region.region_1depth_name;
    const value = region.region_2depth_name;
    if (!key || !value) return null;

    return { key, value };
  } catch {
    return null;
  }
}

export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 10000,
      maximumAge: 30000,
    });
  });
}
