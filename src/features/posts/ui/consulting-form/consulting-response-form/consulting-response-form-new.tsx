import { useSearchParams } from 'next/navigation';
import { type UseFormReturn } from 'react-hook-form';

import { isUserMale } from '@/entities/user/lib/user-sex';
import { usePostDetail } from '@/features/posts/context/post-detail-context';
import useCreateHairConsultationAnswer from '@/features/posts/hooks/use-create-hair-consultation-answer';
import { ROUTES } from '@/shared';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { useOverlayContext } from '@/shared/context/overlay-context';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import type { FormStep } from '@/shared/type/form-step';
import type { KeyOf } from '@/shared/type/types';
import MultiStepForm from '@/shared/ui/multi-step-form';

import ConsultingResponseFormStepBangsRecommendationNew from './consulting-response-form-step-bangs-recommendation-new';
import ConsultingResponseFormStepFaceShapeNew from './consulting-response-form-step-face-shape-new';
import ConsultingResponseFormStepHairRecommendationNew from './consulting-response-form-step-hair-recommendation-new';
import ConsultingResponseFormStepTreatments from './consulting-response-form-step-treatments';
import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../../../constants/consulting-response-form-field-name';
import type { ConsultingResponseFormValues } from '../../../types/consulting-response-form-values';

const CONSULTING_RESPONSE_FORM_STEPS: FormStep<ConsultingResponseFormValues>[] = [
  {
    name: CONSULTING_RESPONSE_FORM_FIELD_NAME.FACE_SHAPE,
    question: '고객님의 얼굴형을 골라주세요',
    questionClassName: 'typo-headline-semibold text-label-default',
    required: true,
    children: <ConsultingResponseFormStepFaceShapeNew />,
  },
  {
    name: CONSULTING_RESPONSE_FORM_FIELD_NAME.BANGS_RECOMMENDATION,
    question: '추천하는 앞머리 스타일을 모두 골라주세요',
    questionClassName: 'typo-headline-semibold text-label-default',
    description:
      '아래 이미지는 참고용이며 고객님의 이목구비 및 얼굴형에 맞는 앞머리 연출법을 체크해주세요.',
    required: true,
    children: <ConsultingResponseFormStepBangsRecommendationNew />,
  },
  {
    name: CONSULTING_RESPONSE_FORM_FIELD_NAME.HAIR_LENGTHS_RECOMMENDATION,
    question: '추천하는 기장을 모두 골라주세요',
    questionClassName: 'typo-headline-semibold text-label-default',
    required: true,
    children: <ConsultingResponseFormStepHairRecommendationNew />,
  },
  {
    name: CONSULTING_RESPONSE_FORM_FIELD_NAME.TREATMENTS,
    question: '추천 시술과 가격정보를 알려주세요',
    questionClassName: 'typo-headline-semibold text-label-default',
    required: true,
    children: <ConsultingResponseFormStepTreatments />,
  },
];

type ConsultingResponseFormNewProps = {
  method: UseFormReturn<ConsultingResponseFormValues>;
  currentStep: number;
  setCurrentStep: (step: number) => void;
};

export default function ConsultingResponseFormNew({
  method,
  currentStep,
  setCurrentStep,
}: ConsultingResponseFormNewProps) {
  const { postDetail } = usePostDetail();
  const searchParams = useSearchParams();
  const postListTab = searchParams.get(SEARCH_PARAMS.POST_LIST_TAB) ?? 'latest';
  const isMale = isUserMale(postDetail.hairConsultPostingCreateUserSex);

  const { showSnackBar } = useOverlayContext();
  const { replace } = useRouterWithUser();

  const postId = method.getValues(CONSULTING_RESPONSE_FORM_FIELD_NAME.POST_ID);

  const { handleCreateHairConsultationAnswer, isPending: isCreatingHairConsultationAnswer } =
    useCreateHairConsultationAnswer(postId);

  const submit = async (values: ConsultingResponseFormValues) => {
    await handleCreateHairConsultationAnswer(values, {
      onSuccess: () => {
        showSnackBar({
          type: 'success',
          message: '컨설팅 답변을 보냈습니다!',
        });

        replace(ROUTES.POSTS_NEW_DETAIL(postId), {
          [SEARCH_PARAMS.POST_LIST_TAB]: postListTab,
        });
      },
    });
  };

  const canMoveNext = (
    name: KeyOf<ConsultingResponseFormValues> | Array<KeyOf<ConsultingResponseFormValues>>,
  ) => {
    if (name === CONSULTING_RESPONSE_FORM_FIELD_NAME.FACE_SHAPE) {
      const faceShape = method.getValues(name);
      const isFaceShapeAdvice = method.getValues(
        CONSULTING_RESPONSE_FORM_FIELD_NAME.IS_FACE_SHAPE_ADVICE,
      );

      return !!faceShape || !!isFaceShapeAdvice;
    }
    if (name === CONSULTING_RESPONSE_FORM_FIELD_NAME.BANGS_RECOMMENDATION) {
      const { value, values, needStoreConsulting } = method.getValues(name);
      return values.length > 0 || value !== null || needStoreConsulting;
    }
    if (name === CONSULTING_RESPONSE_FORM_FIELD_NAME.HAIR_LENGTHS_RECOMMENDATION) {
      const hairLengths = method.getValues(
        CONSULTING_RESPONSE_FORM_FIELD_NAME.HAIR_LENGTHS_RECOMMENDATION,
      );
      const hairLayers = method.getValues(
        CONSULTING_RESPONSE_FORM_FIELD_NAME.HAIR_LAYERS_RECOMMENDATION,
      );
      const hairCurls = method.getValues(
        CONSULTING_RESPONSE_FORM_FIELD_NAME.HAIR_CURLS_RECOMMENDATION,
      );

      const isHairLengthsAnswered =
        hairLengths.values.length > 0 || hairLengths.needStoreConsulting;
      const isHairCurlsAnswered = hairCurls.values.length > 0 || hairCurls.needStoreConsulting;
      const isHairLayersAnswered = hairLayers.values.length > 0 || hairLayers.needStoreConsulting;

      return isMale
        ? isHairLengthsAnswered && isHairCurlsAnswered
        : isHairLengthsAnswered && isHairLayersAnswered && isHairCurlsAnswered;
    }
    if (name === CONSULTING_RESPONSE_FORM_FIELD_NAME.TREATMENTS) {
      const value = method.getValues(name);
      return value && value.length > 0;
    }
    return !isCreatingHairConsultationAnswer;
  };

  return (
    <MultiStepForm
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      steps={CONSULTING_RESPONSE_FORM_STEPS}
      canMoveNext={canMoveNext}
      onSubmit={submit}
      lastStepButtonLabel="저장"
    />
  );
}
