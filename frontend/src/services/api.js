// API service for backend communication
// Handles authentication, authorization, and API requests

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Get stored auth token from localStorage
 */
const getToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Set auth token in localStorage
 */
export const setToken = (token) => {
  localStorage.setItem('authToken', token);
};

/**
 * Remove auth token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem('authToken');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Generic API request handler
 * Automatically attaches JWT token to requests
 * Handles 401 errors and redirects to login
 */
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // Attach token if available
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      removeToken();
      window.location.href = '/login';
      throw new Error('Unauthorized - Please login again');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ============= AUTH API =============

export const authAPI = {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  register: async (email, password) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return data;
  },

  /**
   * Login user
   * POST /api/auth/login
   */
  login: async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Store token after successful login
    if (data.data?.token) {
      setToken(data.data.token);
    }
    
    return data;
  },
};

// ============= TRADES API =============

/**
 * Normalize trade data for backend
 * Maps frontend field names to backend field names
 */
const normalizeTradeForBackend = (trade) => {
  const normalized = { ...trade };
  
  // Map profitLoss to pnl (backend uses pnl)
  if (normalized.profitLoss !== undefined) {
    normalized.pnl = normalized.profitLoss;
    delete normalized.profitLoss;
  }
  
  // Remove frontend-only fields
  delete normalized.id; // Backend uses _id
  delete normalized.isWin;
  delete normalized.isLoss;
  
  return normalized;
};

export const tradesAPI = {
  /**
   * Get all trades for authenticated user
   * GET /api/trades
   */
  getAll: async () => {
    const data = await apiRequest('/trades');
    return data.data || [];
  },

  /**
   * Create a new trade
   * POST /api/trades
   */
  create: async (trade) => {
    const normalizedTrade = normalizeTradeForBackend(trade);
    const data = await apiRequest('/trades', {
      method: 'POST',
      body: JSON.stringify(normalizedTrade),
    });
    return data.data;
  },

  /**
   * Update a trade
   * PUT /api/trades/:id
   */
  update: async (id, trade) => {
    const normalizedTrade = normalizeTradeForBackend(trade);
    const data = await apiRequest(`/trades/${id}`, {
      method: 'PUT',
      body: JSON.stringify(normalizedTrade),
    });
    return data.data;
  },

  /**
   * Delete a trade
   * DELETE /api/trades/:id
   */
  delete: async (id) => {
    const data = await apiRequest(`/trades/${id}`, {
      method: 'DELETE',
    });
    return data;
  },
};

// ============= REFLECTIONS API =============

export const reflectionsAPI = {
  /**
   * Get all reflections for authenticated user
   * GET /api/reflections
   */
  getAll: async () => {
    const data = await apiRequest('/reflections');
    return data.data || [];
  },

  /**
   * Create a new reflection
   * POST /api/reflections
   */
  create: async (reflection) => {
    const data = await apiRequest('/reflections', {
      method: 'POST',
      body: JSON.stringify(reflection),
    });
    return data.data;
  },

  /**
   * Update a reflection
   * PUT /api/reflections/:id
   */
  update: async (id, reflection) => {
    const data = await apiRequest(`/reflections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reflection),
    });
    return data.data;
  },

  /**
   * Delete a reflection
   * DELETE /api/reflections/:id
   */
  delete: async (id) => {
    const data = await apiRequest(`/reflections/${id}`, {
      method: 'DELETE',
    });
    return data;
  },
};

// ============= RULES API =============

export const rulesAPI = {
  /**
   * Get all rules for authenticated user
   * GET /api/rules
   */
  getAll: async () => {
    const data = await apiRequest('/rules');
    return data.data || [];
  },

  /**
   * Create a new rule
   * POST /api/rules
   */
  create: async (rule) => {
    const data = await apiRequest('/rules', {
      method: 'POST',
      body: JSON.stringify(rule),
    });
    return data.data;
  },

  /**
   * Update a rule
   * PUT /api/rules/:id
   */
  update: async (id, rule) => {
    const data = await apiRequest(`/rules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(rule),
    });
    return data.data;
  },

  /**
   * Delete a rule
   * DELETE /api/rules/:id
   */
  delete: async (id) => {
    const data = await apiRequest(`/rules/${id}`, {
      method: 'DELETE',
    });
    return data;
  },
};

export default apiRequest;
