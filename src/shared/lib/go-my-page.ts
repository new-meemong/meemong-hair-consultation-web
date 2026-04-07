import { openInAppWebView } from './app-bridge';

export function goMyPage() {
  openInAppWebView('/my', { reloadOnReturn: false });
}
