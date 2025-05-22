import { AppRegistration, DataSet } from '@/types';
import { mockApiDelay, generateId } from '@/lib/utils';

// Mock application data storage
let mockApplications: AppRegistration[] = [
  {
    id: 'app-1',
    name: 'KYC Application',
    description: 'Customer verification system',
    status: 'approved',
    userId: 'user-1',
    vaultId: 'vault-1',
    dataSets: [
      {
        name: 'Customer Verification',
        accessToken: 'access-token-1',
        fields: [
          { name: 'fullName', actions: ['read'] },
          { name: 'email', actions: ['read'] },
          { name: 'nationalId', actions: ['read'] }
        ],
        purpose: ['Identity Verification', 'Fraud Prevention'],
        status: 'approved',
        expiryDate: '2026-05-22T00:00:00Z'
      }
    ],
    clientId: 'client-123',
    clientSecret: 'secret-456',
    redirectUris: ['https://app.example.com/callback'],
    createdAt: '2025-04-10T08:30:00Z',
    ownerId: 'user-1'
  },
  {
    id: 'app-2',
    name: 'Risk Assessment Tool',
    description: 'Financial risk analysis system',
    status: 'pending',
    userId: 'user-1',
    vaultId: 'vault-2',
    dataSets: [
      {
        name: 'Financial Data',
        accessToken: 'access-token-2',
        fields: [
          { name: 'creditScore', actions: ['read'] },
          { name: 'incomeLevel', actions: ['read'] },
          { name: 'financialHistory', actions: ['read'] }
        ],
        purpose: ['Risk Assessment', 'Credit Decisioning'],
        status: 'requested',
        expiryDate: '2026-06-15T00:00:00Z'
      }
    ],
    createdAt: '2025-05-01T10:15:00Z',
    ownerId: 'user-1'
  },
  {
    id: 'app-3',
    name: 'Compliance Monitor',
    description: 'Regulatory compliance monitoring',
    status: 'rejected',
    userId: 'user-2',
    vaultId: 'vault-3',
    dataSets: [],
    createdAt: '2025-03-22T16:40:00Z',
    ownerId: 'user-2'
  }
];

/**
 * Get all registered applications
 */
export const getAllApplications = async (): Promise<AppRegistration[]> => {
  await mockApiDelay();
  return [...mockApplications];
};

/**
 * Get application by ID
 */
export const getApplicationById = async (id: string): Promise<AppRegistration | null> => {
  await mockApiDelay();
  const app = mockApplications.find(a => a.id === id);
  return app ? { ...app } : null;
};

/**
 * Get applications by user ID
 */
export const getApplicationsByUser = async (userId: string): Promise<AppRegistration[]> => {
  await mockApiDelay();
  return mockApplications.filter(a => a.userId === userId || a.ownerId === userId).map(app => ({ ...app }));
};

/**
 * Get applications by vault ID
 */
export const getApplicationsByVault = async (vaultId: string): Promise<AppRegistration[]> => {
  await mockApiDelay();
  return mockApplications.filter(a => a.vaultId === vaultId).map(app => ({ ...app }));
};

/**
 * Create a new application
 */
export const createApplication = async (application: Omit<AppRegistration, 'id' | 'createdAt'>): Promise<AppRegistration> => {
  await mockApiDelay();
  
  const newApp: AppRegistration = {
    ...application,
    id: generateId('app'),
    createdAt: new Date().toISOString()
  };
  
  mockApplications.push(newApp);
  return { ...newApp };
};

/**
 * Update an existing application
 */
export const updateApplication = async (id: string, updates: Partial<AppRegistration>): Promise<AppRegistration | null> => {
  await mockApiDelay();
  
  const index = mockApplications.findIndex(a => a.id === id);
  if (index === -1) return null;
  
  // Ensure we're using a valid status value
  if (updates.status && !['requested', 'approved', 'rejected', 'pending'].includes(updates.status as string)) {
    throw new Error('Invalid status value');
  }
  
  mockApplications[index] = {
    ...mockApplications[index],
    ...updates
  };
  
  return { ...mockApplications[index] };
};

/**
 * Delete an application
 */
export const deleteApplication = async (id: string): Promise<boolean> => {
  await mockApiDelay();
  
  const initialLength = mockApplications.length;
  mockApplications = mockApplications.filter(a => a.id !== id);
  
  return mockApplications.length < initialLength;
};

/**
 * Approve an application
 */
export const approveApplication = async (id: string): Promise<AppRegistration | null> => {
  await mockApiDelay();
  
  const app = await updateApplication(id, { 
    status: 'approved', 
    clientId: generateId('client'),
    clientSecret: generateId('secret')
  });
  
  return app;
};

/**
 * Reject an application
 */
export const rejectApplication = async (id: string, reason?: string): Promise<AppRegistration | null> => {
  await mockApiDelay();
  
  const app = await updateApplication(id, { 
    status: 'rejected'
  });
  
  return app;
};

/**
 * Get application data sets
 */
export const getApplicationDataSets = async (appId: string): Promise<DataSet[]> => {
  await mockApiDelay();
  
  const app = await getApplicationById(appId);
  return app?.dataSets || [];
};

/**
 * Add data set to application
 */
export const addDataSetToApplication = async (appId: string, dataSet: DataSet): Promise<boolean> => {
  await mockApiDelay();
  
  const app = mockApplications.find(a => a.id === appId);
  if (!app) return false;
  
  app.dataSets = [...(app.dataSets || []), dataSet];
  return true;
};
