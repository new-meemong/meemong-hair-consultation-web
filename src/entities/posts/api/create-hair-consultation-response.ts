export type CreateHairConsultationResponse = {
  hairConsultationId?: number;
  id?: number;
  data?: {
    hairConsultationId?: number;
    id?: number;
  };
};

export function getCreatedHairConsultationId(
  response: CreateHairConsultationResponse | null | undefined,
) {
  return (
    response?.hairConsultationId ??
    response?.id ??
    response?.data?.hairConsultationId ??
    response?.data?.id ??
    null
  );
}
