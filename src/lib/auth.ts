import { User, UserRole } from '@/types';
import { toast } from '@/hooks/use-toast';

// Mock user database
let users: User[] = [
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

// Mock local storage functions for user sessions
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

// Login function
export const loginUser = async (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    // In a real app, this would be an API call
    setTimeout(() => {
      const user = users.find(u => u.email === email);
      
      if (user) {
        // Password check would happen server-side in a real app
        setCurrentUser(user);
        resolve(user);
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 800); // Simulate API delay
  });
};

// Register function
export const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role: UserRole
): Promise<User> => {
  return new Promise((resolve, reject) => {
    // In a real app, this would be an API call
    setTimeout(() => {
      // Check if user already exists
      if (users.some(u => u.email === email)) {
        reject(new Error('User with this email already exists'));
        return;
      }

      const newUser: User = {
        id: crypto.randomUUID(),
        firstName,
        lastName,
        email,
        role
      };

      users = [...users, newUser];
      setCurrentUser(newUser);
      resolve(newUser);
    }, 800); // Simulate API delay
  });
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
export { UserRole };
