import type { InfiniteData } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';

import type { HairConsultationAnswer } from '@/entities/posts/model/hair-consultation-answer';
import { USER_ROLE } from '@/entities/user/constants/user-role';
import type { ApiListResponse } from '@/shared/api/client';

import type { ExperienceGroupCommentWithReplies } from '../model/experience-group-comment';
import type { HairConsultationCommentWithReplies } from '../model/hair-consultation-comment';
import type { PostCommentWithReplies } from '../model/post-comment';

import convertToCommentWithReplyStatusFromPostComment from './convertToCommentWithReplyStatus';
import convertToCommentWithReplyStatusFromExperienceGroup from './convertToCommentWithReplyStatusFromExperienceGroup';
import convertToCommentWithReplyStatusFromHairConsultationAnswer from './convertToCommentWithReplyStatusFromHairConsultationAnswer';
import convertToCommentWithReplyStatusFromHairConsultationComment from './convertToCommentWithReplyStatusFromHairConsultationComment';

function expectDesignerRoleWithoutAlias(user: { role?: number; Role?: number }) {
  expect(user.role).toBe(USER_ROLE.DESIGNER);
  expect('Role' in user).toBe(false);
}

describe('convertToCommentWithReplyStatus role normalization', () => {
  it('post comment 작성자의 Role 필드를 role로 정규화한다', () => {
    const data: InfiniteData<ApiListResponse<PostCommentWithReplies>> = {
      pageParams: [],
      pages: [
        {
          dataCount: 1,
          dataList: [
            {
              id: 1,
              content: '댓글',
              isVisibleToModel: false,
              createdAt: '2026-01-01T00:00:00.000Z',
              user: {
                userId: 2,
                name: '디자이너',
                profilePictureURL: null,
                companyName: null,
                Role: USER_ROLE.DESIGNER,
              },
              answerId: 1,
              isConsultingAnswer: false,
              hasAnswerImages: false,
              replies: [],
            },
          ],
        },
      ],
    };

    const comments = convertToCommentWithReplyStatusFromPostComment(data);

    expectDesignerRoleWithoutAlias(comments[0].user);
  });

  it('experience-group comment 작성자의 Role 필드를 role로 정규화한다', () => {
    const data: InfiniteData<ApiListResponse<ExperienceGroupCommentWithReplies>> = {
      pageParams: [],
      pages: [
        {
          dataCount: 1,
          dataList: [
            {
              id: 1,
              content: '댓글',
              createdAt: '2026-01-01T00:00:00.000Z',
              updatedAt: '2026-01-01T00:00:00.000Z',
              user: {
                id: 2,
                displayName: '디자이너',
                profilePictureURL: '',
                Role: USER_ROLE.DESIGNER,
              },
              isAnonymous: false,
              replies: [],
            },
          ],
        },
      ],
    };

    const comments = convertToCommentWithReplyStatusFromExperienceGroup(data, false);

    expectDesignerRoleWithoutAlias(comments[0].user);
  });

  it('hair-consultation answer 작성자의 Role 필드를 role로 정규화한다', () => {
    const data: InfiniteData<ApiListResponse<HairConsultationAnswer>> = {
      pageParams: [],
      pages: [
        {
          dataCount: 1,
          dataList: [
            {
              id: 1,
              hairConsultationId: 1,
              userId: 2,
              faceShape: null,
              isFaceShapeAdvice: null,
              bangsTypes: [],
              isBangsTypeAdvice: null,
              hairLengths: [],
              isHairLengthAdvice: null,
              hairLayers: null,
              isHairLayerAdvice: null,
              hairCurls: [],
              isHairCurlAdvice: null,
              title: '답변',
              minPrice: null,
              maxPrice: null,
              priceType: 'SINGLE',
              price: null,
              createdAt: '2026-01-01T00:00:00.000Z',
              updatedAt: '2026-01-01T00:00:00.000Z',
              user: {
                id: 2,
                displayName: '디자이너',
                profilePictureURL: null,
                Role: USER_ROLE.DESIGNER,
              },
            },
          ],
        },
      ],
    };

    const comments = convertToCommentWithReplyStatusFromHairConsultationAnswer(data);

    expectDesignerRoleWithoutAlias(comments[0].user);
  });

  it('hair-consultation comment 작성자의 Role 필드를 role로 정규화한다', () => {
    const data: InfiniteData<ApiListResponse<HairConsultationCommentWithReplies>> = {
      pageParams: [],
      pages: [
        {
          dataCount: 1,
          dataList: [
            {
              id: 1,
              content: '댓글',
              commentType: 'COMMENT',
              createdAt: '2026-01-01T00:00:00.000Z',
              updatedAt: '2026-01-01T00:00:00.000Z',
              user: {
                id: 2,
                displayName: '디자이너',
                profilePictureURL: null,
                address: null,
                companyName: null,
                Role: USER_ROLE.DESIGNER,
              },
              replies: [],
            },
          ],
        },
      ],
    };

    const comments = convertToCommentWithReplyStatusFromHairConsultationComment(data);

    expectDesignerRoleWithoutAlias(comments[0].user);
  });
});
