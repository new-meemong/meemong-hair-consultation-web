import type { ExperienceGroup } from "@/entities/experience-group/model/experience-group";
import type { SelectedRegion } from "@/features/region/types/selected-region";
import { DEFAULT_LIMIT } from "@/shared/api/constants/default-limit";
import useCursorInfiniteQuery from "@/shared/api/hooks/use-cursor-infinite-query";
import convertToAddresses from "@/shared/api/lib/convert-to-addresses";
import type { PagingQueryParams } from "@/shared/api/types/paging-query-params";

const GET_EXPERIENCE_LIST_QUERY_ENDPOINT = `experience-groups`;
export const getExperienceListQueryKeyPrefix = () => GET_EXPERIENCE_LIST_QUERY_ENDPOINT;
    
type GetExperienceGroupsQueryParams = PagingQueryParams & {
  isMine?: boolean;
  isLiked?: boolean;
  selectedRegion: SelectedRegion | null;
};

export default function useGetExperienceGroups(params: GetExperienceGroupsQueryParams) {
  const { __limit = DEFAULT_LIMIT, isMine, isLiked, selectedRegion } = params;
  
  return useCursorInfiniteQuery<ExperienceGroup>({
    endpoint: GET_EXPERIENCE_LIST_QUERY_ENDPOINT,
    queryKey: [getExperienceListQueryKeyPrefix(), params],
    __limit,
    additionalParams: {
      isMine,
      isLiked,
      addresses: convertToAddresses(selectedRegion),
    },
  });
}