import { useMutation } from "@tanstack/react-query";

import type { CreateEventMongRequest } from "@/entities/mong/api/create-event-mong-request";
import type { CreateEventMongResponse } from "@/entities/mong/api/create-event-mong-response";
import { apiClient } from "@/shared/api/client";

export default function useCreateEventMongMutation() {
  const mutation = useMutation({
    mutationFn: (data: CreateEventMongRequest) => apiClient.post<CreateEventMongResponse>('mong-moneys/event-mong', data),
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}