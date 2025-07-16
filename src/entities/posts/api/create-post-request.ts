export type CreatePostRequest = {
  title: string;
  content: string;
  isPhotoVisibleToDesigner: boolean;
  hairConsultPostingImages?: string[]; // 최대 10개, nullable and optional
};
