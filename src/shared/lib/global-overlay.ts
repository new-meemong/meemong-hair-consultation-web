import type { SnackBarProps } from '@/shared/ui/snack-bar';

type ShowSnackBarParams = Omit<SnackBarProps, 'id' | 'onClose' | 'open'>;

let showSnackBarHandler: ((props: ShowSnackBarParams) => void) | null = null;

export function registerShowSnackBar(handler: (props: ShowSnackBarParams) => void) {
  showSnackBarHandler = handler;
}

export function showGlobalSnackBar(props: ShowSnackBarParams) {
  if (!showSnackBarHandler) return;
  showSnackBarHandler(props);
}

// Deduplication for rapid repeated errors
const recentMessages = new Map<string, number>();
const DEDUPE_WINDOW_MS = 2000;

export function showGlobalErrorOnce(message: string) {
  const now = Date.now();
  const lastShownAt = recentMessages.get(message) ?? 0;

  if (now - lastShownAt < DEDUPE_WINDOW_MS) return;

  recentMessages.set(message, now);
  showGlobalSnackBar({ type: 'error', message });
}
