import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { AD_TYPE } from '@/features/ad/constants/ad-type';
import { CONSULT_TYPE } from '@/entities/posts/constants/consult-type';
import { useAuthContext } from '@/features/auth/context/auth-context';
import { ROUTES } from '@/shared';
import { USER_WRITING_CONTENT_KEYS } from '@/shared/constants/local-storage';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { useOverlayContext } from '@/shared/context/overlay-context';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { closeAppWebView } from '@/shared/lib/app-bridge';
import { getApiError, getErrorMessage } from '@/shared/lib/error-handler';
import {
  AD_BEFORE_ACTION_RESULT,
  requestAdBeforeActionInApp,
} from '@/shared/lib/request-ad-before-action-in-app';
import { showAdIfAllowed } from '@/shared/lib/show-ad-if-allowed';
import useWritingContent from '@/shared/hooks/use-writing-content';

import useCreateExperienceGroupMutation from '../../api/use-create-experience-group-mutation';
import { EXPERIENCE_GROUP_FORM_FIELD_NAME } from '../../constants/experience-group/experience-group-form-field-name';
import {
  experienceGroupFormSchema,
  type ExperienceGroupFormValues,
} from '../../types/experience-group-form-values';

const DEFAULT_FORM_VALUE = {
  [EXPERIENCE_GROUP_FORM_FIELD_NAME.TITLE]: '',
  [EXPERIENCE_GROUP_FORM_FIELD_NAME.CONTENT]: '',
  [EXPERIENCE_GROUP_FORM_FIELD_NAME.SNS_TYPES]: [],
};

const INVALID_SNS_URL_MESSAGE = '올바른 SNS 주소를 입력해주세요.';

const getExperienceGroupSubmitErrorMessage = (error: unknown): string => {
  const snsTypesFieldPrefix = `${EXPERIENCE_GROUP_FORM_FIELD_NAME.SNS_TYPES}.`;
  const hasInvalidSnsUrl = getApiError(error).fieldErrors?.some(
    ({ field }) => field.startsWith(snsTypesFieldPrefix) && field.endsWith('.url'),
  );

  return hasInvalidSnsUrl ? INVALID_SNS_URL_MESSAGE : getErrorMessage(error);
};

export default function useExperienceGroupForm() {
  const { replace } = useRouterWithUser();
  const { showSnackBar } = useOverlayContext();
  const { isUserModel } = useAuthContext();
  const searchParams = useSearchParams();
  const supportsNativePostCreateReturn =
    searchParams.get(SEARCH_PARAMS.SUPPORTS_NATIVE_POST_CREATE_RETURN) === 'true';
  const [isAwaitingAdCompletion, setIsAwaitingAdCompletion] = useState(false);

  const { saveContent } = useWritingContent(USER_WRITING_CONTENT_KEYS.experienceGroup);

  const method = useForm<ExperienceGroupFormValues>({
    resolver: zodResolver(experienceGroupFormSchema),
    defaultValues: DEFAULT_FORM_VALUE,
  });

  const { mutate, isPending } = useCreateExperienceGroupMutation();

  const uploadExperienceGroup = (
    values: ExperienceGroupFormValues,
    { showLegacyAdAfterUpload }: { showLegacyAdAfterUpload: boolean },
  ) => {
    mutate(values, {
      onSuccess: () => {
        saveContent(null);
        showSnackBar({
          type: 'success',
          message: '업로드가 완료되었습니다!',
        });

        // 신규 앱은 업로드 전에 광고를 완료한다. 전용 브리지가 없는 구버전 앱만
        // 기존 계약대로 업로드 성공 후 광고를 요청한다.
        if (isUserModel && showLegacyAdAfterUpload) {
          replace(ROUTES.POSTS, {
            [SEARCH_PARAMS.POST_TAB]: CONSULT_TYPE.EXPERIENCE_GROUP,
          });
          showAdIfAllowed({
            adType: AD_TYPE.CREATING_EXPERIENCE_GROUP,
          });
          return;
        }

        // 작성 전용 네이티브 route에서만 닫기 메시지를 보낸다. 메인 WebView나
        // 브라우저에서 열린 작성 화면은 현재 WebView를 내 글 목록으로 교체한다.
        if (supportsNativePostCreateReturn && closeAppWebView('close')) {
          return;
        }

        replace(ROUTES.POSTS, {
          [SEARCH_PARAMS.POST_TAB]: CONSULT_TYPE.EXPERIENCE_GROUP,
          [SEARCH_PARAMS.POST_LIST_TAB]: 'my',
        });
      },
      onError: (error) => {
        showSnackBar({
          type: 'error',
          message: getExperienceGroupSubmitErrorMessage(error),
        });
      },
    });
  };

  const submit = async (values: ExperienceGroupFormValues) => {
    if (!isUserModel) {
      uploadExperienceGroup(values, { showLegacyAdAfterUpload: false });
      return;
    }

    setIsAwaitingAdCompletion(true);
    const adResult = await requestAdBeforeActionInApp({
      adType: AD_TYPE.CREATING_EXPERIENCE_GROUP,
    });
    setIsAwaitingAdCompletion(false);

    if (adResult === AD_BEFORE_ACTION_RESULT.NOT_COMPLETED) {
      showSnackBar({
        type: 'error',
        message: '광고를 완료하지 못했습니다. 다시 시도해주세요.',
      });
      return;
    }

    uploadExperienceGroup(values, {
      showLegacyAdAfterUpload: adResult === AD_BEFORE_ACTION_RESULT.UNSUPPORTED,
    });
  };

  return {
    method,
    submit,
    isSubmitting: isAwaitingAdCompletion || isPending,
  };
}
