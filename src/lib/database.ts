// MySQL Database Configuration
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000/api';

export const dbConfig = {
  apiUrl: API_BASE_URL,
  endpoints: {
    employees: '/employees',
    attendance: '/attendance'
  }
};

// Generic API helper function
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};