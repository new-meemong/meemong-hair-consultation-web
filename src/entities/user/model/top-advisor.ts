export type TopAdvisor = {
  id: number;
  profilePictureURL: string;
  userId: number;
  userSocialCode: string;
  updatedAt: string;
  displayName: string;
  lng: number;
  lat: number;
  address: string;
  address2: string;
  companyName: string;
  storelink: string | null;
  createdAt: string;
  user: {
    id: number;
    email: string;
    sex: string;
    isKorean: boolean;
    displayName: string;
    profilePictureURL: string;
    socialCode: string;
    phone: string;
    role: number;
  };
};
