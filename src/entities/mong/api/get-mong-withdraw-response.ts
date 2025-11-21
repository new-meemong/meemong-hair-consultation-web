export type GetMongWithdrawResponse = {
  id: number;
  userId: number;
  createdAt: string;
  amount: number;
  currentAmount: number;
  depositSum: number;
  withdrawSum: number;
  depositTotalSum: number;
  withdrawTotalSum: number;
  currentTotalAmount: number;
  type: string;
  mongType: string;
  title: string;
  referTargetType: string;
  referTargetId: number;
} | null;
