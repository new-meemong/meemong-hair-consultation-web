'use client';

import { useState } from 'react';

import { CONSULT_TYPE } from '@/entities/posts/constants/consult-type';

import { usePostTab } from '@/features/posts/hooks/use-post-tab';

import { USER_GUIDE_KEYS } from '@/shared/constants/local-storage';
import useShowGuide from '@/shared/hooks/use-show-guide';
import type { ValueOf } from '@/shared/type/types';

import ConsultingPostFormContainer from '@/widgets/post/ui/consulting-post/consulting-post-form-container';
import ExperienceGroupFormContainer from '@/widgets/post/ui/experience-group/experience-group-form-container';

export default function CreatePostPage() {
  useShowGuide(USER_GUIDE_KEYS.hasSeenCreatePostGuide);

  const [initialHeight] = useState(() => window.innerHeight);

  const [selectedTab] = usePostTab();

  const renderForm = (type: ValueOf<typeof CONSULT_TYPE>) => {
    switch (type) {
      case CONSULT_TYPE.CONSULTING:
        return <ConsultingPostFormContainer />;
      // case CONSULT_TYPE.GENERAL:
      //   return <PostFormContainer />;
      case CONSULT_TYPE.EXPERIENCE_GROUP:
        return <ExperienceGroupFormContainer />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col min-h-0" style={{ minHeight: initialHeight }}>
      {renderForm(selectedTab)}
    </div>
  );
}
