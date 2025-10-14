interface Window {
  goAppRouter: (path: string) => void;
  closeWebview: (message: string) => void;
  openChatChannel: (message: { userId: string; chatChannelId: string }) => void;
  externalLink: (message: string) => void;
  setCustomBackAction: (hasAction: boolean) => void;
  customBackAction: (() => void) | null;
}
