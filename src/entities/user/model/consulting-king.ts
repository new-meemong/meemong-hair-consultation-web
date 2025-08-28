export type ConsultingKingUser = {
  userId: number;
  name: string;
  profileImageUrl: string;
  companyName: string;
  address: string;
  role: number;
};

export type ConsultingKing = {
  rank: number;
  user: ConsultingKingUser;
};
