import { useMutation } from '@tanstack/react-query';

import { type ImageUploadResponse, type UploadedImage } from '@/entities/posts';
import { apiClient } from '@/shared/api/client';

const STORAGE_HOST = 'https://job-storage.meemong.com';
const PRESIGNED_UPLOAD_ENDPOINTS = [
  'uploads/images/presigned-url',
  'uploads/images/s1024/presigned-url',
] as const;

type PresignedUploadData = {
  url: string;
  fields: Record<string, string>;
};

type PresignedUploadResponse = {
  data: {
    uploadData: PresignedUploadData;
    uploadUrlList: string[];
    requestMethod: string;
  };
};

const getPresignedUploadResponse = async (filename: string): Promise<PresignedUploadResponse> => {
  let lastError: unknown;

  for (const endpoint of PRESIGNED_UPLOAD_ENDPOINTS) {
    try {
      return await apiClient.get<PresignedUploadResponse['data']>(endpoint, {
        searchParams: { filename },
      });
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error('Failed to issue presigned upload URL');
};

const uploadSingleImage = async (file: File): Promise<UploadedImage> => {
  const presignedResponse = await getPresignedUploadResponse(file.name);

  const { uploadData, requestMethod } = presignedResponse.data;
  const formData = new FormData();

  Object.entries(uploadData.fields).forEach(([key, value]) => {
    formData.append(key, value);
  });
  formData.append('file', file);

  const uploadResponse = await fetch(uploadData.url, {
    method: requestMethod,
    body: formData,
  });

  if (!uploadResponse.ok) {
    throw new Error(`Failed to upload image: ${uploadResponse.status}`);
  }

  const key = uploadData.fields.key;
  return {
    id: 0,
    imageURL: `${STORAGE_HOST}/${key}`,
  };
};

export default function useUploadPostImageMutation() {
  return useMutation({
    mutationFn: async (files: File[]): Promise<ImageUploadResponse> => {
      const dataList = await Promise.all(files.map((file) => uploadSingleImage(file)));

      return {
        dataList,
        dataCount: dataList.length,
      };
    },
  });
}
