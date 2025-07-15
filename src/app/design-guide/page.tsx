import CommentIcon from '@/assets/icons/comment.svg';
import UserIcon from '@/assets/icons/lets-icons_user-duotone.svg';
import HeartIcon from '@/assets/icons/mdi_heart.svg';
import RecentIcon from '@/assets/icons/mdi_recent.svg';
import PopularIcon from '@/assets/icons/recent.svg';
import { LikeButton } from '@/features/likes/ui/like-button';
import { WritePostButton } from '@/features/posts/ui/write-post-button';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Loader,
  ToggleChip,
  ToggleChipGroup,
} from '@/shared/ui';
import { ChatExamples } from '@/widgets/chat';

export default function DesignGuide() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-pretendard)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center max-w-4xl w-full">
        <div className="typo-title-large-bold text-center mb-8">디자인 시스템</div>
        {/* 타이포그래피 섹션 */}
        <section className="w-full">
          <h2 className="typo-title-1-bold mb-6">타이포그래피</h2>
          <div className="grid gap-4 p-6 rounded-10 bg-white border border-border">
            <h1 className="typo-title-large-bold">Display Large (32px Bold)</h1>
            <h2 className="typo-title-1-bold">Title 1 (28px Bold)</h2>
            <h3 className="typo-title-2-semibold">Title 2 (22px Bold)</h3>
            <h4 className="typo-title-3-bold">Title 3 (20px Bold)</h4>
            <p className="typo-headline-bold">Headline (18px Bold)</p>
            <p className="typo-body-1-semibold">Body 1 Semibold (16px Semibold)</p>
            <p className="typo-body-1-medium">Body 1 Medium (16px Medium)</p>
            <p className="typo-body-1-regular">Body 1 Regular (16px Regular)</p>
            <p className="typo-body-1-long-medium">Body 1 Long Medium (16px Medium, 170% 행간)</p>
          </div>
        </section>
        {/* 아바타 섹션 */}
        <section className="w-full">
          <h2 className="typo-title-1-bold mb-6">아바타 (Avatar)</h2>
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="/profile.svg" />
              <AvatarFallback>empty profile</AvatarFallback>
            </Avatar>
          </div>
        </section>
        {/* 좋아요 버튼 섹션 */}
        <section className="w-full">
          <h2 className="typo-title-1-bold mb-6">좋아요 버튼</h2>
          <div className="flex gap-4 items-center">
            <LikeButton postId={1} liked={false} likeCount={0} />
            <span className="typo-body-1-medium">클릭해서 좋아요를 표시</span>
          </div>
        </section>
        {/* 버튼(Button) 섹션 */}
        <section className="w-full">
          <h2 className="typo-title-1-bold mb-6">버튼 (Button)</h2>
          <div className="grid gap-4 p-6 rounded-10 bg-white border border-border">
            <Button>CTA Button</Button>
            <Button disabled> CTA Button (Disabled)</Button>
          </div>
        </section>
        {/* 바텀시트 섹션 */}
        <section className="w-full">
          <h2 className="typo-title-1-bold mb-6">바텀시트 (Bottom Sheet)</h2>
          <div className="flex flex-wrap gap-4">
            {/* <BottomSheet trigger={<Button>기본 바텀시트</Button>} title="바텀 시트 제목">
              <p className="text-label-info typo-body-2-medium">
                버튼을 눌러 디자이너에게만 공개할 수 있어요
              </p>
              <Image
                className="h-43 w-82 object-cover"
                src="/sample.png"
                alt="온보딩 이미지"
                width={384}
                height={192}
              />
            </BottomSheet>
            <BottomSheet
              trigger={<Button>바텀시트 커스텀</Button>}
              title="바텀시트 커스텀"
              description="기본 설정에서 변형하고 싶을 경우 className을 사용해 커스텀"
              showCloseButton={false}
              footerContent={
                <div className="flex gap-2 w-full">
                  <DrawerClose asChild>
                    <Button variant="default" className="flex-1">
                      취소
                    </Button>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Button className="flex-1">확인</Button>
                  </DrawerClose>
                </div>
              }
            >
              바텀시트 커스텀 예시
            </BottomSheet> */}
          </div>
        </section>
        {/* 글쓰기 버튼 */}
        <section className="w-full">
          <h2 className="typo-title-1-bold mb-6">글쓰기 버튼</h2>
          <div className="grid gap-4 p-6 rounded-10 bg-white border border-border">
            <WritePostButton />
          </div>
        </section>
        {/* 토글 칩스 섹션 */}
        <section className="w-full">
          <h2 className="typo-title-1-bold mb-6">토글 가능한 칩스</h2>
          <div className="p-6 rounded-10 bg-white border border-border">
            <ToggleChipGroup>
              <ToggleChip
                icon={
                  <RecentIcon className="size-5 fill-label-sub group-data-[state=on]:fill-white" />
                }
              >
                최신글
              </ToggleChip>
              <ToggleChip
                icon={
                  <PopularIcon className="size-5 fill-label-sub group-data-[state=on]:fill-white" />
                }
              >
                인기글
              </ToggleChip>

              <ToggleChip
                icon={
                  <UserIcon className="size-5 fill-label-sub group-data-[state=on]:fill-white" />
                }
              >
                내 상담글
              </ToggleChip>
              <ToggleChip icon={<CommentIcon className="size-5 fill-positive" />}>
                댓글 단 글
              </ToggleChip>
              <ToggleChip icon={<HeartIcon className="size-5 fill-negative-light" />}>
                좋아한 글
              </ToggleChip>
            </ToggleChipGroup>
          </div>
        </section>
        {/* chat input 컴포넌트 */}
        <ChatExamples />
        {/* 반경(Radius) 섹션 */}
        <section className="w-full">
          <h2 className="typo-title-1-bold mb-6">반경 (Radius)</h2>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-0 bg-positive mb-2"></div>
              <span className="typo-body-2-medium">rounded-0</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-4 bg-positive mb-2"></div>
              <span className="typo-body-2-medium">rounded-4</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-10 bg-positive mb-2"></div>
              <span className="typo-body-2-medium">rounded-10</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-positive mb-2"></div>
              <span className="typo-body-2-medium">rounded-full</span>
            </div>
          </div>
        </section>
        {/* 투명도(Opacity) 섹션 */}
        <section className="w-full">
          <h2 className="typo-title-1-bold mb-6">투명도 (Opacity)</h2>
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-6 bg-positive opacity-20 mb-2"></div>
              <span className="typo-body-2-medium">opacity-20</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-6 bg-positive opacity-40 mb-2"></div>
              <span className="typo-body-2-medium">opacity-40</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-6 bg-positive opacity-60 mb-2"></div>
              <span className="typo-body-2-medium">opacity-60</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-6 bg-positive opacity-80 mb-2"></div>
              <span className="typo-body-2-medium">opacity-80</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-6 bg-positive opacity-100 mb-2"></div>
              <span className="typo-body-2-medium">opacity-100</span>
            </div>
          </div>
        </section>
        {/* 반응형 */}
        <section className="w-full">
          <h2 className="typo-title-1-bold mb-6">반응형</h2>
          <div className="rounded-6 bg-white border border-border p-6">
            <p className="typo-body-2-medium sm:typo-body-1-medium md:typo-headline-bold lg:typo-title-3-bold">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum
              dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit
              amet consectetur adipisicing elit. Quisquam, quos.
            </p>
          </div>
        </section>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Loader Examples</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Sizes</h3>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <Loader size="sm" theme="short" />
                  <p className="text-xs mt-1">Small</p>
                </div>
                <div className="text-center">
                  <Loader size="md" theme="short" />
                  <p className="text-xs mt-1">Medium</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Themes</h3>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="bg-white p-4 rounded">
                    <Loader theme="dark" size="md" />
                  </div>
                  <p className="text-xs mt-1">Dark Theme</p>
                </div>
                <div className="text-center">
                  <div className="bg-gray-900 p-4 rounded">
                    <Loader theme="light" size="md" />
                  </div>
                  <p className="text-xs mt-1">Light Theme</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Variants</h3>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <Loader theme="dark" size="md" />
                  <p className="text-xs mt-1">Default</p>
                </div>
                <div className="text-center">
                  <Loader theme="light" size="md" />
                  <p className="text-xs mt-1">Short</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Custom Speed</h3>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <Loader speed={0.5} size="md" theme="short" />
                  <p className="text-xs mt-1">Slow (0.5x)</p>
                </div>
                <div className="text-center">
                  <Loader speed={2} size="md" theme="short" />
                  <p className="text-xs mt-1">Fast (2x)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
