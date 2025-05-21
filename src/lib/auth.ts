
import { User, UserRole } from '@/types';

// Mock user database for fallback
const fallbackUsers: User[] = [
  {
    id: 'c7a22ea6-6fcb-40cc-8515-7f54ce47cd39',
    firstName: 'Vishwanath',
    lastName: 'Mallenahalli',
    email: 'vishwanath.mallenahalli@zentience.co',
    role: 'app-owner'
  },
  {
    id: '7a1c5c8d-6b2f-4e3a-8d9c-1f3a6b2c5d4e',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@trustchain.com',
    role: 'admin'
  },
  {
    id: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
    firstName: 'Data',
    lastName: 'Steward',
    email: 'steward@trustchain.com',
    role: 'data-steward'
  }
];

// Local storage functions for user sessions
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('trustchain_user');
  return userJson ? JSON.parse(userJson) : null;
};

export const setCurrentUser = (user: User): void => {
  localStorage.setItem('trustchain_user', JSON.stringify(user));
};

export const clearCurrentUser = (): void => {
  localStorage.removeItem('trustchain_user');
};

// Login function that uses mock data instead of API call
export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    // For demo purposes, check if we're in a deployed environment or localhost
    const isDeployed = !window.location.hostname.includes('localhost') && 
                       !window.location.hostname.includes('127.0.0.1');
    
    // Only try the API call if we're in development on localhost
    if (!isDeployed) {
      try {
        const response = await fetch('http://127.0.0.1:3055/api/trustchain/v1/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const userData = await response.json();
          
          // Transform API response to match our User type
          const user: User = {
            id: userData.id || crypto.randomUUID(),
            firstName: userData.firstName || userData.first_name || '',
            lastName: userData.lastName || userData.last_name || '',
            email: userData.email,
            role: (userData.role as UserRole) || 'app-owner'
          };
          
          setCurrentUser(user);
          return user;
        }
      } catch (error) {
        console.error('API login error:', error);
        // Fall through to mock login if API fails
      }
    }
    
    // Mock login for both development and production
    console.log('Using mock login for authentication');
    const mockUser = fallbackUsers.find(u => u.email === email);
    if (mockUser) {
      setCurrentUser(mockUser);
      return mockUser;
    }
    
    throw new Error('Invalid email or password');
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Register function using mock data instead of API
export const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role: UserRole
): Promise<User> => {
  try {
    // For demo purposes, check if we're in a deployed environment
    const isDeployed = !window.location.hostname.includes('localhost') && 
                       !window.location.hostname.includes('127.0.0.1');
    
    // Only try the API call if we're in development on localhost
    if (!isDeployed) {
      try {
        const response = await fetch('http://127.0.0.1:4079/trustchain/v1/user/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
            role
          }),
        });

        if (response.ok) {
          const userData = await response.json();
          
          // Transform API response to match our User type
          const user: User = {
            id: userData.id || crypto.randomUUID(),
            firstName: userData.firstName || userData.first_name || '',
            lastName: userData.lastName || userData.last_name || '',
            email: userData.email,
            role: (userData.role as UserRole) || role
          };
          
          setCurrentUser(user);
          return user;
        }
      } catch (error) {
        console.error('API registration error:', error);
        // Fall through to mock registration if API fails
      }
    }
    
    // Mock registration for both development and production
    console.log('Using mock registration');
    // Check if user already exists in mock data
    if (fallbackUsers.some(u => u.email === email)) {
      throw new Error('User with this email already exists');
    }
    
    const newUser: User = {
      id: crypto.randomUUID(),
      firstName,
      lastName,
      email,
      role
    };
    
    setCurrentUser(newUser);
    return newUser;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Logout function
export const logoutUser = (): void => {
  clearCurrentUser();
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getCurrentUser();
};

// Check if user has required role
export const hasRole = (requiredRoles: UserRole[]): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  
  return requiredRoles.includes(user.role);
};

// Generate access token
export const generateAccessToken = (): string => {
  return crypto.randomUUID();
};

// Export UserRole for external use
export type { UserRole };
