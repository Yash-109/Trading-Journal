/**
 * Evaluation API Service
 * Handles communication with trade evaluation endpoints
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Handle API response and extract data
 * @param {Response} response - Fetch response
 * @returns {Promise<Object>} Response data
 */
async function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  
  // Check if response is JSON
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Server returned non-JSON response');
  }

  const data = await response.json();

  // Check if request was successful
  if (!response.ok) {
    const errorMessage = data.error || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  // Check API success flag
  if (data.success === false) {
    throw new Error(data.error || 'API request failed');
  }

  return data.data;
}

/**
 * Evaluate a single trade
 * @param {Object} trade - Trade object
 * @returns {Promise<Object>} Evaluation result
 */
export async function evaluateTrade(trade) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/evaluate/trade`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ trade }),
    });

    return await handleResponse(response);
  } catch (error) {
    // Re-throw with more context if it's a network error
    if (error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    }
    throw error;
  }
}

/**
 * Evaluate multiple trades as a session
 * @param {Array} trades - Array of trade objects
 * @returns {Promise<Object>} Session evaluation result
 */
export async function evaluateSession(trades) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/evaluate/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ trades }),
    });

    return await handleResponse(response);
  } catch (error) {
    // Re-throw with more context if it's a network error
    if (error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    }
    throw error;
  }
}
