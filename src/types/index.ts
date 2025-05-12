
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
  tables?: VaultTable[];
}

export interface VaultTableCreateRequest {
  userId: string;
  vaultId: string;
  vaultName: string;
  tables: VaultTable[];
}

export interface DataSetField {
  name: string;
}

export interface DataSet {
  name: string;
  accessToken: string;
  fields: DataSetField[];
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
  status: 'pending' | 'approved' | 'rejected';
  dataSets: DataSet[];
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
