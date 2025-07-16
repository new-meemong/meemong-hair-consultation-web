'use client';

import { Button } from '@/shared';
import GalleryIcon from '@/assets/icons/gallery.svg';
import { useRef } from 'react';
import { CREATE_POST_FORM_MAX_COUNT } from '../constants/create-post-form';
import useShowImageUploadLimitSheet from '../hooks/use-show-image-upload-limit-sheet';

interface ImageUploaderProps {
  images: File[];
  setImages: (images: File[]) => void;
}

function ImageUploader({ images, setImages }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const showImageUploadLimitSheet = useShowImageUploadLimitSheet();

  const validateImageCount = (count: number) => {
    if (count >= CREATE_POST_FORM_MAX_COUNT.IMAGE) {
      showImageUploadLimitSheet();
      return false;
    }
    return true;
  };

  const handleImageUploadClick = () => {
    if (!validateImageCount(images.length)) return;

    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    if (!validateImageCount(images.length + e.target.files.length - 1)) return;

    const newFiles = Array.from(e.target.files);
    const updatedImages = [...images, ...newFiles];
    setImages(updatedImages);
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
