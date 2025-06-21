// 헤어상담 게시글
export interface HairConsultPosting {
  id: number;
  userId: number;
  title: string;
  content: string;
  repImageUrl: string | null;
  isPhotoVisibleToDesigner: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

// 헤어상담 게시글 이미지
export interface HairConsultPostingImage {
  id: number;
  hairConsultPostingId: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

// 이미지 업로드 응답
export interface UploadedImage {
  id: number;
  imageURL: string;
}

export interface ImageUploadResponse {
  dataList: UploadedImage[];
  dataCount: number;
}

// 게시글 작성 요청
export interface CreateHairConsultPostingRequest {
  title: string;
  content: string;
  isPhotoVisibleToDesigner: boolean;
  hairConsultPostingImages?: string[]; // 최대 10개, nullable and optional
}

// 게시글 작성 응답
export interface CreateHairConsultPostingResponse {
  data: {
    newHairConsultPosting: HairConsultPosting;
    hairConsultPostingImageList: HairConsultPostingImage[];
  };
}

export interface HairConsultPostingFavoriteResponse {
  data: {
    id: number; // 좋아요 ID
  };
}

export interface ValidationFieldError {
  field: string;
  value: string;
  reason: string;
}

export interface BaseApiError<TCode = string> {
  error: {
    code: TCode;
    message: string;
    fieldErrors?: ValidationFieldError[];
  };
}

export interface ApiErrorWithHttpCode<TCode = string> {
  error: {
    code: TCode;
    message: string;
    httpCode: number;
    fieldErrors?: ValidationFieldError[];
  };
}

export type ValidationErrorCode = 'VALIDATOR_ERROR';

export type HairConsultPostingErrorCode =
  | 'HAIR_CONSULT_POSTINGS_MODEL_ONLY'
  | 'HAIR_CONSULT_POSTINGS_NOT_USER'
  | 'HAIR_CONSULT_POSTINGS_NOT_FOUND'
  | 'ALREADY_EXISTS_HAIR_CONSULT_POSTING_FAVORITE';

export type ValidationError = BaseApiError<ValidationErrorCode>;

export type HairConsultPostingError = ApiErrorWithHttpCode<HairConsultPostingErrorCode>;

export type ApiError = ValidationError | HairConsultPostingError;

export function isValidationError(error: unknown): error is ValidationError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'error' in error &&
    typeof (error as Record<string, unknown>).error === 'object' &&
    (error as Record<string, unknown>).error !== null &&
    'code' in ((error as Record<string, unknown>).error as Record<string, unknown>) &&
    ((error as Record<string, unknown>).error as Record<string, unknown>).code === 'VALIDATOR_ERROR'
  );
}

export function isHairConsultPostingError(error: unknown): error is HairConsultPostingError {
  if (
    typeof error !== 'object' ||
    error === null ||
    !('error' in error) ||
    typeof (error as Record<string, unknown>).error !== 'object' ||
    (error as Record<string, unknown>).error === null
  ) {
    return false;
  }

  const errorObj = (error as Record<string, unknown>).error as Record<string, unknown>;

  return (
    'httpCode' in errorObj &&
    typeof errorObj.httpCode === 'number' &&
    'code' in errorObj &&
    typeof errorObj.code === 'string' &&
    [
      'HAIR_CONSULT_POSTINGS_MODEL_ONLY',
      'HAIR_CONSULT_POSTINGS_NOT_USER',
      'HAIR_CONSULT_POSTINGS_NOT_FOUND',
      'ALREADY_EXISTS_HAIR_CONSULT_POSTING_FAVORITE',
    ].includes(errorObj.code)
  );
}

export function hasHttpCode(error: unknown): error is ApiErrorWithHttpCode {
  return (
    typeof error === 'object' &&
    error !== null &&
    'error' in error &&
    typeof (error as Record<string, unknown>).error === 'object' &&
    (error as Record<string, unknown>).error !== null &&
    'httpCode' in ((error as Record<string, unknown>).error as Record<string, unknown>) &&
    typeof ((error as Record<string, unknown>).error as Record<string, unknown>).httpCode ===
      'number'
  );
}
