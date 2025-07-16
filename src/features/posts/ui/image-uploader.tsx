'use client';

import GalleryIcon from '@/assets/icons/gallery.svg';
import { Button } from '@/shared';
import { useRef } from 'react';

interface ImageUploaderProps {
  setImages: (images: File[]) => void;
  validate: (newImageLength?: number) => boolean;
}

function ImageUploader({ setImages, validate }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUploadClick = () => {
    if (!validate()) return;

    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const newFiles = Array.from(e.target.files);

    if (!validate(newFiles.length)) return;

    setImages(newFiles);
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        ref={fileInputRef}
        onChange={handleImageChange}
      />
      <Button type="button" variant="icon" size="iconLg" onClick={handleImageUploadClick}>
        <GalleryIcon />
      </Button>
    </>
  );
}

export default ImageUploader;
