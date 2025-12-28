export type RewardType = 'MONG' | string;

export type Reward = {
  id: number;
  code: string;
  title: string;
  description: string;
  isActive: boolean;
  rewardType: RewardType;
  rewardAmount: number;
  createdAt: string;
  updatedAt: string;
};

