import { Vault, VaultTable, VaultTableCreateRequest, AppRegistration, TokenizeRequest, TokenizeResponse, DetokenizeRequest, DetokenizeResponse, ConsentRequest, FieldLevelConsent, ConsentApproval } from '@/types';
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

// Mock consent requests - this would be stored in a database in a real system
let consentRequests: ConsentRequest[] = [];

// Mock field level consents - this would be stored in a database in a real system
let fieldLevelConsents: FieldLevelConsent[] = [];

// Mock consent approvals - this would be stored in a database in a real system
let consentApprovals: ConsentApproval[] = [];

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

// Get all consent requests
export const getConsentRequests = async (): Promise<ConsentRequest[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = getCurrentUser();
      if (!user) throw new Error('User not authenticated');
      
      // Filter based on role
      if (user.role === 'admin' || user.role === 'data-steward') {
        resolve(consentRequests);
      } else {
        // App owners only see their own requests
        resolve(consentRequests.filter(req => req.userId === user.id));
      }
    }, 500);
  });
};

// Get consent requests for a specific app
export const getAppConsentRequests = async (appId: string): Promise<ConsentRequest[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(consentRequests.filter(req => req.appId === appId));
    }, 500);
  });
};

// Create consent requests based on application registration
export const createConsentRequests = async (appRegistration: AppRegistration): Promise<ConsentRequest[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newRequests: ConsentRequest[] = [];
      const now = new Date().toISOString();

      appRegistration.dataSets.forEach(dataSet => {
        dataSet.fields.forEach(field => {
          const newRequest: ConsentRequest = {
            appId: appRegistration.id || '',
            appName: appRegistration.name,
            userId: appRegistration.userId,
            vaultId: appRegistration.vaultId,
            dataSetName: dataSet.name,
            fieldName: field.name,
            actions: field.actions,
            purpose: dataSet.purpose,
            status: 'requested',
            requestedAt: now,
            expiryDate: dataSet.expiryDate
          };
          
          newRequests.push(newRequest);
        });
      });
      
      consentRequests = [...consentRequests, ...newRequests];
      resolve(newRequests);
    }, 800);
  });
};

// Approve a field-level consent
export const approveFieldConsent = async (
  appId: string, 
  dataSetName: string, 
  fieldName: string, 
  actions: ('read' | 'write')[],
  reason?: string
): Promise<ConsentApproval> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = getCurrentUser();
      if (!user) throw new Error('User not authenticated');
      
      if (user.role !== 'admin' && user.role !== 'data-steward') {
        throw new Error('Unauthorized: Only admins and data stewards can approve consent');
      }
      
      // Update consent requests status
      consentRequests = consentRequests.map(req => {
        if (req.appId === appId && req.dataSetName === dataSetName && req.fieldName === fieldName) {
          return { ...req, status: 'approved' };
        }
        return req;
      });
      
      // Create field level consent
      const existingIndex = fieldLevelConsents.findIndex(
        c => c.appId === appId && c.dataSetName === dataSetName && c.fieldName === fieldName
      );
      
      if (existingIndex >= 0) {
        fieldLevelConsents[existingIndex] = {
          appId,
          dataSetName,
          fieldName,
          actions,
          approved: true
        };
      } else {
        fieldLevelConsents.push({
          appId,
          dataSetName,
          fieldName,
          actions,
          approved: true
        });
      }
      
      // Create approval record
      const approval: ConsentApproval = {
        appId,
        dataSetName,
        fieldName,
        actions,
        approved: true,
        approvedBy: user.id,
        approvedAt: new Date().toISOString(),
        reason
      };
      
      consentApprovals.push(approval);
      
      // Check if all fields of a dataset are approved
      // If so, update the dataset status in the app registration
      updateAppDataSetStatus(appId, dataSetName);
      
      resolve(approval);
    }, 800);
  });
};

// Reject a field-level consent
export const rejectFieldConsent = async (
  appId: string, 
  dataSetName: string, 
  fieldName: string,
  reason?: string
): Promise<ConsentApproval> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = getCurrentUser();
      if (!user) throw new Error('User not authenticated');
      
      if (user.role !== 'admin' && user.role !== 'data-steward') {
        throw new Error('Unauthorized: Only admins and data stewards can reject consent');
      }
      
      // Update consent requests status
      consentRequests = consentRequests.map(req => {
        if (req.appId === appId && req.dataSetName === dataSetName && req.fieldName === fieldName) {
          return { ...req, status: 'rejected' };
        }
        return req;
      });
      
      // Update field level consent
      const existingIndex = fieldLevelConsents.findIndex(
        c => c.appId === appId && c.dataSetName === dataSetName && c.fieldName === fieldName
      );
      
      if (existingIndex >= 0) {
        fieldLevelConsents[existingIndex] = {
          ...fieldLevelConsents[existingIndex],
          approved: false
        };
      } else {
        fieldLevelConsents.push({
          appId,
          dataSetName,
          fieldName,
          actions: [],
          approved: false
        });
      }
      
      // Create rejection record
      const rejection: ConsentApproval = {
        appId,
        dataSetName,
        fieldName,
        actions: [],
        approved: false,
        approvedBy: user.id,
        approvedAt: new Date().toISOString(),
        reason
      };
      
      consentApprovals.push(rejection);
      
      // Check if any field of a dataset is rejected
      // If so, update the dataset status in the app registration
      updateAppDataSetStatus(appId, dataSetName);
      
      resolve(rejection);
    }, 800);
  });
};

// Update dataset status in app registration based on field level consents
const updateAppDataSetStatus = (appId: string, dataSetName: string) => {
  const appIndex = appRegistrations.findIndex(app => app.id === appId);
  if (appIndex === -1) return;
  
  const app = appRegistrations[appIndex];
  const dataSetIndex = app.dataSets.findIndex(ds => ds.name === dataSetName);
  if (dataSetIndex === -1) return;
  
  // Get all field level consents for this dataset
  const relevantConsents = fieldLevelConsents.filter(
    c => c.appId === appId && c.dataSetName === dataSetName
  );
  
  // If any field is rejected, the dataset is rejected
  if (relevantConsents.some(c => !c.approved)) {
    app.dataSets[dataSetIndex].status = 'rejected';
  } 
  // If all fields have been reviewed and approved, the dataset is approved
  else if (
    relevantConsents.length > 0 && 
    app.dataSets[dataSetIndex].fields.length === relevantConsents.length &&
    relevantConsents.every(c => c.approved)
  ) {
    app.dataSets[dataSetIndex].status = 'approved';
    
    // Generate an access token for the approved dataset
    if (!app.dataSets[dataSetIndex].accessToken) {
      app.dataSets[dataSetIndex].accessToken = 'dsacc_' + crypto.randomUUID().split('-')[0];
    }
  }
  
  // Update the app status based on dataset statuses
  if (app.dataSets.every(ds => ds.status === 'approved')) {
    app.status = 'approved';
  } else if (app.dataSets.some(ds => ds.status === 'rejected')) {
    app.status = 'rejected';
  }
  
  // Update the app in the registrations array
  appRegistrations[appIndex] = app;
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

// Get field level consents for an app
export const getAppFieldConsents = async (appId: string): Promise<FieldLevelConsent[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(fieldLevelConsents.filter(consent => consent.appId === appId));
    }, 500);
  });
};

// Get consent approval history for an app
export const getConsentApprovalHistory = async (appId: string): Promise<ConsentApproval[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(consentApprovals.filter(approval => approval.appId === appId));
    }, 500);
  });
};

// Re-export the generateAccessToken function from auth
export { generateAccessToken };
