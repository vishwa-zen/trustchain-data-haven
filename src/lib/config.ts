
/**
 * API Configuration
 * This file centralizes all API endpoint URLs for easier maintenance
 */

const API_BASE_URL = "http://127.0.0.1:3056/api/trustchain/v1";

export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    logout: `${API_BASE_URL}/auth/logout`,
    passwordReset: `${API_BASE_URL}/auth/password-reset`,
    verifyToken: `${API_BASE_URL}/auth/verify-token`,
  },
  
  // User management
  users: {
    getAll: `${API_BASE_URL}/users`,
    getById: (userId: string) => `${API_BASE_URL}/users/${userId}`,
    update: (userId: string) => `${API_BASE_URL}/users/${userId}`,
    delete: (userId: string) => `${API_BASE_URL}/users/${userId}`,
  },
  
  // Applications
  applications: {
    getAll: `${API_BASE_URL}/applications`,
    getById: (appId: string) => `${API_BASE_URL}/applications/${appId}`,
    create: `${API_BASE_URL}/applications`,
    update: (appId: string) => `${API_BASE_URL}/applications/${appId}`,
    delete: (appId: string) => `${API_BASE_URL}/applications/${appId}`,
  },
  
  // Vaults
  vaults: {
    getAll: `${API_BASE_URL}/vaults`,
    getById: (vaultId: string) => `${API_BASE_URL}/vaults/${vaultId}`,
    create: `${API_BASE_URL}/vaults`,
    update: (vaultId: string) => `${API_BASE_URL}/vaults/${vaultId}`,
    delete: (vaultId: string) => `${API_BASE_URL}/vaults/${vaultId}`,
  },
  
  // Tokens
  tokens: {
    tokenize: `${API_BASE_URL}/tokens/tokenize`,
    detokenize: `${API_BASE_URL}/tokens/detokenize`,
  }
};

/**
 * Get the base URL for the API
 */
export const getApiBaseUrl = () => API_BASE_URL;

/**
 * Helper to build custom API URLs if needed
 */
export const buildApiUrl = (path: string) => `${API_BASE_URL}${path}`;

/**
 * Environment detection helpers
 */
export const isLocalhost = () => 
  window.location.hostname.includes('localhost') || 
  window.location.hostname.includes("192.168.0.104") ||
  window.location.hostname.includes('127.0.0.1');

export const isProduction = () => !isLocalhost();
