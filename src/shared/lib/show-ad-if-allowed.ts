type ShowAdIfAllowedOptions = {
  adType: string;
  closeWebViewOnCompletion?: boolean;
};

export function showAdIfAllowed(options: ShowAdIfAllowedOptions) {
  if (window.showAdIfAllowed) {
    window.showAdIfAllowed(options);
  }
}
