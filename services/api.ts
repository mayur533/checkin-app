import axios from 'axios';
import { ApiResponse } from '../types';

// Change this to your backend URL
const API_BASE_URL = 'http://localhost:3000/api';

// Set to true for testing without backend
const MOCK_MODE = true;

// Counter to alternate between success and failed
let scanCounter = 0;

export const checkInReservation = async (qrData: string): Promise<ApiResponse> => {
  // Mock mode for testing
  if (MOCK_MODE) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Alternate between success and failed
    scanCounter++;
    const isSuccess = scanCounter % 2 === 1; // Odd = success, Even = failed
    
    if (isSuccess) {
      return {
        success: true,
        user: {
          name: 'John Doe',
          reservationId: 'RES123',
          date: '2025-11-05',
          time: '14:00',
          email: 'john@example.com',
          phone: '+1234567890'
        },
        message: 'Check-in successful'
      };
    } else {
      // Simulate failure
      return {
        success: false,
        message: 'Reservation not found'
      };
    }
  }

  // Real API call
  try {
    const response = await axios.post<ApiResponse>(`${API_BASE_URL}/check-in`, {
      qrData,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse;
    }
    return {
      success: false,
      message: 'Network error. Please check your connection.',
    };
  }
};

