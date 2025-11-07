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
  message: string;
  attendedAt?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Array<{
    msg: string;
    param: string;
    location: string;
  }>;
}

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

export interface ScanHistoryItem {
  id: string;
  qrToken: string;
  success: boolean;
  message: string;
  attendedAt?: string;
  timestamp: string;
}

export type RootStackParamList = {
  Scanner: undefined;
  Success: { message: string; attendedAt?: string };
  Failed: { message: string };
  History: undefined;
};

