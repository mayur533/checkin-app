export interface UserData {
  name: string;
  reservationId: string;
  date?: string;
  time?: string;
  email?: string;
  phone?: string;
}

export interface ApiSuccessResponse {
  success: true;
  user: UserData;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

export type RootStackParamList = {
  Scanner: undefined;
  Success: { user: UserData };
  Failed: { message: string };
};

