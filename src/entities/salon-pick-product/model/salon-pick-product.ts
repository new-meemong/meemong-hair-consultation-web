export type SalonPickProduct = Record<string, unknown> & {
  id: number;
  productName: string;
  productLinkUrl: string;
  originalPrice: string;
  discountPrice: string;
  chipText?: string | null;
  imageUrl: string;
  isActive?: boolean;
  clickCount?: number;
  bannerImageUrl?: string | null;
  sex?: string;
  hairConcerns?: string[];
  preferredTreatmentTypes?: string[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  _prevIndex?: number;
};
