import { openInAppWebView } from './app-bridge';

export default function goModelProfilePage(modelId: string) {
  openInAppWebView(`/model/profile/${modelId}`, { reloadOnReturn: false });
}
