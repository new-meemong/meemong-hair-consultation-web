import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export type FileObjectUrl = {
  file: File;
  url: string;
};

const revokeFileObjectUrls = (fileObjectUrls: FileObjectUrl[]) => {
  fileObjectUrls.forEach(({ url }) => URL.revokeObjectURL(url));
};

const areSameFiles = (previousFiles: File[], nextFiles: File[]) =>
  previousFiles.length === nextFiles.length &&
  previousFiles.every((file, index) => file === nextFiles[index]);

const getNextFileObjectUrls = (
  previousFileObjectUrls: FileObjectUrl[],
  nextFiles: File[],
): FileObjectUrl[] => {
  const previousUrlMap = new Map(previousFileObjectUrls.map(({ file, url }) => [file, url]));

  return nextFiles.map((file) => ({
    file,
    url: previousUrlMap.get(file) ?? URL.createObjectURL(file),
  }));
};

const revokeRemovedFileObjectUrls = (
  previousFileObjectUrls: FileObjectUrl[],
  nextFiles: File[],
) => {
  const nextFileSet = new Set(nextFiles);

  previousFileObjectUrls.forEach(({ file, url }) => {
    if (!nextFileSet.has(file)) {
      URL.revokeObjectURL(url);
    }
  });
};

export function useFileObjectUrls(files: File[]) {
  const [fileObjectUrls, setFileObjectUrls] = useState<FileObjectUrl[]>([]);
  const filesRef = useRef<File[]>([]);
  const fileObjectUrlsRef = useRef<FileObjectUrl[]>([]);

  useLayoutEffect(() => {
    if (areSameFiles(filesRef.current, files)) return;

    const previousFileObjectUrls = fileObjectUrlsRef.current;
    const nextFileObjectUrls = getNextFileObjectUrls(previousFileObjectUrls, files);

    revokeRemovedFileObjectUrls(previousFileObjectUrls, files);
    filesRef.current = files;
    fileObjectUrlsRef.current = nextFileObjectUrls;
    setFileObjectUrls(nextFileObjectUrls);
  }, [files]);

  useEffect(() => {
    return () => {
      revokeFileObjectUrls(fileObjectUrlsRef.current);
      filesRef.current = [];
      fileObjectUrlsRef.current = [];
    };
  }, []);

  return fileObjectUrls;
}
