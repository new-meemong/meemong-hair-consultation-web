type DownloadImageParams = {
  /** 다운로드할 이미지 URL */
  url: string;
  /** 저장될 파일명 (확장자 제외) */
  fileName: string;
};

/**
 * 이미지 URL을 받아서 로컬에 다운로드하는 함수
 */
export const downloadImage = async ({ url: imageUrl, fileName }: DownloadImageParams) => {
  try {
    // URL 인코딩
    const encodedUrl = encodeURIComponent(imageUrl);
    const proxyUrl = `/api/download?url=${encodedUrl}`;

    const response = await fetch(proxyUrl);

    if (!response.ok) {
      throw new Error('이미지 다운로드에 실패했습니다.');
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('이미지 다운로드 중 오류가 발생했습니다:', error);
    throw error;
  }
};
