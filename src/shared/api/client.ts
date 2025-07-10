import ky from 'ky';
import { getAuthTokenData } from '../lib/auth';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

const createApiInstance = () => {
  const authTokenData = getAuthTokenData();
  const token = authTokenData?.token;

  return ky.create({
    prefixUrl: `${API_BASE_URL}/api/v1`,
    headers: {
      'Content-Type': 'application/json',
    },
    hooks: {
      beforeRequest: [
        (request) => {
          if (token) {
            request.headers.set('Authorization', `${token}`);
          }
        },
      ],
      beforeError: [
        async (error) => {
          const { response } = error;
          if (response && response.body) {
            try {
              const errorData = (await response.json()) as { message?: string };
              error.message = errorData.message || `API Error: ${response.status}`;
            } catch {
              error.message = `API Error: ${response.status}`;
            }
          }
          return error;
        },
      ],
    },
    timeout: 30000,
  });
};

export class ApiClient {
  private api = createApiInstance();

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.api.get(endpoint).json<ApiResponse<T>>();
  }

  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.api.post(endpoint, { json: data }).json<ApiResponse<T>>();
  }

  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.api.put(endpoint, { json: data }).json<ApiResponse<T>>();
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.api.delete(endpoint).json<ApiResponse<T>>();
  }

  // 파일 업로드용 메서드
  async postFormData<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    return this.api
      .post(endpoint, {
        body: formData,
        headers: {
          // Content-Type을 제거하여 브라우저가 자동으로 multipart/form-data를 설정하도록 함
        },
      })
      .json<ApiResponse<T>>();
  }
}

// 기본 인스턴스는 토큰 없이 생성
export const apiClient = new ApiClient();
