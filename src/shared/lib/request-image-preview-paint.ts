const IMAGE_PREVIEW_REPAINT_ATTRIBUTE = 'data-image-preview-repaint';

export function requestImagePreviewPaint(afterPaint?: () => void) {
  if (typeof window === 'undefined') return;

  window.requestAnimationFrame(() => {
    const root = document.documentElement;

    // Some Android WebViews delay painting after the native file picker returns.
    root.setAttribute(IMAGE_PREVIEW_REPAINT_ATTRIBUTE, String(Date.now()));
    void root.offsetHeight;

    window.requestAnimationFrame(() => {
      root.removeAttribute(IMAGE_PREVIEW_REPAINT_ATTRIBUTE);
      afterPaint?.();
    });
  });
}
