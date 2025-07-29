export type GetInfiniteData<T> = {
  pages: T[];
  pageParams: (string | undefined)[];
};
