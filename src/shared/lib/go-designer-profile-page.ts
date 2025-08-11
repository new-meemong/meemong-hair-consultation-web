export function goDesignerProfilePage(designerId: string) {
  if (window.goAppRouter) {
    window.goAppRouter(`/designer/profile/${designerId}`);
  }
}
