import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const response = await fetch(url);
    const blob = await response.blob();

    // Content-Type 헤더 설정
    const headers = new Headers();
    headers.set('Content-Type', response.headers.get('Content-Type') || 'application/octet-stream');
    headers.set('Content-Disposition', 'attachment');

    return new NextResponse(blob, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('이미지 다운로드 중 오류가 발생했습니다:', error);
    return NextResponse.json({ error: '이미지 다운로드에 실패했습니다.' }, { status: 500 });
  }
}
