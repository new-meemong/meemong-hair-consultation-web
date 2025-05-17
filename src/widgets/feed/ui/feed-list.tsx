'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { type Feed } from '@/entities/feed';
import { FeedItem } from './feed-item';

interface FeedListProps {
  feeds: Feed[];
  isLoading?: boolean;
}

export const FeedList: FC<FeedListProps> = ({ feeds, isLoading = false }) => {
  const router = useRouter();

  const handleFeedClick = (feedId: string) => {
    router.push(`/feed/${feedId}`);
  };

  if (feeds.length === 0) {
    return (
      <div className="w-full flex justify-center py-12">
        <p className="text-gray-500">게시물이 없습니다.</p>
      </div>
    );
  }

  return (
    <div
      className={`[&>*:last-child]:border-b-0 ${isLoading ? 'opacity-70 transition-opacity duration-300' : ''}`}
    >
      {feeds.map((feed) => (
        <FeedItem
          key={feed.id}
          id={feed.id}
          author={feed.author}
          title={feed.title}
          content={feed.content}
          imageUrl={feed.imageUrl}
          createdAt={feed.createdAt}
          views={feed.views}
          likes={feed.likes}
          comments={feed.comments}
          onClick={() => handleFeedClick(feed.id)}
        />
      ))}
    </div>
  );
};
