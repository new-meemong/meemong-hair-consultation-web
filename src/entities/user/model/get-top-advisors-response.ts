import type { TopAdvisor } from './top-advisor';

export type GetTopAdvisorsResponse = {
  designer: TopAdvisor;
  userId: number;
  designerId: number;
  rank: number;
  score: number;
};
