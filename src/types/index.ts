
// Make sure UserRole is properly exported
export type UserRole = 'app-owner' | 'data-steward' | 'admin';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

export interface VaultField {
  name: string;
  type: string;
  sensitivity: 'LOW' | 'MEDIUM' | 'HIGH';
  accessControl: string[];
}

export interface VaultTable {
  tableName: string;
  description: string;
  purpose: string[];
  fields: VaultField[];
}

export interface Vault {
  id: string;
  userId: string;
  vaultName: string;
  vaultDesc: string;
  createdAt: string;
  updatedAt?: string; // Added as optional
  status?: string; // Added as optional
  tables?: VaultTable[];
}

export interface VaultTableCreateRequest {
  userId: string;
  vaultId: string;
  vaultName: string;
  tables: VaultTable[];
}

export interface DataSetFieldAction {
  name: string;
  actions: ('read' | 'write')[];
}

export interface DataSet {
  name: string;
  accessToken: string;
  fields: DataSetFieldAction[];
  purpose: string[];
  status: 'requested' | 'approved' | 'rejected';
  expiryDate: string;
}

export interface AppRegistration {
  id?: string;
  userId: string;
  vaultId: string;
  name: string;
  description: string;
  status: 'requested' | 'approved' | 'rejected' | 'pending';
  dataSets: DataSet[];
  clientId?: string; // Added as optional
  clientSecret?: string; // Added as optional
  redirectUris?: string[]; // Added as optional
  createdAt?: string; // Added as optional
  ownerId?: string; // Added as optional
}

export interface TokenizeRequest {
  userId: string;
  vaultId: string;
  appId: string;
  data: Record<string, any>;
}

export interface TokenizeResponse {
  tokens: Record<string, string>;
  accessKey: string;
}

export interface DetokenizeRequest {
  userId: string;
  vaultId: string;
  appId: string;
  accessKey: string;
  tokens: string[];
}

export interface DetokenizeResponse {
  data: Record<string, any>;
}

export interface ConsentApproval {
  appId: string;
  dataSetName: string;
  fieldName: string;
  actions: ('read' | 'write')[];
  approved: boolean;
  approvedBy: string;
  approvedAt: string;
  reason?: string;
}

export interface ConsentRequest {
  appId: string;
  appName: string;
  userId: string;
  vaultId: string;
  dataSetName: string;
  fieldName: string;
  actions: ('read' | 'write')[];
  purpose: string[];
  status: 'requested' | 'approved' | 'rejected';
  requestedAt: string;
  expiryDate: string;
  // Add a groupId to identify fields that were requested together
  groupId?: string;
}

export interface FieldLevelConsent {
  appId: string;
  dataSetName: string;
  fieldName: string; 
  actions: ('read' | 'write')[];
  approved: boolean;
}

// New interface for batch consent management
export interface BatchFieldConsent {
  fieldKey: string; // Format: dataSetName:fieldName
  dataSetName: string;
  fieldName: string;
  selected: boolean;
  readAccess: boolean;
  writeAccess: boolean;
}

// New interface for grouped consent requests
export interface GroupedConsentRequest {
  groupId: string;
  appId: string;
  appName: string;
  dataSetName: string;
  fields: {
    fieldName: string;
    actions: ('read' | 'write')[];
  }[];
  purpose: string[];
  status: 'requested' | 'approved' | 'rejected';
  requestedAt: string;
  expiryDate: string;
}
