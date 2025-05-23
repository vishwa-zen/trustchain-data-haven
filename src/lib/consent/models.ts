
// Define types for the API response structure

export interface ConsentAppField {
  name: string;
  actions: ('read' | 'write')[];
}

export interface ConsentDataSet {
  name: string;
  fields: ConsentAppField[];
  purpose: string[];
  expiry_date: string;
}

export class ConsentApplication {
  id: string;
  app_id: string;
  name: string;
  description: string;
  user_id: string;
  status: 'approved' | 'pending' | 'rejected';
  data_sets: ConsentDataSet[];
  created_at: string;
  updated_at: string;
  vault_id: string;
  access_token: string;

  constructor(data: any) {
    this.id = data.id;
    this.app_id = data.app_id;
    this.name = data.name;
    this.description = data.description;
    this.user_id = data.user_id;
    this.status = data.status;
    this.data_sets = data.data_sets;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.vault_id = data.vault_id;
    this.access_token = data.access_token || '';
  }

  // Helper method to create ConsentApplication instances from API response
  static fromApiResponse(data: any[]): ConsentApplication[] {
    return data.map(item => new ConsentApplication(item));
  }

  // Method to get all fields across all datasets
  getAllFields(): { dataSetName: string; field: ConsentAppField }[] {
    const result: { dataSetName: string; field: ConsentAppField }[] = [];
    
    this.data_sets.forEach(dataSet => {
      dataSet.fields.forEach(field => {
        result.push({
          dataSetName: dataSet.name,
          field: field
        });
      });
    });
    
    return result;
  }

  // Method to check if the application has read access to a specific field
  hasReadAccess(dataSetName: string, fieldName: string): boolean {
    const dataSet = this.data_sets.find(ds => ds.name === dataSetName);
    if (!dataSet) return false;
    
    const field = dataSet.fields.find(f => f.name === fieldName);
    if (!field) return false;
    
    return field.actions.includes('read');
  }

  // Method to check if the application has write access to a specific field
  hasWriteAccess(dataSetName: string, fieldName: string): boolean {
    const dataSet = this.data_sets.find(ds => ds.name === dataSetName);
    if (!dataSet) return false;
    
    const field = dataSet.fields.find(f => f.name === fieldName);
    if (!field) return false;
    
    return field.actions.includes('write');
  }

  // Method to get all field names for a dataset
  getDataSetFieldNames(dataSetName: string): string[] {
    const dataSet = this.data_sets.find(ds => ds.name === dataSetName);
    if (!dataSet) return [];
    
    return dataSet.fields.map(field => field.name);
  }

  // Method to convert to a grouped consent request format
  toGroupedConsentRequests(): any[] {
    return this.data_sets.map(dataSet => ({
      groupId: `${this.app_id}_${dataSet.name}`,
      appId: this.app_id,
      appName: this.name,
      dataSetName: dataSet.name,
      fields: dataSet.fields.map(field => ({
        fieldName: field.name,
        actions: field.actions
      })),
      purpose: dataSet.purpose,
      status: this.status,
      requestedAt: this.created_at,
      expiryDate: dataSet.expiry_date
    }));
  }
}

// Helper function to fetch and parse consent applications
export async function fetchConsentApplications(url: string): Promise<ConsentApplication[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return ConsentApplication.fromApiResponse(data);
  } catch (error) {
    console.error('Error fetching consent applications:', error);
    throw error;
  }
}
