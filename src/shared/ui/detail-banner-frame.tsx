import type { ReactNode } from 'react';

type DetailBannerFrameProps = {
  children: ReactNode;
};

export default function DetailBannerFrame({ children }: DetailBannerFrameProps) {
  return (
    <>
      <div className="w-full h-1.5 bg-alternative" />
      <div className="py-3">{children}</div>
    </>
  );
}
