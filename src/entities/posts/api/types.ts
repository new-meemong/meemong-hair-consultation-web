// 이미지 업로드 응답
export interface UploadedImage {
  id: number;
  imageURL: string;
}

export interface ImageUploadResponse {
  dataList: UploadedImage[];
  dataCount: number;
}

export type HairConsultPostingErrorCode =
  | 'VALIDATOR_ERROR' // 400: 유효성 검사 오류
  | 'HAIR_CONSULT_POSTINGS_MODEL_ONLY' // 403: 모델만 작성 가능
  | 'HAIR_CONSULT_POSTINGS_NOT_USER' // 403: 작성자가 아님
  | 'HAIR_CONSULT_POSTINGS_NOT_FOUND' // 404: 게시글 없음
  | 'ALREADY_EXISTS_HAIR_CONSULT_POSTING_FAVORITE'; // 409: 이미 좋아요 함
