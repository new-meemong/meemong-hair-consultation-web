import type { UserDetail } from '@/entities/user/model/user-detail';
import { apiClient } from '@/shared/api/client';
import { useQuery } from '@tanstack/react-query';

const getGetUserEndpoint = (userId: string) => `users/${userId}`;
export const getGetUserQueryKeyPrefix = (userId: string) => getGetUserEndpoint(userId);

export const getUser = async (userId: string) => {
  const response = await apiClient.get<UserDetail>(getGetUserEndpoint(userId));
  return response;
};

export function useGetUser(userId: string) {
  return useQuery({
    queryKey: [getGetUserQueryKeyPrefix(userId)],
    queryFn: () => getUser(userId),
    enabled: !!userId,
  });
}
