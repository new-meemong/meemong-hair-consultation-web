'use client';

import { POSTS_PAGE_KEY, useScrollRestoration } from '@/shared/hooks/use-scroll-restoration';
import { ToggleChip, ToggleChipGroup } from '@/shared/ui';
import { useCallback, useMemo } from 'react';

import { CONSULT_TYPE } from '@/entities/posts/constants/consult-type';
import ConsultingPostListContainer from '@/widgets/post/ui/consulting-post/consulting-post-list-container';
import ExperienceGroupListContainer from '@/widgets/post/ui/experience-group/experience-group-list-container';
import ModelBreakReleaseBottomSheet from '@/features/posts/ui/model-break-release-bottom-sheet';
import type { PostListTab } from '@/features/posts/types/post-list-tab';
import PromotionBanner from '@/features/banner/ui/promotion-banner';
import { ROUTES } from '@/shared';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { SiteHeader } from '@/widgets/header';
import Tab from '@/shared/ui/tab';
import TopAdvisorCarousel from '@/features/auth/ui/top-advisor-carousel';
import { USER_ROLE } from '@/entities/user/constants/user-role';
import { WritePostButton } from '@/features/posts/ui/write-post-button';
import { getPostListTabs } from '@/features/posts/lib/get-post-list-tabs';
import { getPostTabs } from '@/features/posts/constants/post-tabs';
import { useModelWriteGuard } from '@/features/posts/hooks/use-model-write-guard';
import { useOptionalAuthContext } from '@/features/auth/context/auth-context';
import { useOptionalBrand } from '@/shared/context/brand-context';
import usePostListBrandTab from '@/features/posts/hooks/use-post-list-brand-tab';
import usePostListRegionTab from '@/features/posts/hooks/use-post-list-region-tab';
import usePostListTab from '@/features/posts/hooks/use-post-list-tab';
import { usePostTab } from '@/features/posts/hooks/use-post-tab';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';

export default function PostsPage() {
  const auth = useOptionalAuthContext();
  const user = auth?.user ?? null;
  const isUserModel = auth?.isUserModel ?? false;
  const isUserDesigner = auth?.isUserDesigner ?? false;
  const brand = useOptionalBrand();

  const router = useRouterWithUser();

  const [activePostTab, setActivePostTab] = usePostTab();
  const [activePostListTab, setActivePostListTab] = usePostListTab();

  const { containerRef } = useScrollRestoration(POSTS_PAGE_KEY);

  const { regionTab, userSelectedRegionData } = usePostListRegionTab();
  const { brandTab, selectedBrandId } = usePostListBrandTab(activePostListTab);

  const handleTabChange = (tab: PostListTab) => {
    if (activePostListTab === tab) return;

    setActivePostListTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const listTabs = getPostListTabs(user?.role ?? USER_ROLE.MODEL);

  const navigateToWritePage = useCallback(() => {
    const targetRoute = brand ? ROUTES.WEB_POSTS_CREATE(brand.config.slug) : ROUTES.POSTS_CREATE;

    router.push(targetRoute, {
      [SEARCH_PARAMS.POST_TAB]: activePostTab,
    });
  }, [brand, router, activePostTab]);

  const {
    isBreakSheetOpen,
    isBreakReleaseSubmitting,
    closeBreakSheet,
    handleBreakReleaseAndWrite,
    handleWriteButtonClick,
  } = useModelWriteGuard({
    token: auth?.user?.token,
    slug: brand?.config.slug,
    isUserModel,
    onProceedWrite: navigateToWritePage,
  });

  const getListContainer = useCallback(() => {
    switch (activePostTab) {
      case CONSULT_TYPE.CONSULTING:
        return (
          <ConsultingPostListContainer
            activePostListTab={activePostListTab}
            userSelectedRegionData={userSelectedRegionData}
            selectedBrandId={selectedBrandId}
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
  }, [activePostTab, activePostListTab, selectedBrandId, userSelectedRegionData]);

  const postTabs = useMemo(() => getPostTabs(user?.role), [user?.role]);

  return (
    <div className="min-w-[375px] w-full h-screen mx-auto flex flex-col">
      {/* 헤더 */}
      <SiteHeader title="헤어상담" />
      <div className="flex flex-col flex-1 min-h-0">
        <Tab options={postTabs} value={activePostTab} onChange={setActivePostTab} />
        <div ref={containerRef} className="flex flex-col gap-5 flex-1 overflow-y-auto">
          <PromotionBanner />
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

                      {activePostTab === CONSULT_TYPE.CONSULTING && brandTab && (
                        <ToggleChip
                          key={brandTab.id}
                          pressed={brandTab.pressed}
                          onPressedChange={brandTab.onPressedChange}
                        >
                          {brandTab.label}
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
          <WritePostButton onClick={handleWriteButtonClick} aria-label="글쓰기" />
        </div>
      )}

      <ModelBreakReleaseBottomSheet
        open={isBreakSheetOpen}
        isSubmitting={isBreakReleaseSubmitting}
        onClose={closeBreakSheet}
        onConfirm={handleBreakReleaseAndWrite}
      />
    </div>
  );
}
