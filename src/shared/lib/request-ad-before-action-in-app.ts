import { v4 as uuidv4 } from 'uuid';

export const AD_BEFORE_ACTION_RESULT = {
  COMPLETED: 'completed',
  NOT_COMPLETED: 'notCompleted',
  UNSUPPORTED: 'unsupported',
} as const;

export type AdBeforeActionResult =
  (typeof AD_BEFORE_ACTION_RESULT)[keyof typeof AD_BEFORE_ACTION_RESULT];

type AdBeforeActionRequest = {
  adType: string;
};

type AdBeforeActionCompletionPayload = {
  requestId: string;
  isCompleted: boolean;
};

type PendingAdRequest = {
  resolve: (result: AdBeforeActionResult) => void;
  timeoutId: ReturnType<typeof setTimeout>;
};

type AdBeforeActionBridgeWindow = Window & {
  ShowAdBeforeAction?: {
    postMessage: (message: string) => void;
  };
  __meemongResolveAdBeforeAction?: (payload: AdBeforeActionCompletionPayload) => void;
};

// 광고 시청 시간은 충분히 허용하되 네이티브 응답 유실 시 작성 화면을
// 10분 동안 잠그지 않도록 제한한다.
export const AD_COMPLETION_TIMEOUT_MS = 2 * 60 * 1000;
const pendingAdRequests = new Map<string, PendingAdRequest>();

const installAdCompletionHandler = (bridgeWindow: AdBeforeActionBridgeWindow) => {
  bridgeWindow.__meemongResolveAdBeforeAction = ({ requestId, isCompleted }) => {
    const pendingRequest = pendingAdRequests.get(requestId);
    if (!pendingRequest) return;

    clearTimeout(pendingRequest.timeoutId);
    pendingAdRequests.delete(requestId);
    pendingRequest.resolve(
      isCompleted ? AD_BEFORE_ACTION_RESULT.COMPLETED : AD_BEFORE_ACTION_RESULT.NOT_COMPLETED,
    );
  };
};

export function requestAdBeforeActionInApp({
  adType,
}: AdBeforeActionRequest): Promise<AdBeforeActionResult> {
  if (typeof window === 'undefined') {
    return Promise.resolve(AD_BEFORE_ACTION_RESULT.UNSUPPORTED);
  }

  const bridgeWindow = window as AdBeforeActionBridgeWindow;
  if (typeof bridgeWindow.ShowAdBeforeAction?.postMessage !== 'function') {
    return Promise.resolve(AD_BEFORE_ACTION_RESULT.UNSUPPORTED);
  }

  installAdCompletionHandler(bridgeWindow);

  const requestId = uuidv4();
  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      pendingAdRequests.delete(requestId);
      resolve(AD_BEFORE_ACTION_RESULT.NOT_COMPLETED);
    }, AD_COMPLETION_TIMEOUT_MS);

    pendingAdRequests.set(requestId, { resolve, timeoutId });

    try {
      bridgeWindow.ShowAdBeforeAction?.postMessage(
        JSON.stringify({
          requestId,
          adType,
        }),
      );
    } catch {
      clearTimeout(timeoutId);
      pendingAdRequests.delete(requestId);
      resolve(AD_BEFORE_ACTION_RESULT.NOT_COMPLETED);
    }
  });
}
