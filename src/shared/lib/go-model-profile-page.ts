export default function goModelProfilePage(modelId: string) {
  if (window.goAppRouter) {
    window.goAppRouter(`/model/profile/${modelId}`);
  }
}
