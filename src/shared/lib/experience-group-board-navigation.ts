export const EXPERIENCE_GROUP_BOARD_PATH = '/experience-groups';

export function isExperienceGroupBoard(entry: string | null | undefined, pathname?: string) {
  return entry === 'true' || pathname === EXPERIENCE_GROUP_BOARD_PATH;
}
