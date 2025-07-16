type NewHairConsultPosting = {
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
};

type HairConsultPostingImage = {
  id: number;
  hairConsultPostingId: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type CreatePostResponse = {
  data: {
    newHairConsultPosting: NewHairConsultPosting;
    hairConsultPostingImageList: HairConsultPostingImage[];
  };
};
