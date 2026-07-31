import { openExternalLinkInApp } from './app-bridge';

export function openExternalUrl(url: string): void {
  if (openExternalLinkInApp(url)) return;

  window.open(url, '_blank', 'noopener,noreferrer');
}
