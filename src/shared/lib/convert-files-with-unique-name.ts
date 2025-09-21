import { v4 as uuidv4 } from 'uuid';

export default function convertFilesWithUniqueName(files: File[]): File[] {
  return files.map((file) => {
    const uuid = uuidv4();
    const extension = file.name.split('.').pop();
    const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, '');
    const newFileName = `${nameWithoutExtension}_${uuid}.${extension}`;

    return new File([file], newFileName, { type: file.type });
  });
}
