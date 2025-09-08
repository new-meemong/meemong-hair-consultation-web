import { IMAGE_TYPE } from '../constants/image-type';
import type { Image } from '../ui/image-form-item';

export function getImages(imageFiles: File[], imageUrls: string[]): Image[] {
  const convertedImageFiles = imageFiles.map((file) => ({
    type: IMAGE_TYPE.FILE,
    name: file.name,
    src: URL.createObjectURL(file),
  }));

  const convertedImageUrls = imageUrls.map((url) => ({
    type: IMAGE_TYPE.URL,
    name: url,
    src: url,
  }));

  return [...convertedImageUrls, ...convertedImageFiles];
}
