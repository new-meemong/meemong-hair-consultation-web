// Read the current route at the CTA boundary; no global navigation history.
const entries = new Set(['model_home_consultation', 'designer_home_consultation', 'consultation_list', 'my_activity', 'notification_inbox', 'external', 'model_profile_consultation']);
export function consultationEntry(): string {
  if (typeof window === 'undefined') return 'hair_consultation';
  const entry = new URLSearchParams(window.location.search).get('chatEntry');
  return entry && entries.has(entry) ? entry : 'hair_consultation';
}
