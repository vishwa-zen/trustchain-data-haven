
interface Application {
  id: string;
  userId: string;
  vaultId: string;
  name: string;
  description: string;
  status: string;
  dataSets: any[];
}

// Mock data for applications
const applications = [
  {
    id: 'app-1',
    userId: 'user-1',
    vaultId: 'vault-1',
    name: 'Payment Processing App',
    description: 'Handles secure payment transactions',
    status: 'active',
    dataSets: []
  },
  {
    id: 'app-2',
    userId: 'user-1',
    vaultId: 'vault-2',
    name: 'User Management System',
    description: 'Manages user accounts and permissions',
    status: 'inactive',
    dataSets: []
  }
];

// Function to fetch an application by ID
export const getApplicationById = async (id: string): Promise<Application> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const application = applications.find(app => app.id === id);
  
  if (!application) {
    throw new Error(`Application with ID ${id} not found`);
  }
  
  return application;
};

// Function to fetch all applications
export const getAllApplications = async (): Promise<Application[]> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return applications;
};

export type { Application };
