import type { GetMongWithdrawRequest } from '@/entities/mong/api/get-mong-withdraw-request';
import type { GetMongWithdrawResponse } from '@/entities/mong/api/get-mong-withdraw-response';
import { apiClient } from '@/shared/api/client';
import { useQuery } from '@tanstack/react-query';

const GET_MONG_WITHDRAW_ENDPOINT = 'mong-moneys/withdraw';
export const getMongWithdrawQueryKeyPrefix = () => GET_MONG_WITHDRAW_ENDPOINT;

export default function useGetMongWithdraw(params: GetMongWithdrawRequest) {
  const isEnabled = 'refId' in params ? !!params.refId : !!params.firestoreRefId;

  return useQuery({
    queryKey: [getMongWithdrawQueryKeyPrefix(), params],
    queryFn: () =>
      apiClient.get<GetMongWithdrawResponse>(GET_MONG_WITHDRAW_ENDPOINT, {
        searchParams: params,
      }),
    enabled: isEnabled,
  });
}
