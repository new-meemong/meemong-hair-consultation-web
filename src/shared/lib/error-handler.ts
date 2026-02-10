import type { ApiError } from '../api/client';
import type { HTTPError } from 'ky';

export function getApiError(error: unknown): ApiError {
  // HTTPError인 경우 response.data에서 ApiError 추출
  if (error && typeof error === 'object' && 'response' in error) {
    const httpError = error as HTTPError & {
      response?: { data?: { error?: ApiError }; status?: number };
    };
    if (httpError.response?.data?.error) {
      return httpError.response.data.error;
    }
    // response.data가 없지만 status가 있는 경우
    if (httpError.response?.status) {
      return {
        code: 'HTTP_ERROR',
        message: httpError.message || '알 수 없는 오류가 발생했습니다.',
        httpCode: httpError.response.status,
      };
    }
  }

  // ApiError 타입인 경우
  const apiError = error as ApiError;
  if (apiError && typeof apiError === 'object' && 'httpCode' in apiError) {
    return apiError;
  }

  // 기본 에러
  return {
    code: 'UNKNOWN_ERROR',
    message: '알 수 없는 오류가 발생했습니다.',
    httpCode: 500,
  };
}

/**
 * 토큰 만료 관련 에러인지 확인합니다.
 */
export function isTokenExpiredError(error: unknown): boolean {
  const apiError = getApiError(error);

  // 401 에러이거나 메시지에 "token expired" 또는 "만료"가 포함된 경우
  if (apiError.httpCode === 401) {
    return true;
  }

  const message = apiError.message?.toLowerCase() || '';
  return (
    message.includes('token expired') || message.includes('만료') || message.includes('expired')
  );
}

export function getErrorMessage(error: unknown): string {
  const apiError = getApiError(error);

  const fieldErrorReason = apiError?.fieldErrors
    ?.map((fieldError) => fieldError.reason ?? fieldError.message)
    .find((message): message is string => Boolean(message?.trim()));
  if (fieldErrorReason) return fieldErrorReason;

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
