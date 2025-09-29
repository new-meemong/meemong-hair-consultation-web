export default function openUrlInApp(url: string) {
  if (window.externalLink) {
    window.externalLink(url);
  }
}
