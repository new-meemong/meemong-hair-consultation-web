export type CreateMongWithdrawResponse = {
  id: number;
  title: string;
  type: string;
  subType: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  isPaidThisTime: boolean;
};
