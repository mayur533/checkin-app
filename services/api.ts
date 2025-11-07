import axios from 'axios';
import { ApiResponse } from '../types';

// Backend URL
const API_BASE_URL = 'https://mandapam-backend-97mi.onrender.com';

// Set to true for testing without backend
const MOCK_MODE = false;

// Counter to alternate between success and failed (for mock mode)
let scanCounter = 0;

/**
 * Verify QR code and check-in attendee
 * @param qrToken - QR code token string (should start with 'EVT:')
 * @returns Promise<ApiResponse>
 */
export const checkInReservation = async (qrToken: string): Promise<ApiResponse> => {
  // Validate QR token format
  if (!qrToken || !qrToken.startsWith('EVT:')) {
    return {
      success: false,
      message: 'Invalid QR code',
    };
  }

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
        message: 'Check-in successful',
        attendedAt: new Date().toISOString(),
      };
    } else {
      return {
        success: false,
        message: 'Registration not found',
      };
    }
  }

  // Real API call
  try {
    const response = await axios.post<ApiResponse>(
      `${API_BASE_URL}/api/events/checkin`,
      {
        qrToken: qrToken,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Handle different error status codes
      const status = error.response.status;
      const data = error.response.data as ApiResponse;
      const serverMessage = data?.message || '';


      // Handle 404 - Registration not found
      if (status === 404) {
        return {
          success: false,
          message: 'Registration not found',
        };
      }

      // Handle 400 - Invalid QR token (format is correct but token is invalid)
      if (status === 400) {
        // Check if it's about invalid token format or invalid QR token
        if (serverMessage.toLowerCase().includes('invalid qr token') || 
            serverMessage.toLowerCase().includes('invalid token')) {
          return {
            success: false,
            message: 'Invalid QR code',
          };
        }
        // If it's about registration not being allowed/invited
        if (serverMessage.toLowerCase().includes('not invited') ||
            serverMessage.toLowerCase().includes('not allowed') ||
            serverMessage.toLowerCase().includes('registration not found')) {
          return {
            success: false,
            message: 'Registration not found',
          };
        }
        // Default 400 error
        return {
          success: false,
          message: serverMessage || 'Invalid QR code',
        };
      }

      // For other errors, check message content to determine appropriate response
      if (serverMessage.toLowerCase().includes('registration not found') ||
          serverMessage.toLowerCase().includes('not found')) {
        return {
          success: false,
          message: 'Registration not found',
        };
      }

      if (serverMessage.toLowerCase().includes('invalid qr token') ||
          serverMessage.toLowerCase().includes('invalid token') ||
          serverMessage.toLowerCase().includes('invalid format')) {
        return {
          success: false,
          message: 'Invalid QR code',
        };
      }

      // Return error message from server or default
      return data || {
        success: false,
        message: 'Check-in failed. Please try again.',
      };
    }

    // Network error
    return {
      success: false,
      message: 'Network error. Please check your connection.',
    };
  }
};

