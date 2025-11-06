import { useState } from 'react';

import { useFormContext } from 'react-hook-form';

import { Button, Input } from '@/shared';
import { isValidUrl } from '@/shared/lib/is-valid-url';
import FormItem from '@/shared/ui/form-item';

import { EXPERIENCE_GROUP_FORM_FIELD_NAME } from '../../constants/experience-group/experience-group-form-field-name';
import type { ExperienceGroupFormValues } from '../../types/experience-group-form-values';

export default function ExperienceGroupFormSnsForm() {
  const { setValue, getValues } = useFormContext<ExperienceGroupFormValues>();

  const [snsType, setSnsType] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [urlError, setUrlError] = useState<string>('');

  const isUrlValid = url === '' || isValidUrl(url);
  const canSubmit = snsType !== '' && url !== '' && isUrlValid;

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);

    if (newUrl === '') {
      setUrlError('');
      return;
    }

    if (!isValidUrl(newUrl)) {
      setUrlError('올바른 URL 형식을 입력해주세요');
      return;
    }

    setUrlError('');
  };

  const handleSubmit = () => {
    if (!canSubmit) return;

    const currentSnsTypes = getValues(EXPERIENCE_GROUP_FORM_FIELD_NAME.SNS_TYPES) ?? [];

    setValue(EXPERIENCE_GROUP_FORM_FIELD_NAME.SNS_TYPES, [...currentSnsTypes, { snsType, url }]);

    setSnsType('');
    setUrl('');
    setUrlError('');
  };

  return (
    <div className="flex flex-col gap-5">
      <FormItem hasUnderline label="SNS 타입">
        <Input
          value={snsType}
          onChange={(e) => setSnsType(e.target.value)}
          placeholder="예) 네이버 블로그, 인스타 등"
          className="typo-body-2-regular h-9"
        />
      </FormItem>
      <FormItem hasUnderline label="링크">
        <div className="flex flex-col gap-1">
          <Input
            value={url}
            onChange={handleUrlChange}
            placeholder="예) https://m.blog.naver.com/meemong"
            className="typo-body-2-regular h-9"
          />
        </div>
      </FormItem>
      {urlError && <p className="typo-body-2-regular text-negative-light">{urlError}</p>}
      <Button theme="white" onClick={handleSubmit} disabled={!canSubmit}>
        SNS 저장
      </Button>
    </div>
  );
}
