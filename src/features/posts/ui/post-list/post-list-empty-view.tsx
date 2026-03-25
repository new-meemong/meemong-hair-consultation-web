import ErrorIcon from '@/assets/icons/error.svg';
import { POST_LIST_TAB } from '../../constants/post-list-tabs';
import type { PostListTab } from '../../types/post-list-tab';
import { USER_ROLE } from '@/entities/user/constants/user-role';
import { useOptionalAuthContext } from '@/features/auth/context/auth-context';

type PostListEmptyViewProps = {
  tab: PostListTab;
};

export default function PostListEmptyView({ tab }: PostListEmptyViewProps) {
  const auth = useOptionalAuthContext();
  const userRole = auth?.user.role ?? USER_ROLE.MODEL;

  return (
    <div className="flex flex-col gap-2 items-center justify-center pt-30">
      <ErrorIcon className="size-7 fill-label-info" />
      <p className="typo-body-1-medium text-label-placeholder">
        {POST_LIST_TAB[tab].getEmptyText(userRole)}
      </p>
    </div>
  );
}
