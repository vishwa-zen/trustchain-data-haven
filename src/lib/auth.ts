import { User, UserRole } from '@/types';

// Mock API response delay function for consistent behavior
const mockApiDelay = (ms: number = 300) => new Promise<void>(resolve => setTimeout(resolve, ms));

// Mock user database
const mockUsers: User[] = [
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
  },
  {
    id: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
    firstName: 'CTO',
    lastName: 'User',
    email: 'cto@trustchain.com',
    role: 'cto-user'
  },
  {
    id: '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a',
    firstName: 'DPO',
    lastName: 'User',
    email: 'dpo@trustchain.com',
    role: 'dpo-user'
  },
  {
    id: '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
    firstName: 'CSIO',
    lastName: 'User',
    email: 'csio@trustchain.com',
    role: 'csio-user'
  }
];

/**
 * Session Management Functions
 */

// Get current user from session storage
export const getCurrentUser = (): User | null => {
  try {
    const userJson = localStorage.getItem('trustchain_user');
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error retrieving user from storage:', error);
    return null;
  }
};

// Set current user in session storage
export const setCurrentUser = (user: User): void => {
  try {
    localStorage.setItem('trustchain_user', JSON.stringify(user));
  } catch (error) {
    console.error('Error setting user in storage:', error);
  }
};

// Clear current user from session storage
export const clearCurrentUser = (): void => {
  try {
    localStorage.removeItem('trustchain_user');
  } catch (error) {
    console.error('Error clearing user from storage:', error);
  }
};

/**
 * User Management APIs
 */

// Get user by email
export const getUserByEmail = (email: string): User | undefined => {
  return mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
};

// Get user role by email
export const getUserRoleByEmail = (email: string): UserRole | null => {
  const user = getUserByEmail(email);
  return user ? user.role : null;
};

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
  console.log('API Call: Getting all users');
  await mockApiDelay(400);
  return [...mockUsers];
};

// Get user by ID
export const getUserById = async (id: string): Promise<User | null> => {
  console.log(`API Call: Getting user with ID ${id}`);
  await mockApiDelay(200);
  
  const user = mockUsers.find(u => u.id === id);
  return user || null;
};

// Update user profile
export const updateUserProfile = async (
  userId: string, 
  updates: Partial<Omit<User, 'id' | 'role'>>
): Promise<User | null> => {
  console.log(`API Call: Updating profile for user ${userId}`, updates);
  await mockApiDelay(500);
  
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  if (userIndex === -1) return null;
  
  const updatedUser = {
    ...mockUsers[userIndex],
    ...updates
  };
  
  // In a real implementation, this would update a database record
  
  // If this is the current logged-in user, update the session
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    setCurrentUser(updatedUser);
  }
  
  return updatedUser;
};

// Login API
export const loginUser = async (email: string, password: string): Promise<User> => {
  console.log(`API Call: Login attempt for ${email}`);
  await mockApiDelay(600);
  
  try {
    // For demo purposes, check if we're in a deployed environment or localhost
    const isDeployed = !window.location.hostname.includes('localhost') && 
                      !window.location.hostname.includes('127.0.0.1');
    
    // Only try the API call if we're in development on localhost
    if (!isDeployed) {
      try {
        console.log('Attempting to call real login API endpoint');
        const response = await fetch('http://127.0.0.1:3055/api/trustchain/v1/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          console.log('API login successful');
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
        } else {
          console.log('API login failed with status', response.status);
        }
      } catch (error) {
        console.error('API login error:', error);
        // Fall through to mock login if API fails
      }
    }
    
    // Mock login for both development and production
    console.log('Using mock login for authentication');
    const mockUser = getUserByEmail(email);
    if (mockUser) {
      // In a real implementation, we would verify the password here
      // For demo purposes, any password works
      console.log('Mock login successful');
      setCurrentUser(mockUser);
      return mockUser;
    }
    
    throw new Error('Invalid email or password');
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Register API
export const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role: UserRole
): Promise<User> => {
  console.log(`API Call: Register attempt for ${email}`);
  await mockApiDelay(800);
  
  try {
    // For demo purposes, check if we're in a deployed environment
    const isDeployed = !window.location.hostname.includes('localhost') && 
                      !window.location.hostname.includes('127.0.0.1');
    
    // Only try the API call if we're in development on localhost
    if (!isDeployed) {
      try {
        console.log('Attempting to call real register API endpoint');
        const response = await fetch('http://127.0.0.1:3056/api/trustchain/v1/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email,
            password,
            role
          }),
        });

        if (response.ok) {
          console.log('API registration successful');
          const responseData = await response.json();
          const userData = responseData.user;
          
          // Transform API response to match our User type
          const user: User = {
            id: userData.user_id || crypto.randomUUID(),
            firstName: userData.first_name || '',
            lastName: userData.last_name || '',
            email: userData.email,
            role: (userData.role as UserRole) || role
          };
          
          setCurrentUser(user);
          return user;
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.log('API registration failed with status', response.status, errorData);
          throw new Error(errorData.message || 'Registration failed');
        }
      } catch (error) {
        console.error('API registration error:', error);
        // Only throw if it's an API error with a message
        if (error instanceof Error && error.message !== 'Registration failed') {
          throw error;
        }
        // Fall through to mock registration if API fails
      }
    }
    
    // Mock registration for both development and production
    console.log('Using mock registration');
    // Check if user already exists in mock data
    if (mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('User with this email already exists');
    }
    
    const newUser: User = {
      id: crypto.randomUUID(),
      firstName,
      lastName,
      email,
      role
    };
    
    // In a real implementation, we would save this user to a database
    console.log('Mock registration successful');
    setCurrentUser(newUser);
    return newUser;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Logout API
export const logoutUser = async (): Promise<void> => {
  console.log('API Call: Logout');
  await mockApiDelay(200);
  clearCurrentUser();
};

// Change password API
export const changePassword = async (
  userId: string, 
  currentPassword: string, 
  newPassword: string
): Promise<boolean> => {
  console.log(`API Call: Changing password for user ${userId}`);
  await mockApiDelay(700);
  
  // In a real implementation, we would verify the current password
  // and update the password hash in the database
  
  return true;
};

/**
 * Authentication Utility Functions
 */

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
  return `jwt_${crypto.randomUUID()}`;
};

// Request password reset
export const requestPasswordReset = async (email: string): Promise<boolean> => {
  console.log(`API Call: Password reset requested for ${email}`);
  await mockApiDelay(500);
  
  const user = getUserByEmail(email);
  if (!user) {
    // In a real implementation, we would not reveal whether the email exists
    // for security reasons, but would still return success
    return true;
  }
  
  // In a real implementation, we would:
  // 1. Generate a reset token
  // 2. Store it in the database with the user ID and expiration time
  // 3. Send an email to the user with a reset link
  
  return true;
};

// Reset password with token
export const resetPassword = async (
  resetToken: string,
  newPassword: string
): Promise<boolean> => {
  console.log(`API Call: Reset password with token ${resetToken}`);
  await mockApiDelay(700);
  
  // In a real implementation, we would:
  // 1. Verify that the token exists and is not expired
  // 2. Find the associated user
  // 3. Update the user's password
  // 4. Invalidate the token
  
  return true;
};

// Export UserRole type
export type { UserRole };
