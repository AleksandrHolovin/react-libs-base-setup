export type PayloadError = {
  key: string;
  message: string;
};

export type PayloadMessage = {
  title: string;
  message: string;
};

export interface ApiResponse<T> {
  value: T;
  status: number;
  success: boolean;
  errors: PayloadError[];
  messages: PayloadMessage[];
}

export interface ApiResponseEmpty {
  status: number;
  success: boolean;
  errors: PayloadError[];
  messages: PayloadMessage[];
}

export type SagaError = {errors: PayloadError[]} | string;
