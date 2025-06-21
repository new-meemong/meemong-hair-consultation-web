import {
  isValidationError,
  isHairConsultPostingError,
  hasHttpCode,
} from '@/entities/posts/api/types';

export function getErrorMessage(error: unknown): string {
  if (isValidationError(error)) {
    return error.error.message;
  }

  if (isHairConsultPostingError(error)) {
    return error.error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return '알 수 없는 오류가 발생했습니다.';
}

export function getErrorHttpCode(error: unknown): number | null {
  if (hasHttpCode(error)) {
    return error.error.httpCode;
  }

  return null;
}

export function getFieldErrors(error: unknown): Array<{ field: string; message: string }> {
  if (isValidationError(error) && error.error.fieldErrors) {
    return error.error.fieldErrors.map((fieldError) => ({
      field: fieldError.field,
      message: fieldError.reason,
    }));
  }

  if (isHairConsultPostingError(error) && error.error.fieldErrors) {
    return error.error.fieldErrors.map((fieldError) => ({
      field: fieldError.field,
      message: fieldError.reason,
    }));
  }

  return [];
}

export function handleApiError(error: unknown): {
  message: string;
  type: 'validation' | 'business' | 'unknown';
  httpCode?: number;
  fieldErrors?: Array<{ field: string; message: string }>;
} {
  if (isValidationError(error)) {
    return {
      message: getErrorMessage(error),
      type: 'validation',
      fieldErrors: getFieldErrors(error),
    };
  }

  if (isHairConsultPostingError(error)) {
    return {
      message: getErrorMessage(error),
      type: 'business',
      httpCode: getErrorHttpCode(error) || undefined,
      fieldErrors: getFieldErrors(error),
    };
  }

  return {
    message: getErrorMessage(error),
    type: 'unknown',
  };
}

// React Query 에러 처리용
export function handleMutationError(error: unknown): void {
  const errorInfo = handleApiError(error);

  console.error('API 에러:', errorInfo);

  // 에러 타입별로 다른 처리
  switch (errorInfo.type) {
    case 'validation':
      // 유효성 검사 에러 - 필드별 에러 표시
      if (errorInfo.fieldErrors && errorInfo.fieldErrors.length > 0) {
        console.warn('필드 에러:', errorInfo.fieldErrors);
      }
      break;

    case 'business':
      // 비즈니스 로직 에러 - 사용자에게 메시지 표시
      console.warn('비즈니스 에러:', errorInfo.message, errorInfo.httpCode);
      break;

    case 'unknown':
      // 알 수 없는 에러 - 일반적인 에러 메시지
      console.error('알 수 없는 에러:', errorInfo.message);
      break;
  }
}

export function getUserErrorMessage(error: unknown): string {
  if (isHairConsultPostingError(error)) {
    switch (error.error.code) {
      case 'HAIR_CONSULT_POSTINGS_MODEL_ONLY':
        return '모델만 게시글을 작성할 수 있습니다.';
      case 'HAIR_CONSULT_POSTINGS_NOT_USER':
        return '본인의 게시글만 삭제할 수 있습니다.';
      case 'HAIR_CONSULT_POSTINGS_NOT_FOUND':
        return '게시글을 찾을 수 없습니다.';
      case 'ALREADY_EXISTS_HAIR_CONSULT_POSTING_FAVORITE':
        return '이미 좋아요한 게시글입니다.';
      default:
        return error.error.message;
    }
  }

  return getErrorMessage(error);
}
