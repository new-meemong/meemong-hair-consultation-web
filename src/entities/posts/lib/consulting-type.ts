import { CONSULTING_TYPE } from '../constants/consulting-type';
import type { PostDetail } from '../model/post-detail';

export function isConsultingPost(post: PostDetail): boolean {
  return post.consultType === CONSULTING_TYPE.CONSULTING;
}
