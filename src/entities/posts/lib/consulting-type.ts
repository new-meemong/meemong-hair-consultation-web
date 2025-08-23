import { CONSULT_TYPE } from '../constants/consult-type';
import type { PostDetail } from '../model/post-detail';

export function isConsultingPost(post: PostDetail): boolean {
  return post.consultType === CONSULT_TYPE.CONSULTING;
}
