import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export type FileObjectUrl = {
  file: File;
  url: string;
};

const createFileObjectUrls = (files: File[]) =>
  files.map((file) => ({
    file,
    url: URL.createObjectURL(file),
  }));

const revokeFileObjectUrls = (fileObjectUrls: FileObjectUrl[]) => {
  fileObjectUrls.forEach(({ url }) => URL.revokeObjectURL(url));
};

const areSameFiles = (previousFiles: File[], nextFiles: File[]) =>
  previousFiles.length === nextFiles.length &&
  previousFiles.every((file, index) => file === nextFiles[index]);

export function useFileObjectUrls(files: File[]) {
  const [fileObjectUrls, setFileObjectUrls] = useState<FileObjectUrl[]>(() =>
    createFileObjectUrls(files),
  );
  const filesRef = useRef(files);
  const fileObjectUrlsRef = useRef(fileObjectUrls);

  useLayoutEffect(() => {
    if (areSameFiles(filesRef.current, files)) return;

    const nextFileObjectUrls = createFileObjectUrls(files);

    revokeFileObjectUrls(fileObjectUrlsRef.current);
    filesRef.current = files;
    fileObjectUrlsRef.current = nextFileObjectUrls;
    setFileObjectUrls(nextFileObjectUrls);
  }, [files]);

  useEffect(() => {
    return () => {
      revokeFileObjectUrls(fileObjectUrlsRef.current);
    };
  }, []);

  return fileObjectUrls;
}
