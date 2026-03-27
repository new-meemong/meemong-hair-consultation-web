import type { GetTopAdvisorsResponse } from '@/entities/user/model/get-top-advisors-response';
import { HAIR_CONSULTATION_API_PREFIX } from '@/features/posts/constants/api';
import { apiClient } from '@/shared/api/client';
import { useOptionalBrand } from '@/shared/context/brand-context';
import { useQuery } from '@tanstack/react-query';

const GET_TOP_ADVISORS_ENDPOINT = `${HAIR_CONSULTATION_API_PREFIX}/top-advisors`;
export const getTopAdvisorsQueryKeyPrefix = () => GET_TOP_ADVISORS_ENDPOINT;

export default function useGetTopAdvisors() {
  const brand = useOptionalBrand();

  return useQuery({
    queryKey: [getTopAdvisorsQueryKeyPrefix()],
    queryFn: () => apiClient.getList<GetTopAdvisorsResponse>(GET_TOP_ADVISORS_ENDPOINT),
    enabled: !brand,
  });
}
