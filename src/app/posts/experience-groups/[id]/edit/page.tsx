'use client';

import { useEffect, useState } from 'react';

import { FormProvider } from 'react-hook-form';

import { useParams } from 'next/navigation';

import useGetExperienceGroupDetail from '@/features/posts/api/use-get-experience-group-detail';
import { EXPERIENCE_GROUP_FORM_FIELD_NAME } from '@/features/posts/constants/experience-group/experience-group-form-field-name';
import useExperienceGroupForm from '@/features/posts/hooks/experience-group/use-experience-group-form';
import useEditExperienceGroup from '@/features/posts/hooks/use-edit-experience-group';
import ExperienceGroupForm from '@/features/posts/ui/experience-group-form/experience-group-form';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { SiteHeader } from '@/widgets/header';

export default function EditExperienceGroupPage() {
  const { id } = useParams();

  const [currentStep, setCurrentStep] = useState(1);

  const { back } = useRouterWithUser();

  const { handleEdit } = useEditExperienceGroup({ experienceGroupId: id?.toString() ?? '' });

  const { data: detailResponse } = useGetExperienceGroupDetail(id?.toString() ?? '');

  const { method } = useExperienceGroupForm();

  useEffect(() => {
    if (!detailResponse?.data || !id) return;

    const { priceType, price, snsTypes, title, content } = detailResponse?.data;

    method.reset({
      [EXPERIENCE_GROUP_FORM_FIELD_NAME.PRICE_TYPE]: priceType,
      [EXPERIENCE_GROUP_FORM_FIELD_NAME.PRICE]: price,
      [EXPERIENCE_GROUP_FORM_FIELD_NAME.SNS_TYPES]: snsTypes.map((snsType) => ({
        snsType: snsType.snsType,
        url: snsType.url,
      })),
      [EXPERIENCE_GROUP_FORM_FIELD_NAME.TITLE]: title,
      [EXPERIENCE_GROUP_FORM_FIELD_NAME.CONTENT]: content,
    });
  }, [detailResponse?.data, id, method]);

  if (!id) return null;

  return (
    <div className="h-screen bg-white flex flex-col min-h-0">
      <FormProvider {...method}>
        <SiteHeader title="협찬 신청글 수정" showBackButton onBackClick={back} />
        <ExperienceGroupForm
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          onSubmit={handleEdit}
        />
      </FormProvider>
    </div>
  );
}
