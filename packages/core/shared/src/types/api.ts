// ============================================================
// API response envelope — consistent across all endpoints
// ============================================================

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export const apiSuccess = <T>(data: T): ApiSuccess<T> => ({ success: true, data });

export const apiError = (
  code: string,
  message: string,
  details?: Record<string, unknown>,
): ApiError => ({
  success: false,
  error: { code, message, ...(details !== undefined ? { details } : {}) },
});
