export type AppSource = 'app' | 'web';
export type GoAppRouterPayload = {
  path: string;
  reloadOnReturn?: boolean;
};
export type OpenInAppWebViewOptions = {
  reloadOnReturn?: boolean;
};

type BridgeWindow = Window & {
  GoAppRouter?: {
    postMessage: (value: string) => void;
  };
  goAppRouter?: (payload: string | GoAppRouterPayload) => void;
  GoBack?: {
    postMessage: (value: string) => void;
  };
  OpenChatChannel?: {
    postMessage: (value: string) => void;
  };
};

type OpenChatChannelMessage = {
  userId: string;
  chatChannelId: string;
  postId?: string;
  answerId?: string;
  entrySource?: 'PROFILE' | 'CONSULTING_RESPONSE' | 'POST_COMMENT' | 'TOP_ADVISOR';
  isMyHairConsultationPost?: boolean;
};

export function normalizeSource(source: string | null | undefined): AppSource {
  return source === 'app' ? 'app' : 'web';
}

function hasGoAppRouterBridge(): boolean {
  if (typeof window === 'undefined') return false;

  const w = window as BridgeWindow;
  return (
    typeof w.goAppRouter === 'function' ||
    (!!w.GoAppRouter && typeof w.GoAppRouter.postMessage === 'function')
  );
}

function hasCloseWebViewBridge(): boolean {
  if (typeof window === 'undefined') return false;

  const w = window as BridgeWindow;
  return (
    typeof w.closeWebview === 'function' ||
    (!!w.GoBack && typeof w.GoBack.postMessage === 'function')
  );
}

export function openInAppWebView(path: string, options?: OpenInAppWebViewOptions): boolean {
  if (!hasGoAppRouterBridge()) return false;

  try {
    const payload: GoAppRouterPayload = {
      path,
      reloadOnReturn: options?.reloadOnReturn ?? true,
    };
    const w = window as BridgeWindow;
    if (typeof w.goAppRouter === 'function') {
      w.goAppRouter(payload);
      return true;
    }

    w.GoAppRouter?.postMessage(JSON.stringify(payload));
    return true;
  } catch (_) {
    return false;
  }
}

export function closeAppWebView(message: string = 'close'): boolean {
  if (!hasCloseWebViewBridge()) return false;

  try {
    const w = window as BridgeWindow;
    if (typeof w.closeWebview === 'function') {
      w.closeWebview(message);
      return true;
    }

    w.GoBack?.postMessage(JSON.stringify(message));
    return true;
  } catch (_) {
    return false;
  }
}

export function openChatChannelInApp(message: OpenChatChannelMessage): boolean {
  if (typeof window === 'undefined') return false;

  const w = window as BridgeWindow;

  // window.openChatChannel 래퍼는 웹에서도 항상 주입되므로,
  // 실제 네이티브 브리지(OpenChatChannel.postMessage) 존재 여부로 판단한다.
  if (!w.OpenChatChannel || typeof w.OpenChatChannel.postMessage !== 'function') {
    return false;
  }

  try {
    if (typeof w.openChatChannel === 'function') {
      w.openChatChannel(message);
      return true;
    }

    w.OpenChatChannel.postMessage(JSON.stringify(message));
    return true;
  } catch (_) {
    return false;
  }
}
