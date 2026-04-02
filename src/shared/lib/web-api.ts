import {
  API_BASE_URL,
  AUTH_TOKEN_EXPIRED_EVENT,
  type ApiError,
  type ApiListResponse,
} from '@/shared/api/client';
import { WEB_USER_DATA_KEY } from '@/shared/constants/local-storage';
import ky, { type HTTPError } from 'ky';

/**
 * web_user_data token 기반 인증 API 클라이언트 팩토리
 * Phase 3 WebAuthProvider 도입 전까지 사용
 */
export function createWebApiClient(token: string, slug?: string) {
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
          if (process.env.NODE_ENV !== 'development') return;

          const headers = Object.fromEntries(request.headers.entries());
          if (headers['authorization']) {
            headers['authorization'] = '[REDACTED]';
          }

          console.group('🚀 Web API Request');
          console.log('URL:', request.url);
          console.log('Method:', request.method);
          console.log('Headers:', headers);

          const url = new URL(request.url);
          if (url.searchParams.toString()) {
            console.log('Query Params:', Object.fromEntries(url.searchParams.entries()));
          }

          if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
            request
              .clone()
              .text()
              .then((body) => {
                if (body) {
                  try {
                    const parsedBody = JSON.parse(body);
                    console.log('Request Body:', parsedBody);
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
          if (process.env.NODE_ENV !== 'development') return response;

          console.group('✅ Web API Response');
          console.log('URL:', request.url);
          console.log('Method:', request.method);
          console.log('Status:', response.status, response.statusText);

          try {
            const responseClone = response.clone();
            const body = await responseClone.text();
            if (body) {
              try {
                const parsedBody = JSON.parse(body);
                console.log('Response Body:', parsedBody);
              } catch {
                console.log('Response Body (raw):', body);
              }
            }
          } catch (error) {
            console.log('Response Body: [Unable to read]', error);
          }
          console.groupEnd();

          return response;
        },
      ],
      beforeError: [
        async (error: HTTPError) => {
          const { response } = error;

          if (process.env.NODE_ENV === 'development') {
            console.group('❌ Web API Error');
            console.log('URL:', error.request?.url);
            console.log('Method:', error.request?.method);
            console.log('Status:', response?.status, response?.statusText);
            console.log('Error Message:', error.message);
          }

          if (response?.status === 403 && typeof window !== 'undefined' && slug) {
            localStorage.removeItem(WEB_USER_DATA_KEY(slug));
            window.dispatchEvent(new CustomEvent(AUTH_TOKEN_EXPIRED_EVENT));
          }

          if (response && response.body) {
            try {
              const errorData = (await response.clone().json()) as {
                error?: ApiError;
                message?: string;
              };

              if (process.env.NODE_ENV === 'development') {
                console.log('Error Response Body:', errorData);
              }

              const serverMessage = errorData.error?.message ?? errorData.message;
              if (serverMessage) {
                error.message = serverMessage;
              }

              Object.defineProperty(error, 'response', {
                value: Object.assign(response, {
                  data: errorData,
                }),
                enumerable: true,
                configurable: true,
              });
            } catch (parseError) {
              if (process.env.NODE_ENV === 'development') {
                console.error('Error parsing Web API error response:', parseError);
              }
            }
          }

          if (process.env.NODE_ENV === 'development') {
            console.groupEnd();
          }

          return error;
        },
      ],
    },
  });

  return {
    async get<T>(
      endpoint: string,
      options?: { searchParams?: Record<string, string | number | boolean | string[] | number[]> },
    ): Promise<T> {
      let searchParams: URLSearchParams | undefined;
      if (options?.searchParams) {
        searchParams = new URLSearchParams();
        for (const [key, value] of Object.entries(options.searchParams)) {
          if (Array.isArray(value)) {
            value.forEach((v) => searchParams!.append(key, String(v)));
          } else {
            searchParams.set(key, String(value));
          }
        }
      }
      const res = await api.get(endpoint, { searchParams }).json<{ data: T }>();
      return res.data;
    },
    async getList<T extends Record<string, unknown>>(
      endpoint: string,
      options?: { searchParams?: URLSearchParams },
    ): Promise<ApiListResponse<T>> {
      return api.get(endpoint, { searchParams: options?.searchParams }).json<ApiListResponse<T>>();
    },
    async getRaw<T>(
      endpoint: string,
      options?: { searchParams?: Record<string, string | number | boolean | string[] | number[]> },
    ): Promise<T> {
      let searchParams: URLSearchParams | undefined;
      if (options?.searchParams) {
        searchParams = new URLSearchParams();
        for (const [key, value] of Object.entries(options.searchParams)) {
          if (Array.isArray(value)) {
            value.forEach((v) => searchParams!.append(key, String(v)));
          } else {
            searchParams.set(key, String(value));
          }
        }
      }
      return api.get(endpoint, { searchParams }).json<T>();
    },
    async post<T>(endpoint: string, data: unknown): Promise<T> {
      const res = await api.post(endpoint, { json: data }).json<{ data: T }>();
      return res.data;
    },
    async patch(endpoint: string, data: unknown): Promise<void> {
      await api.patch(endpoint, { json: data });
    },
    async delete(endpoint: string): Promise<void> {
      await api.delete(endpoint);
    },
  };
}
