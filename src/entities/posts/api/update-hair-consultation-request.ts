import type {
  CreateHairConsultationRequest,
  HairConsultationTreatmentRequest,
} from './create-hair-consultation-request';

export type UpdateHairConsultationTreatmentRequest = HairConsultationTreatmentRequest & {
  id?: number;
};

export type UpdateHairConsultationRequest = Omit<CreateHairConsultationRequest, 'treatments'> & {
  treatments?: UpdateHairConsultationTreatmentRequest[];
};
