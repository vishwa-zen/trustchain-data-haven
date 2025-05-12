import { Vault, VaultTable, VaultTableCreateRequest, AppRegistration, TokenizeRequest, TokenizeResponse, DetokenizeRequest, DetokenizeResponse } from '@/types';
import { getCurrentUser, generateAccessToken } from './auth';

// Mock vault database
let vaults: Vault[] = [
  {
    id: '2288e11a-658f-421c-9359-79c969316303',
    userId: 'c7a22ea6-6fcb-40cc-8515-7f54ce47cd39',
    vaultName: 'kyc_vault',
    vaultDesc: 'Vault to securely store and manage KYC-related data such as identity documents, PAN, Aadhaar, and other sensitive information.',
    createdAt: new Date().toISOString(),
    tables: []
  }
];

// Mock app registrations
let appRegistrations: AppRegistration[] = [];

// Mock token storage - in a real system this would be an encrypted database
const tokenStorage: Record<string, any> = {};
const reverseTokenLookup: Record<string, string> = {};

// Create a new vault
export const createVault = async (vaultName: string, vaultDesc: string): Promise<Vault> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const newVault: Vault = {
        id: crypto.randomUUID(),
        userId: user.id,
        vaultName,
        vaultDesc,
        createdAt: new Date().toISOString()
      };

      vaults = [...vaults, newVault];
      resolve(newVault);
    }, 800);
  });
};

// Get all vaults
export const getVaults = async (): Promise<Vault[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = getCurrentUser();
      if (!user) throw new Error('User not authenticated');
      
      resolve(vaults.filter(v => v.userId === user.id));
    }, 500);
  });
};

// Get a vault by ID
export const getVaultById = async (vaultId: string): Promise<Vault | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(vaults.find(v => v.id === vaultId));
    }, 300);
  });
};

// Create tables for a vault
export const createVaultTables = async (request: VaultTableCreateRequest): Promise<Vault> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const vaultIndex = vaults.findIndex(v => v.id === request.vaultId);
      
      if (vaultIndex === -1) {
        throw new Error('Vault not found');
      }
      
      const updatedVault = {
        ...vaults[vaultIndex],
        tables: request.tables
      };
      
      vaults = [
        ...vaults.slice(0, vaultIndex),
        updatedVault,
        ...vaults.slice(vaultIndex + 1)
      ];
      
      resolve(updatedVault);
    }, 800);
  });
};

// Register an application to a vault
export const registerApplication = async (registration: AppRegistration): Promise<AppRegistration> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newRegistration = {
        ...registration,
        id: crypto.randomUUID()
      };
      
      appRegistrations = [...appRegistrations, newRegistration];
      resolve(newRegistration);
    }, 800);
  });
};

// Get application registrations by user
export const getApplicationsByUser = async (userId: string): Promise<AppRegistration[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(appRegistrations.filter(app => app.userId === userId));
    }, 500);
  });
};

// Tokenize data
export const tokenizeData = async (request: TokenizeRequest): Promise<TokenizeResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const accessKey = crypto.randomUUID();
      const tokens: Record<string, string> = {};
      
      // Generate tokens for each data field
      Object.entries(request.data).forEach(([key, value]) => {
        const token = crypto.randomUUID();
        tokens[key] = token;
        
        // Store data with access key for later retrieval
        tokenStorage[`${accessKey}:${token}`] = value;
        reverseTokenLookup[token] = key;
      });
      
      resolve({
        tokens,
        accessKey
      });
    }, 1000);
  });
};

// Detokenize data
export const detokenizeData = async (request: DetokenizeRequest): Promise<DetokenizeResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data: Record<string, any> = {};
      
      // Retrieve original data for each token
      request.tokens.forEach(token => {
        const key = reverseTokenLookup[token];
        const value = tokenStorage[`${request.accessKey}:${token}`];
        
        if (key && value !== undefined) {
          data[key] = value;
        }
      });
      
      resolve({ data });
    }, 1000);
  });
};

// Approve an application registration
export const approveApplication = async (appId: string): Promise<AppRegistration> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const appIndex = appRegistrations.findIndex(app => app.id === appId);
      
      if (appIndex === -1) {
        throw new Error('Application not found');
      }
      
      const updatedApp = {
        ...appRegistrations[appIndex],
        status: 'approved' as const
      };
      
      appRegistrations = [
        ...appRegistrations.slice(0, appIndex),
        updatedApp,
        ...appRegistrations.slice(appIndex + 1)
      ];
      
      resolve(updatedApp);
    }, 800);
  });
};

// Reject an application registration
export const rejectApplication = async (appId: string): Promise<AppRegistration> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const appIndex = appRegistrations.findIndex(app => app.id === appId);
      
      if (appIndex === -1) {
        throw new Error('Application not found');
      }
      
      const updatedApp = {
        ...appRegistrations[appIndex],
        status: 'rejected' as const
      };
      
      appRegistrations = [
        ...appRegistrations.slice(0, appIndex),
        updatedApp,
        ...appRegistrations.slice(appIndex + 1)
      ];
      
      resolve(updatedApp);
    }, 800);
  });
};

// Re-export the generateAccessToken function from auth
export { generateAccessToken };
