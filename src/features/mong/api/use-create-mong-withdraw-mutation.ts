import type { CreateMongWithdrawRequest } from '@/entities/mong/api/create-mong-withdraw-request';
import type { CreateMongWithdrawResponse } from '@/entities/mong/api/create-mong-withdraw-response';
import { apiClient } from '@/shared/api/client';
import { useMutation } from '@tanstack/react-query';

const CREATE_MONG_WITHDRAW_ENDPOINT = 'mong-moneys/withdraw';

export default function useCreateMongWithdrawMutation() {
  const mutation = useMutation({
    mutationFn: (data: CreateMongWithdrawRequest) =>
      apiClient.post<CreateMongWithdrawResponse>(CREATE_MONG_WITHDRAW_ENDPOINT, data),
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
