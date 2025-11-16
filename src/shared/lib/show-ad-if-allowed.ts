export function showAdIfAllowed({ adType }: { adType: string }) {
  if (window.showAdIfAllowed) {
    window.showAdIfAllowed({ adType });
  }
}
