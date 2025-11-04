export type CreateExperienceGroupResponse = {
  data: {
    id: number;
    userId: number;
    priceType: string;
    title: string;
    content: string;
    price: number;
    viewCount: number;
    commentCount: number;
    likeCount: number;
    createdAt: string;
    updatedAt: string;
    snsTypes: {
      id: number;
      snsType: string;
      url: string;
    }[];
  };
};
