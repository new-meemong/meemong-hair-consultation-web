import type { ChatStartRequest } from '@/shared/lib/chat-start-request';

declare global {
  interface Window {
    goAppRouter: (path: string) => void;
    closeWebview: (message: unknown) => void;
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
    showAdIfAllowed: (options: { adType: string; closeWebViewOnCompletion?: boolean }) => void;
    ShowAdBeforeAction?: {
      postMessage: (message: string) => void;
    };
    __meemongResolveAdBeforeAction?: (payload: { requestId: string; isCompleted: boolean }) => void;
    StartChatChannel?: {
      postMessage: (message: string) => void;
    };
    startChatChannel?: (message: ChatStartRequest) => void;
  }
}

export {};
