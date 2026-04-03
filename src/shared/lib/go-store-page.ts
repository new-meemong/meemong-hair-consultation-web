import { openInAppWebView } from './app-bridge';

export function goStorePage() {
  openInAppWebView('/store', { reloadOnReturn: true });
}
