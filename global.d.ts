interface Window {
  goAppRouter: (path: string) => void;
  closeWebview: (message: string) => void;
  openChatChannel: (message: {
    userId: string;
    chatChannelId: string;
    postId?: string;
    answerId?: string;
    entrySource?: 'PROFILE' | 'CONSULTING_RESPONSE' | 'POST_COMMENT' | 'TOP_ADVISOR';
  }) => void;
  externalLink: (message: string) => void;
  setCustomBackAction: (hasAction: boolean) => void;
  customBackAction: (() => void) | null;
  showAdIfAllowed: ({ adType }: { adType: string }) => void;
}
