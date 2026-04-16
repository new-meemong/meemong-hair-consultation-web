import { createWebApiClient } from '@/shared/lib/web-api';

type ModelProfile = {
  isBreakTime?: boolean;
  breakTime?: {
    status?: boolean;
  } | null;
};

function isModelOnBreak(profile: ModelProfile): boolean {
  return profile.isBreakTime === true || profile.breakTime?.status === true;
}

export async function getModelBreakStatus(token: string, slug?: string): Promise<boolean> {
  const api = createWebApiClient(token, slug);
  const profile = await api.get<ModelProfile>('models/me/my-page');
  return isModelOnBreak(profile);
}

export async function releaseModelBreakStatus(token: string, slug?: string): Promise<void> {
  const api = createWebApiClient(token, slug);
  await api.patch('models/me/break-times', { isBreakTime: false });
}
