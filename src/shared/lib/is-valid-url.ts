export const isValidUrl = (url: string): boolean => {
  if (!url) return false;

  try {
    const parsedUrl = new URL(url);
    const hasSupportedProtocol = parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    const hasValidHostname = parsedUrl.hostname
      .split('.')
      .every((hostnamePart) => hostnamePart.length > 0);

    return hasSupportedProtocol && hasValidHostname;
  } catch {
    return false;
  }
};
