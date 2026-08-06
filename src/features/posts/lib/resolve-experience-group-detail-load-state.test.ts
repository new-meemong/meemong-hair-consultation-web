import { describe, expect, it } from 'vitest';

import { resolveExperienceGroupDetailLoadState } from './resolve-experience-group-detail-load-state';

describe('resolveExperienceGroupDetailLoadState', () => {
  it('조회 중과 정상 데이터를 구분한다', () => {
    expect(
      resolveExperienceGroupDetailLoadState({
        isPending: true,
        isError: false,
        error: null,
        hasData: false,
      }),
    ).toBe('loading');
    expect(
      resolveExperienceGroupDetailLoadState({
        isPending: false,
        isError: false,
        error: null,
        hasData: true,
      }),
    ).toBe('ready');
  });

  it('삭제된 게시글의 404를 별도 상태로 분류한다', () => {
    expect(
      resolveExperienceGroupDetailLoadState({
        isPending: false,
        isError: true,
        error: { httpCode: 404, code: 'NOT_FOUND', message: '게시글을 찾을 수 없습니다.' },
        hasData: false,
      }),
    ).toBe('notFound');
  });

  it('그 밖의 조회 실패는 재시도 가능한 오류로 분류한다', () => {
    expect(
      resolveExperienceGroupDetailLoadState({
        isPending: false,
        isError: true,
        error: { httpCode: 500, code: 'SERVER_ERROR', message: '서버 오류' },
        hasData: false,
      }),
    ).toBe('error');
  });
});
