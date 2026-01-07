export type GetMongCurrentResponse = {
  id: number;
  userId: number;
  createdAt: string;
  amount: number;
  currentAmount: number;
  depositSum: number;
  withdrawSum: number;
  currentTotalAmount: number;
  depositTotalSum: number;
  withdrawTotalSum: number;
  type: string;
  mongType: 'default' | 'event';
  title: string;
};
