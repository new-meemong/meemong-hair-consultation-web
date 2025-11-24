import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { useGetUser } from '@/features/auth/api/use-get-user';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useShowModal from '@/shared/ui/hooks/use-show-modal';
import ImageUploaderList from '@/shared/ui/image-uploader-list';
import { Textarea } from '@/shared/ui/textarea';

import ReportFormButtonBox from './report-form-button-box';
import ReportFormItem from './report-form-item';

const MAX_IMAGE_COUNT = 3;

const MAX_REASON_LENGTH = 300;

const REPORT_FORM_FIELD_NAME = {
  targetUserId: 'targetUserId',
  images: 'images',
  reason: 'reason',
} as const;

const formSchema = z.object({
  [REPORT_FORM_FIELD_NAME.targetUserId]: z.string().min(1),
  [REPORT_FORM_FIELD_NAME.images]: z.array(z.instanceof(File)).max(MAX_IMAGE_COUNT).optional(),
  [REPORT_FORM_FIELD_NAME.reason]: z
    .string()
    .max(MAX_REASON_LENGTH, `최대 ${MAX_REASON_LENGTH}자까지 입력할 수 있어요`),
});

export type ReportFormValues = z.infer<typeof formSchema>;

type ReportFormProps = {
  targetUserId: string;
};

export default function ReportForm({ targetUserId }: ReportFormProps) {
  const { back } = useRouterWithUser();

  const methods = useForm<ReportFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      [REPORT_FORM_FIELD_NAME.targetUserId]: targetUserId,
      [REPORT_FORM_FIELD_NAME.images]: [],
      [REPORT_FORM_FIELD_NAME.reason]: '',
    },
  });

  const { data } = useGetUser(targetUserId);
  const targetUserName = data?.data.displayName;

  const currentImages =
    useWatch({
      name: REPORT_FORM_FIELD_NAME.images,
      control: methods.control,
    }) ?? [];

  const handleImageUpload = (file: File[]) => {
    const newImages = [...currentImages, ...file];
    methods.setValue(REPORT_FORM_FIELD_NAME.images, newImages);
  };

  const setImageFiles = (newImageFiles: File[]) => {
    methods.setValue(REPORT_FORM_FIELD_NAME.images, newImageFiles, { shouldDirty: true });
  };

  const handleCancel = () => {
    methods.reset();
    back();
  };

  const showModal = useShowModal();

  console.log('methods.formState.errors', methods.formState.errors);

  const handleSubmit = (data: ReportFormValues) => {
    if (data.reason.length < 1) {
      showModal({
        id: 'report-form-reason-required',
        text: '신고 사유는 필수 항목입니다.',
        buttons: [
          {
            label: '확인',
          },
        ],
      });
      return;
    }

    console.log(data);

    showModal({
      id: 'report-form-success',
      text: '신고 감사합니다.\n더 나은 이용환경을 만들 수 있도록\n노력하겠습니다.',
      buttons: [
        {
          label: '확인',
          onClick: () => {
            back();
          },
        },
      ],
    });
  };

  return (
    <FormProvider {...methods}>
      <form className="flex-1 flex flex-col min-h-0" onSubmit={methods.handleSubmit(handleSubmit)}>
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="flex flex-col gap-10 px-5 py-10">
            <ReportFormItem label="신고 대상" description={targetUserName} />
            <ReportFormItem
              label="이미지 등록"
              description="신고 내용을 설명할 이미지(채팅 캡쳐 등) 업로드"
            >
              <ImageUploaderList
                imageFiles={currentImages}
                onUpload={handleImageUpload}
                setImageFiles={setImageFiles}
                maxImageCount={MAX_IMAGE_COUNT}
              />
            </ReportFormItem>
            <ReportFormItem label="신고 사유(필수)">
              <div className="flex flex-col gap-5">
                <Textarea
                  {...methods.register(REPORT_FORM_FIELD_NAME.reason)}
                  placeholder="신고사유를 입력해주세요"
                  className="min-h-34.25"
                  hasBorder
                />
                {methods.formState.errors[REPORT_FORM_FIELD_NAME.reason] && (
                  <p className="text-negative typo-body-3-regular mt-1">
                    {String(methods.formState.errors[REPORT_FORM_FIELD_NAME.reason]?.message)}
                  </p>
                )}
                <div className="typo-body-3-regular text-label-info">
                  신고 내용은 검토 후 조치에 활용되며, 운영정책을 위반한 계정은 사전 고지 없이
                  일시정지 혹은 영구정지 될 수 있습니다.
                </div>
              </div>
            </ReportFormItem>
          </div>
        </div>
        <ReportFormButtonBox onCancel={handleCancel} />
      </form>
    </FormProvider>
  );
}
