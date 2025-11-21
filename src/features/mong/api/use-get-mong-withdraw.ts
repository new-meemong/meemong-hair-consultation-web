import { useQuery } from '@tanstack/react-query';

import type { GetMongWithdrawRequest } from '@/entities/mong/api/get-mong-withdraw-request';
import type { GetMongWithdrawResponse } from '@/entities/mong/api/get-mong-withdraw-response';

import { apiClient } from '@/shared/api/client';

const GET_MONG_WITHDRAW_ENDPOINT = 'mong-moneys/withdraw';
export const getMongWithdrawQueryKeyPrefix = () => GET_MONG_WITHDRAW_ENDPOINT;

export default function useGetMongWithdraw(params: GetMongWithdrawRequest) {
  const { createType, refType, refId } = params;

  return useQuery({
    queryKey: [getMongWithdrawQueryKeyPrefix(), params],
    queryFn: () =>
      apiClient.get<GetMongWithdrawResponse>(GET_MONG_WITHDRAW_ENDPOINT, {
        json: {
          createType,
          refType,
          refId,
        },
      }),
    enabled: !!refId,
  });
}
