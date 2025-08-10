import type { ApiError } from '../api/client';

export function getApiError(error: unknown): ApiError {
  const apiError = error as ApiError;
  return (
    apiError ?? {
      code: 'UNKNOWN_ERROR',
      message: '알 수 없는 오류가 발생했습니다.',
      httpCode: 500,
    }
  );
}

export function getErrorMessage(error: unknown): string {
  const apiError = getApiError(error);

  const apiMessage = apiError?.message;
  if (apiMessage) return apiMessage;

  const status = apiError?.httpCode;
  switch (status) {
    case 400:
      return '잘못된 요청입니다.';
    case 401:
      return '로그인이 필요합니다.';
    case 403:
      return '권한이 없습니다.';
    case 404:
      return '요청한 정보를 찾을 수 없습니다.';
    case 409:
      return '이미 처리된 요청입니다.';
    case 500:
      return '서버 오류가 발생했습니다.';
    default:
      return '알 수 없는 오류가 발생했습니다.';
  }
}
