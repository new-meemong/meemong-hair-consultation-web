export function showAdIfAllowed({ adType }: { adType: string }): Promise<void> {
  if (window.showAdIfAllowed) {
    return window.showAdIfAllowed({ adType });
  }
  return Promise.resolve();
}
