import { useQuery } from '@tanstack/react-query';

import type { User } from '@/entities/user/model/user';

import { apiClient } from '@/shared/api/client';

const getGetUserEndpoint = (userId: string) => `users/${userId}`;
export const getGetUserQueryKeyPrefix = (userId: string) => getGetUserEndpoint(userId);

export const getUser = async (userId: string) => {
  const response = await apiClient.get<User>(getGetUserEndpoint(userId));
  return response;
};

export function useGetUser(userId: string) {
  return useQuery({
    queryKey: [getGetUserQueryKeyPrefix(userId)],
    queryFn: () => getUser(userId),
    enabled: !!userId,
  });
}
