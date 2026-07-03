import { IMAGE_TYPE } from '../constants/image-type';
import type { FileObjectUrl } from '../hooks/use-file-object-urls';
import type { Image } from '../ui/image-form-item';

export function getImages(fileObjectUrls: FileObjectUrl[], imageUrls: string[]): Image[] {
  const convertedImageFiles = fileObjectUrls.map(({ file, url }) => ({
    type: IMAGE_TYPE.FILE,
    name: file.name,
    src: url,
  }));

  const convertedImageUrls = imageUrls.map((url) => ({
    type: IMAGE_TYPE.URL,
    name: url,
    src: url,
  }));

  return [...convertedImageUrls, ...convertedImageFiles];
}
