'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { handleMutationError, getUserErrorMessage, ROUTES } from '@/shared/lib';
import {
  CreateHairConsultPostingRequest,
  CreateHairConsultPostingResponse,
  HairConsultPostingFavoriteResponse,
  ImageUploadResponse,
} from './types';
import { useRouter } from 'next/navigation';

// 헤어상담 게시글 작성
export function useCreateHairConsultPosting() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateHairConsultPostingRequest) =>
      apiClient.post<CreateHairConsultPostingResponse>('hair-consult-postings', data),
    onSuccess: () => {
      // 목록으로 이동
      router.push(ROUTES.POSTS);
      queryClient.invalidateQueries({ queryKey: ['hair-consult-postings'] });
    },
    onError: (error) => {
      handleMutationError(error);
      const friendlyMessage = getUserErrorMessage(error);
      console.warn('사용자 메시지:', friendlyMessage);
    },
  });
}

// 헤어상담 게시글 삭제
export function useDeleteHairConsultPosting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (hairConsultPostingId: number) =>
      apiClient.delete(`hair-consult-postings/${hairConsultPostingId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hair-consult-postings'] });
    },
    onError: (error) => {
      handleMutationError(error);
      const friendlyMessage = getUserErrorMessage(error);
      console.warn('사용자 메시지:', friendlyMessage);
    },
  });
}

// 헤어상담 게시글 좋아요
export function useToggleHairConsultPostingFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      hairConsultPostingId,
      isLiked,
    }: {
      hairConsultPostingId: number;
      isLiked: boolean;
    }) => {
      if (isLiked) {
        // 좋아요 취소
        return apiClient.delete(`hair-consult-postings/${hairConsultPostingId}/favorites`);
      } else {
        // 좋아요 추가
        return apiClient.post<HairConsultPostingFavoriteResponse>(
          `hair-consult-postings/${hairConsultPostingId}/favorites`,
        );
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['hair-consult-posting', variables.hairConsultPostingId],
      });
      queryClient.invalidateQueries({
        queryKey: ['hair-consult-postings'],
      });
    },
    onError: (error) => {
      handleMutationError(error);
      const friendlyMessage = getUserErrorMessage(error);
      console.warn('사용자 메시지:', friendlyMessage);
    },
  });
}

// 헤어상담 게시글 이미지 업로드
export function useUploadHairConsultPostingImages() {
  return useMutation({
    mutationFn: (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });

      return apiClient.postFormData<ImageUploadResponse>(
        'uploads/hair-consult-postings/images',
        formData,
      );
    },
    onError: (error) => {
      handleMutationError(error);
      const friendlyMessage = getUserErrorMessage(error);
      console.warn('사용자 메시지:', friendlyMessage);
    },
  });
}
