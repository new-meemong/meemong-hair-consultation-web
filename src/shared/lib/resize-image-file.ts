const DEFAULT_OUTPUT_TYPE = 'image/jpeg';
const DEFAULT_QUALITY = 0.9;

const getOutputType = (inputType: string) => {
  if (inputType === 'image/png' || inputType === 'image/webp') return inputType;
  if (inputType.startsWith('image/')) return 'image/jpeg';
  return DEFAULT_OUTPUT_TYPE;
};

const loadImage = (file: File): Promise<HTMLImageElement | ImageBitmap> => {
  if (typeof createImageBitmap === 'function') {
    return createImageBitmap(file);
  }

  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = (error) => {
      URL.revokeObjectURL(url);
      reject(error);
    };

    image.src = url;
  });
};

export const resizeImageFile = async (file: File, maxSize: number): Promise<File> => {
  if (typeof window === 'undefined') return file;
  if (!file.type.startsWith('image/')) return file;

  const image = await loadImage(file);
  const width = 'naturalWidth' in image ? image.naturalWidth : image.width;
  const height = 'naturalHeight' in image ? image.naturalHeight : image.height;
  const maxDimension = Math.max(width, height);

  if (maxDimension <= maxSize) {
    if ('close' in image) {
      image.close();
    }
    return file;
  }

  const scale = maxSize / maxDimension;
  const targetWidth = Math.round(width * scale);
  const targetHeight = Math.round(height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext('2d');
  if (!context) {
    if ('close' in image) {
      image.close();
    }
    return file;
  }

  context.drawImage(image as CanvasImageSource, 0, 0, targetWidth, targetHeight);

  if ('close' in image) {
    image.close();
  }

  const outputType = getOutputType(file.type);
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(
      resolve,
      outputType,
      outputType === 'image/jpeg' || outputType === 'image/webp' ? DEFAULT_QUALITY : undefined,
    );
  });

  if (!blob) return file;

  return new File([blob], file.name, {
    type: blob.type || outputType,
    lastModified: file.lastModified,
  });
};
