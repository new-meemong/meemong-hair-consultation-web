'use client';

import { useRef, type ReactNode, forwardRef, useImperativeHandle } from 'react';

import convertFilesWithUniqueName from '../lib/convert-files-with-unique-name';

type ImageUploaderProps = {
  setImages: ((images: File[]) => void) | ((image: File) => void);
  validate?: (newImageLength?: number) => boolean;
  children?: ReactNode;
  multiple?: boolean;
};

export type ImageUploaderRef = {
  triggerFileSelect: () => void;
};

const ImageUploader = forwardRef<ImageUploaderRef, ImageUploaderProps>(
  ({ setImages, validate = () => true, children, multiple = true }, ref) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const triggerFileSelect = () => {
      if (!validate()) return;
      fileInputRef.current?.click();
    };

    useImperativeHandle(ref, () => ({
      triggerFileSelect,
    }));

    const handleImageUploadClick = () => {
      if (!validate()) return;

      fileInputRef.current?.click();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) return;

      const newFiles = Array.from(e.target.files);
      const newFilesWithUniqueName = convertFilesWithUniqueName(newFiles);

      if (!validate(newFiles.length)) return;

      if (multiple) {
        (setImages as (images: File[]) => void)(newFilesWithUniqueName);
      } else {
        (setImages as (image: File) => void)(newFilesWithUniqueName[0]);
      }

      e.target.value = '';
    };

    return (
      <>
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
          lang="ko"
        />
        {children && (
          <div className="cursor-pointer" onClick={handleImageUploadClick}>
            {children}
          </div>
        )}
      </>
    );
  },
);

ImageUploader.displayName = 'ImageUploader';

export default ImageUploader;
