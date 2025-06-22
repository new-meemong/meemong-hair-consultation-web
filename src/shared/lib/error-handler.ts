interface HttpError {
  response?: {
    status: number;
    data?: ApiErrorResponse;
  };
  status?: number;
  code?: string;
}

export interface ValidationFieldError {
  field: string;
  value: string;
  reason: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    httpCode?: number;
    fieldErrors?: ValidationFieldError[];
  };
}

export function getErrorMessage(error: unknown): string {
  const httpError = error as HttpError;

  const apiMessage = httpError?.response?.data?.error?.message;
  if (apiMessage) return apiMessage;

  // 백엔드 메시지 없을 경우
  const status = httpError?.response?.status || httpError?.status;
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

export function getFieldErrors(error: unknown): ValidationFieldError[] {
  const httpError = error as HttpError;
  return httpError?.response?.data?.error?.fieldErrors || [];
}
