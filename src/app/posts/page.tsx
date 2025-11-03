'use client';

import { useCallback } from 'react';

import { CONSULT_TYPE } from '@/entities/posts/constants/consult-type';
import { useAuthContext } from '@/features/auth/context/auth-context';
import TopAdvisorCarousel from '@/features/auth/ui/top-advisor-carousel';
import { POST_TABS } from '@/features/posts/constants/post-tabs';
import usePostListRegionTab from '@/features/posts/hooks/use-post-list-region-tab';
import usePostListTab from '@/features/posts/hooks/use-post-list-tab';
import { usePostTab } from '@/features/posts/hooks/use-post-tab';
import { getPostListTabs } from '@/features/posts/lib/get-post-list-tabs';
import type { PostListTab } from '@/features/posts/types/post-list-tab';
import { WritePostButton } from '@/features/posts/ui/write-post-button';
import { ROUTES } from '@/shared';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { POSTS_PAGE_KEY, useScrollRestoration } from '@/shared/hooks/use-scroll-restoration';
import { ToggleChip, ToggleChipGroup } from '@/shared/ui';
import Tab from '@/shared/ui/tab';
import { SiteHeader } from '@/widgets/header';
import ConsultingPostListContainer from '@/widgets/post/ui/consulting-post/consulting-post-list-container';
import ExperienceGroupListContainer from '@/widgets/post/ui/experience-group-list-container';

export default function PostsPage() {
  const { user, isUserModel, isUserDesigner } = useAuthContext();

  const router = useRouterWithUser();

  const [activePostTab, setActivePostTab] = usePostTab();
  const [activePostListTab, setActivePostListTab] = usePostListTab();

  const { containerRef } = useScrollRestoration(POSTS_PAGE_KEY);

  const { regionTab, userSelectedRegionData } = usePostListRegionTab();

  const handleTabChange = (tab: PostListTab) => {
    if (activePostListTab === tab) return;

    setActivePostListTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const listTabs = getPostListTabs(user.role);

  const handleWriteButtonClick = useCallback(() => {
    router.push(ROUTES.POSTS_CREATE, {
      [SEARCH_PARAMS.POST_TAB]: activePostTab,
    });
  }, [router, activePostTab]);

  const getListContainer = useCallback(() => {
    switch (activePostTab) {
      case CONSULT_TYPE.CONSULTING:
        return (
          <ConsultingPostListContainer
            activePostListTab={activePostListTab}
            userSelectedRegionData={userSelectedRegionData}
          />
        );
      case CONSULT_TYPE.EXPERIENCE_GROUP:
        return (
          <ExperienceGroupListContainer
            activePostListTab={activePostListTab}
            userSelectedRegionData={userSelectedRegionData}
          />
        );
    }
  }, [activePostTab, activePostListTab, userSelectedRegionData]);

  return (
    <div className="min-w-[375px] w-full h-screen mx-auto flex flex-col">
      {/* 헤더 */}
      <SiteHeader title="헤어상담" />
      <div className="flex flex-col gap-5 flex-1 min-h-0">
        <Tab options={POST_TABS} value={activePostTab} onChange={setActivePostTab} />
        <div ref={containerRef} className="flex flex-col gap-5 flex-1 overflow-y-auto pt-5">
          <TopAdvisorCarousel />
          <div className="flex-1 flex flex-col min-h-0 gap-2">
            <div className="flex-shrink-0">
              <ToggleChipGroup className="flex overflow-x-auto scrollbar-hide px-5">
                {(() => {
                  const [first, ...rest] = listTabs;

                  return (
                    <>
                      <ToggleChip
                        key={first.id}
                        icon={first.icon}
                        pressed={activePostListTab === first.id}
                        onPressedChange={() => handleTabChange(first.id)}
                      >
                        {first.label}
                      </ToggleChip>

                      {isUserDesigner && (
                        <ToggleChip
                          key={regionTab.id}
                          icon={regionTab.icon}
                          pressed={regionTab.pressed}
                          onPressedChange={regionTab.onPressedChange}
                          onDelete={regionTab.onDelete}
                        >
                          {regionTab.label}
                        </ToggleChip>
                      )}

                      {rest.map(({ id, icon, label }) => (
                        <ToggleChip
                          key={id}
                          icon={icon}
                          pressed={activePostListTab === id}
                          onPressedChange={() => handleTabChange(id)}
                        >
                          {label}
                        </ToggleChip>
                      ))}
                    </>
                  );
                })()}
              </ToggleChipGroup>
            </div>
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <div className="[&>*:last-child]:border-b-0">{getListContainer()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 글쓰기 버튼 */}
      {isUserModel && (
        <div className="fixed bottom-5 right-5">
          <WritePostButton onClick={handleWriteButtonClick} />
        </div>
      )}
    </div>
  );
}
