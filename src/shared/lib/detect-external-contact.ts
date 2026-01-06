/**
 * 댓글에 외부 연락처가 포함되어 있는지 감지하는 함수
 * 인스타그램, 카카오톡, 전화번호, 이메일 등을 감지합니다.
 */
export function detectExternalContact(content: string): boolean {
  if (!content || content.trim().length === 0) {
    return false;
  }

  const normalizedContent = content.toLowerCase().replace(/\s/g, '');

  // 인스타그램 관련 패턴
  const instagramPatterns = [
    /@[\w.]+/g, // @username
    /instagram\.com\/[\w.]+/gi,
    /insta\.com\/[\w.]+/gi,
    /인스타/gi,
    /인스타그램/gi,
    /ig[\s:]*@?[\w.]+/gi,
  ];

  // 카카오톡 관련 패턴
  const kakaoPatterns = [
    /카톡/gi,
    /카카오톡/gi,
    /kakaotalk/gi,
    /오픈채팅/gi,
    /open\.kakao\.com/gi,
    /openchat/gi,
  ];

  // 전화번호 패턴 (010, 011, 016, 017, 018, 019로 시작하는 번호)
  const phonePatterns = [
    /010[-.\s]?\d{4}[-.\s]?\d{4}/g,
    /011[-.\s]?\d{3,4}[-.\s]?\d{4}/g,
    /016[-.\s]?\d{3,4}[-.\s]?\d{4}/g,
    /017[-.\s]?\d{3,4}[-.\s]?\d{4}/g,
    /018[-.\s]?\d{3,4}[-.\s]?\d{4}/g,
    /019[-.\s]?\d{3,4}[-.\s]?\d{4}/g,
    /02[-.\s]?\d{3,4}[-.\s]?\d{4}/g,
  ];

  // 이메일 패턴
  const emailPattern = /[\w.-]+@[\w.-]+\.\w+/gi;

  // 네이버 카페, 밴드 등 다른 SNS 플랫폼
  const otherSnsPatterns = [
    /네이버카페/gi,
    /naver\.cafe/gi,
    /밴드/gi,
    /band\.us/gi,
    /페이스북/gi,
    /facebook\.com/gi,
    /fb\.com/gi,
    /텔레그램/gi,
    /telegram/gi,
    /t\.me/gi,
    /라인/gi,
    /line\.me/gi,
  ];

  // 모든 패턴을 하나의 배열로 합침
  const allPatterns = [
    ...instagramPatterns,
    ...kakaoPatterns,
    ...phonePatterns,
    emailPattern,
    ...otherSnsPatterns,
  ];

  // 패턴 매칭 확인
  for (const pattern of allPatterns) {
    if (pattern.test(normalizedContent) || pattern.test(content)) {
      return true;
    }
  }

  return false;
}
