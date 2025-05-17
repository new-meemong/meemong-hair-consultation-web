'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { SiteHeader } from '@/widgets/header';
import { Textarea, Input, Checkbox, Label, Separator, Button } from '@/shared/ui';
import { CheckedState } from '@radix-ui/react-checkbox';
import { XIcon } from 'lucide-react';
import GalleryIcon from '@/assets/icons/gallery.svg';

export default function WritePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPrivate, setIsPrivate] = useState<CheckedState>(false);
  const [images, setImages] = useState<string[]>([]);

  // 제출 핸들러
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    // 내용이 비어있으면 제출하지 않음
    if (!title.trim() || !content.trim()) {
      return;
    }

    // 여기에 게시글 제출 로직 추가
    console.log({ title, content, isPrivate, images });
    router.push('/feed'); // 제출 후 피드 페이지로 이동
  };

  // 뒤로가기 핸들러
  const handleBackClick = () => {
    router.back();
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImageUrls = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...newImageUrls]);
    }
  };

  // 이미지 삭제 핸들러
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 등록 버튼 컴포넌트
  const SubmitButton = () => {
    const isValid = title.trim() && content.trim();

    return (
      <button
        onClick={handleSubmit}
        disabled={!isValid}
        className={`typo-body-2-semibold ${isValid ? 'text-positive' : 'text-label-placeholder'}`}
      >
        등록
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader
        title="게시글 작성"
        showBackButton
        onBackClick={handleBackClick}
        rightComponent={<SubmitButton />}
      />

      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        <div className="px-5 pt-6">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full px-0 py-3 typo-title-3-semibold text-label-default placeholder:text-label-placeholder"
          />
          <Separator className="w-full bg-border-default h-0.25" />
        </div>

        <div className="px-5 pt-5 flex-1 flex flex-col">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내 헤어 고민을 자유롭게 작성해보세요"
            className="w-full flex-1 typo-body-1-long-regular resize-none placeholder:text-label-placeholder"
          />
        </div>

        {images.length > 0 && (
          <>
            <Separator className="w-full bg-border-default h-0.25" />
            <div className="pl-5 py-4">
              <div className="flex gap-2 overflow-x-auto">
                {images.map((src, index) => (
                  <div key={index} className="relative w-25 h-25 flex-shrink-0">
                    <Image
                      src={src}
                      alt={`업로드 이미지 ${index + 1}`}
                      fill
                      className="object-cover rounded-md"
                    />
                    <Button
                      variant="icon"
                      size="icon"
                      className="absolute top-1 right-1"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <XIcon />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="mt-auto">
          <Separator className="w-full h-0.25 bg-border-default" />

          <div className="flex items-center px-5 py-3">
            <div className="flex flex-1 items-center">
              <Checkbox id="private" checked={isPrivate} onCheckedChange={setIsPrivate} />
              <Label htmlFor="private" className="ml-2 typo-body-3-regular">
                디자이너에게만 공개할게요
              </Label>
            </div>

            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />

            <Button
              type="button"
              variant="icon"
              size="iconLg"
              onClick={() => fileInputRef.current?.click()}
            >
              <GalleryIcon />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
