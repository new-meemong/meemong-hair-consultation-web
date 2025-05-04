'use client';

import { FC } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { Eye, Heart, MessageCircle } from 'lucide-react';

interface FeedItemProps {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  imageUrl?: string;
  createdAt: string;
  views: number;
  likes: number;
  comments: number;
  location?: string;
}

export const FeedItem: FC<FeedItemProps> = ({
  author,
  content,
  imageUrl,
  createdAt,
  views,
  likes,
  comments,
  location,
}) => {
  return (
    <div className="border-b border-gray-200 pb-6 w-full">
      <div className="flex items-center gap-2 mb-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={author.avatar} />
          <AvatarFallback>{author.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-gray-900">{author.name}</p>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500">{createdAt}</p>
            {location && (
              <>
                <span className="text-gray-500">•</span>
                <p className="text-sm text-gray-500">{location}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <p className="text-gray-800 mb-3">{content}</p>

      {imageUrl && (
        <div className="relative aspect-video w-full mb-3 rounded-lg overflow-hidden">
          <Image
            src={imageUrl}
            alt="피드 이미지"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}

      <div className="flex items-center gap-4 mt-2">
        <Button variant="default" size="sm" className="flex gap-1 items-center text-gray-500">
          <Eye size={18} />
          <span>{views}</span>
        </Button>
        <Button variant="default" size="sm" className="flex gap-1 items-center text-gray-500">
          <Heart size={18} />
          <span>{likes}</span>
        </Button>
        <Button variant="default" size="sm" className="flex gap-1 items-center text-gray-500">
          <MessageCircle size={18} />
          <span>{comments}</span>
        </Button>
      </div>
    </div>
  );
};
