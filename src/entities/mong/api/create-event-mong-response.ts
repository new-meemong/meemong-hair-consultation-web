export type CreateEventMongResponse = {
  id: number;
  userId: number;
  createdAt: string;
  amount: number;
  depositSum: number;
  withdrawSum: number;
  depositTotalSum: number;
  withdrawTotalSum: number;
  type: string;
  title: string;
} | null;