export type GetMongWithdrawResponse = {
  id: number;
  title: string;
  type: string;
  subType: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  isPaid: boolean; // 결제 true, 미결제 false
  currentTotalAmount?: number; // 몽 잔여량 (옵션)
} | null;
