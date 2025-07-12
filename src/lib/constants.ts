// Predefined purpose options for data processing
export const DATA_PURPOSES = [
  {
    value: "verification",
    label: "Identity Verification",
    description: "Verify user identity and authenticity"
  },
  {
    value: "analysis",
    label: "Data Analysis",
    description: "Analyze data for insights and patterns"
  },
  {
    value: "authorization",
    label: "Access Authorization",
    description: "Authorize user access to systems and resources"
  },
  {
    value: "fraud-prevention",
    label: "Fraud Prevention",
    description: "Detect and prevent fraudulent activities"
  },
  {
    value: "risk-assessment",
    label: "Risk Assessment",
    description: "Assess and evaluate potential risks"
  },
  {
    value: "credit-decisioning",
    label: "Credit Decisioning",
    description: "Make credit-related decisions and evaluations"
  },
  {
    value: "customer-communication",
    label: "Customer Communication",
    description: "Communicate with customers via various channels"
  },
  {
    value: "account-verification",
    label: "Account Verification",
    description: "Verify account details and ownership"
  },
  {
    value: "order-processing",
    label: "Order Processing",
    description: "Process customer orders and transactions"
  },
  {
    value: "payment-processing",
    label: "Payment Processing",
    description: "Handle payment transactions and billing"
  },
  {
    value: "shipping",
    label: "Shipping & Logistics",
    description: "Manage shipping and delivery operations"
  },
  {
    value: "analytics",
    label: "Business Analytics",
    description: "Generate business insights and reporting"
  },
  {
    value: "user-interface",
    label: "User Interface",
    description: "Personalize and enhance user experience"
  },
  {
    value: "customer-support",
    label: "Customer Support",
    description: "Provide customer service and support"
  },
  {
    value: "hr-management",
    label: "HR Management",
    description: "Manage human resources and employee data"
  },
  {
    value: "directory",
    label: "Directory Services",
    description: "Maintain organizational directory information"
  },
  {
    value: "compensation",
    label: "Compensation Management",
    description: "Manage employee compensation and benefits"
  },
  {
    value: "financial-records",
    label: "Financial Records",
    description: "Maintain financial and accounting records"
  },
  {
    value: "accounting",
    label: "Accounting",
    description: "Perform accounting and bookkeeping functions"
  },
  {
    value: "audit",
    label: "Audit & Compliance",
    description: "Conduct audits and ensure regulatory compliance"
  },
  {
    value: "billing",
    label: "Billing & Invoicing",
    description: "Generate bills and manage invoicing"
  },
  {
    value: "contact-management",
    label: "Contact Management",
    description: "Manage contact information and relationships"
  }
] as const;

export type DataPurpose = typeof DATA_PURPOSES[number]['value'];

// Helper function to get purpose label by value
export const getPurposeLabel = (value: string): string => {
  const purpose = DATA_PURPOSES.find(p => p.value === value);
  return purpose ? purpose.label : value;
};

// Helper function to get purpose description by value
export const getPurposeDescription = (value: string): string => {
  const purpose = DATA_PURPOSES.find(p => p.value === value);
  return purpose ? purpose.description : '';
};