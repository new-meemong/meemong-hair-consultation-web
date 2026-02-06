import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useMemo } from 'react';

import { AD_TYPE } from '@/features/ad/constants/ad-type';
import { ROUTES } from '@/shared';
import { USER_WRITING_CONTENT_KEYS } from '@/shared/constants/local-storage';
import { useOverlayContext } from '@/shared/context/overlay-context';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useWritingContent from '@/shared/hooks/use-writing-content';
import { showAdIfAllowed } from '@/shared/lib/show-ad-if-allowed';
import { useAuthContext } from '@/features/auth/context/auth-context';
import { useGetUser } from '@/features/auth/api/use-get-user';
import type { UserDetail } from '@/entities/user/model/user-detail';
import { getErrorMessage } from '@/shared/lib/error-handler';

import { useCreateHairConsultation } from './use-create-hair-consultation';
import { HAIR_CONSULTATION_FORM_FIELD_NAME } from '../constants/hair-consultation-form-field-name';
import {
  hairConsultationFormSchema,
  type HairConsultationFormValues,
} from '../types/hair-consultation-form-values';
import {
  HAIR_CONSULTATION_CONCERN_OPTIONS,
  HAIR_CONSULTATION_HAIR_LENGTH_VALUES,
  HAIR_CONSULTATION_HAIR_TEXTURE_VALUES,
  HAIR_CONSULTATION_PERSONAL_COLOR_VALUES,
  HAIR_CONSULTATION_SKIN_BRIGHTNESS_VALUES,
} from '../constants/hair-consultation-create-options';
import { DEFAULT_HAIR_CONSULTATION_FORM_VALUES } from '../constants/hair-consultation-form-default-values';

const normalizeEnumValue = <T extends readonly string[]>(
  value: unknown,
  options: T,
  fallback: T[number],
) => {
  if (typeof value !== 'string') return fallback;
  return options.includes(value as T[number]) ? (value as T[number]) : fallback;
};

const normalizeEnumArray = <T extends readonly string[]>(
  value: unknown,
  options: T,
  fallback: T[number][],
) => {
  if (!Array.isArray(value)) return fallback;
  const filtered = value.filter(
    (item): item is T[number] => typeof item === 'string' && options.includes(item as T[number]),
  );
  return filtered.length > 0 ? filtered : fallback;
};

export default function useHairConsultationForm() {
  const { replace } = useRouterWithUser();
  const { showSnackBar } = useOverlayContext();
  const { user } = useAuthContext();

  const { saveContent, savedContent } = useWritingContent(
    USER_WRITING_CONTENT_KEYS.hairConsultation,
  );
  const { data: userResponse } = useGetUser(user.id.toString());
  const userDetail = userResponse?.data;

  const defaultValues = useMemo<HairConsultationFormValues>(() => {
    const profileSource: UserDetail | UserDetail['modelInfo'] | null =
      userDetail?.modelInfo ?? userDetail ?? null;

    return {
      ...DEFAULT_HAIR_CONSULTATION_FORM_VALUES,
      [HAIR_CONSULTATION_FORM_FIELD_NAME.HAIR_LENGTH]: normalizeEnumValue(
        profileSource?.hairLength,
        HAIR_CONSULTATION_HAIR_LENGTH_VALUES,
        DEFAULT_HAIR_CONSULTATION_FORM_VALUES[HAIR_CONSULTATION_FORM_FIELD_NAME.HAIR_LENGTH],
      ),
      [HAIR_CONSULTATION_FORM_FIELD_NAME.HAIR_CONCERNS]: normalizeEnumArray(
        profileSource?.hairConcerns,
        HAIR_CONSULTATION_CONCERN_OPTIONS,
        DEFAULT_HAIR_CONSULTATION_FORM_VALUES[HAIR_CONSULTATION_FORM_FIELD_NAME.HAIR_CONCERNS],
      ),
      [HAIR_CONSULTATION_FORM_FIELD_NAME.HAIR_TEXTURE]: normalizeEnumValue(
        profileSource?.hairTexture,
        HAIR_CONSULTATION_HAIR_TEXTURE_VALUES,
        DEFAULT_HAIR_CONSULTATION_FORM_VALUES[HAIR_CONSULTATION_FORM_FIELD_NAME.HAIR_TEXTURE],
      ),
      [HAIR_CONSULTATION_FORM_FIELD_NAME.SKIN_BRIGHTNESS]: normalizeEnumValue(
        profileSource?.skinBrightness,
        HAIR_CONSULTATION_SKIN_BRIGHTNESS_VALUES,
        DEFAULT_HAIR_CONSULTATION_FORM_VALUES[HAIR_CONSULTATION_FORM_FIELD_NAME.SKIN_BRIGHTNESS],
      ),
      [HAIR_CONSULTATION_FORM_FIELD_NAME.PERSONAL_COLOR]: normalizeEnumValue(
        profileSource?.personalColor,
        HAIR_CONSULTATION_PERSONAL_COLOR_VALUES,
        DEFAULT_HAIR_CONSULTATION_FORM_VALUES[HAIR_CONSULTATION_FORM_FIELD_NAME.PERSONAL_COLOR],
      ),
    };
  }, [userDetail]);

  const method = useForm<HairConsultationFormValues>({
    resolver: zodResolver(hairConsultationFormSchema),
    defaultValues: DEFAULT_HAIR_CONSULTATION_FORM_VALUES,
  });

  useEffect(() => {
    if (!userDetail) return;
    if (method.formState.isDirty) return;
    if (savedContent) return;
    method.reset(defaultValues);
  }, [defaultValues, method, savedContent, userDetail]);

  const { handleCreateHairConsultation, isPending } = useCreateHairConsultation();

  const submit = (values: HairConsultationFormValues) => {
    handleCreateHairConsultation(values, {
      onSuccess: () => {
        showAdIfAllowed({ adType: AD_TYPE.CREATING_HAIR_CONSULTING });
        saveContent(null);
        showSnackBar({
          type: 'success',
          message: '업로드가 완료되었습니다!',
        });
        replace(ROUTES.POSTS);
      },
      onError: (error) => {
        showSnackBar({
          type: 'error',
          message: getErrorMessage(error),
        });
      },
    });
  };

  return { method, submit, isPending };
}
