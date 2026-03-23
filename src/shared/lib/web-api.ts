import { API_BASE_URL } from '@/shared/api/client';
import ky from 'ky';

/**
 * web_user_data token 기반 인증 API 클라이언트 팩토리
 * Phase 3 WebAuthProvider 도입 전까지 사용
 */
export function createWebApiClient(token: string) {
  const api = ky.create({
    prefixUrl: `${API_BASE_URL}/api/v1`,
    headers: {
      Authorization: token,
      platform: 'HAIR_CONSULTING_WEB',
      'web-version': '1.1.1',
    },
    timeout: 30000,
    hooks: {
      beforeRequest: [
        (request) => {
          console.group('🚀 API Request (Web Auth)');
          console.log('URL:', request.url);
          console.log('Method:', request.method);
          console.log('Headers:', Object.fromEntries(request.headers.entries()));

          const url = new URL(request.url);
          if (url.searchParams.toString()) {
            console.log('Query Params:', Object.fromEntries(url.searchParams.entries()));
          }

          if (request.body) {
            request
              .clone()
              .text()
              .then((body) => {
                if (body) {
                  try {
                    console.log('Request Body:', JSON.parse(body));
                  } catch {
                    console.log('Request Body (raw):', body);
                  }
                }
              })
              .catch(() => {
                console.log('Request Body: [Unable to read]');
              });
          }
          console.groupEnd();
        },
      ],
      afterResponse: [
        async (request, _options, response) => {
          console.group('✅ API Response (Web Auth)');
          console.log('URL:', request.url);
          console.log('Method:', request.method);
          console.log('Status:', response.status, response.statusText);
          console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

          try {
            const body = await response.clone().text();
            if (body) {
              try {
                console.log('Response Body:', JSON.parse(body));
              } catch {
                console.log('Response Body (raw):', body);
              }
            }
          } catch (error) {
            console.log('Response Body: [Unable to read]', error);
          }
          console.groupEnd();
        },
      ],
      beforeError: [
        async (error) => {
          const response = error.response;
          console.group('❌ API Error (Web Auth)');
          console.log('URL:', error.request?.url);
          console.log('Method:', error.request?.method);
          console.log('Status:', response?.status, response?.statusText);
          console.log('Error Message:', error.message);

          if (response?.body) {
            try {
              const errorData = await response.clone().json();
              console.log('Error Response Body:', errorData);
            } catch {
              console.log('Error Response Body: [Unable to read]');
            }
          }
          console.groupEnd();
          return error;
        },
      ],
    },
  });

  return {
    async get<T>(
      endpoint: string,
      options?: { searchParams?: Record<string, string> },
    ): Promise<T> {
      const res = await api
        .get(endpoint, { searchParams: options?.searchParams })
        .json<{ data: T }>();
      return res.data;
    },
    async patch(endpoint: string, data: unknown): Promise<void> {
      await api.patch(endpoint, { json: data });
    },
  };
}
