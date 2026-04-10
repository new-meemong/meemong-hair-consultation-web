export function sortParticipantIds<T extends string | number>(participantIds: T[]): string[] {
  return participantIds.map(String).sort((a, b) => Number(a) - Number(b));
}
