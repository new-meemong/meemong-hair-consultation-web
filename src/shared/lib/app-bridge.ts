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
  // window.goAppRouter 래퍼는 레이아웃 스크립트에서 항상 주입되므로,
  // 실제 네이티브 브리지(GoAppRouter.postMessage) 존재 여부로 판단한다.
  return !!w.GoAppRouter && typeof w.GoAppRouter.postMessage === 'function';
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
    // 프로덕션 앱은 아직 문자열 path 시그니처를 사용하므로 하위호환을 유지한다.
    // 옵션 타입은 이후 앱 배포 시 버전 게이트를 붙여 재활용할 수 있도록 유지한다.
    void options;
    const w = window as BridgeWindow;
    if (typeof w.goAppRouter === 'function') {
      w.goAppRouter(path);
      return true;
    }

    w.GoAppRouter?.postMessage(JSON.stringify(path));
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
