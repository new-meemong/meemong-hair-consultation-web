import { createWebApiClient } from '@/shared/lib/web-api';

export type ModelProfile = {
  isBreakTime?: boolean;
  breakTime?: {
    status?: boolean;
  } | null;
  user?: {
    sex?: '남자' | '여자';
  };
};

export function isModelOnBreak(profile: ModelProfile): boolean {
  return profile.isBreakTime === true || profile.breakTime?.status === true;
}

export async function getModelProfile(token: string, slug?: string): Promise<ModelProfile> {
  const api = createWebApiClient(token, slug);
  return api.get<ModelProfile>('models/me/my-page');
}

export async function getModelBreakStatus(token: string, slug?: string): Promise<boolean> {
  const profile = await getModelProfile(token, slug);
  return isModelOnBreak(profile);
}

export async function releaseModelBreakStatus(token: string, slug?: string): Promise<void> {
  const api = createWebApiClient(token, slug);
  await api.patch('models/me/break-times', { isBreakTime: false });
}
