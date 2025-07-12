// Predefined purpose options for data processing
export const DATA_PURPOSES = [
  {
    value: "verification",
    label: "Identity Verification",
    description: "Verify user identity and authenticity for secure access and compliance",
    applicationRoles: ["Authentication Service", "KYC Provider", "Identity Management Platform", "Banking Application"]
  },
  {
    value: "analysis",
    label: "Data Analysis",
    description: "Analyze data for insights, patterns, and business intelligence",
    applicationRoles: ["Analytics Platform", "Business Intelligence Tool", "Data Science Application", "Research Platform"]
  },
  {
    value: "authorization",
    label: "Access Authorization",
    description: "Authorize user access to systems, resources, and sensitive data",
    applicationRoles: ["Access Control System", "Authorization Server", "Privilege Management", "Security Gateway"]
  },
  {
    value: "fraud-prevention",
    label: "Fraud Prevention",
    description: "Detect, prevent, and mitigate fraudulent activities and suspicious behavior",
    applicationRoles: ["Fraud Detection System", "Risk Monitoring Tool", "Security Scanner", "Anti-Fraud Platform"]
  },
  {
    value: "risk-assessment",
    label: "Risk Assessment",
    description: "Assess and evaluate potential risks for informed decision making",
    applicationRoles: ["Risk Management Platform", "Credit Scoring System", "Compliance Tool", "Assessment Engine"]
  },
  {
    value: "credit-decisioning",
    label: "Credit Decisioning",
    description: "Make credit-related decisions and evaluations for lending purposes",
    applicationRoles: ["Lending Platform", "Credit Scoring Application", "Loan Management System", "Financial Assessment Tool"]
  },
  {
    value: "customer-communication",
    label: "Customer Communication",
    description: "Communicate with customers via email, SMS, notifications, and other channels",
    applicationRoles: ["CRM System", "Marketing Platform", "Notification Service", "Customer Engagement Tool"]
  },
  {
    value: "account-verification",
    label: "Account Verification",
    description: "Verify account details, ownership, and legitimacy for security purposes",
    applicationRoles: ["Account Management System", "Verification Service", "Onboarding Platform", "Identity Checker"]
  },
  {
    value: "order-processing",
    label: "Order Processing",
    description: "Process customer orders, transactions, and fulfillment operations",
    applicationRoles: ["E-commerce Platform", "Order Management System", "Fulfillment Service", "Retail Application"]
  },
  {
    value: "payment-processing",
    label: "Payment Processing",
    description: "Handle payment transactions, billing, and financial operations",
    applicationRoles: ["Payment Gateway", "Billing System", "Financial Processor", "Transaction Manager"]
  },
  {
    value: "shipping",
    label: "Shipping & Logistics",
    description: "Manage shipping, delivery, and logistics operations efficiently",
    applicationRoles: ["Logistics Platform", "Shipping Service", "Delivery Management", "Supply Chain Tool"]
  },
  {
    value: "analytics",
    label: "Business Analytics",
    description: "Generate business insights, reports, and performance analytics",
    applicationRoles: ["Business Intelligence Platform", "Reporting Tool", "Analytics Dashboard", "Performance Monitor"]
  },
  {
    value: "user-interface",
    label: "User Interface",
    description: "Personalize and enhance user experience across digital touchpoints",
    applicationRoles: ["Personalization Engine", "UI Platform", "Experience Optimizer", "Interface Customizer"]
  },
  {
    value: "customer-support",
    label: "Customer Support",
    description: "Provide customer service, support, and assistance across channels",
    applicationRoles: ["Help Desk System", "Support Platform", "Ticketing System", "Customer Service Tool"]
  },
  {
    value: "hr-management",
    label: "HR Management",
    description: "Manage human resources, employee data, and workforce operations",
    applicationRoles: ["HRIS Platform", "Employee Management System", "Workforce Tool", "HR Application"]
  },
  {
    value: "directory",
    label: "Directory Services",
    description: "Maintain organizational directory information and employee records",
    applicationRoles: ["Directory Service", "Employee Directory", "Organization Chart", "Contact Database"]
  },
  {
    value: "compensation",
    label: "Compensation Management",
    description: "Manage employee compensation, benefits, and payroll operations",
    applicationRoles: ["Payroll System", "Benefits Platform", "Compensation Tool", "Salary Management"]
  },
  {
    value: "financial-records",
    label: "Financial Records",
    description: "Maintain financial records, accounting data, and fiscal documentation",
    applicationRoles: ["Financial Management System", "Accounting Software", "Records Manager", "Fiscal Platform"]
  },
  {
    value: "accounting",
    label: "Accounting",
    description: "Perform accounting operations, bookkeeping, and financial calculations",
    applicationRoles: ["Accounting System", "Bookkeeping Platform", "Financial Calculator", "Ledger Application"]
  },
  {
    value: "audit",
    label: "Audit & Compliance",
    description: "Conduct audits, ensure regulatory compliance, and maintain standards",
    applicationRoles: ["Audit Platform", "Compliance Tool", "Regulatory System", "Governance Application"]
  },
  {
    value: "billing",
    label: "Billing & Invoicing",
    description: "Generate bills, manage invoicing, and handle billing operations",
    applicationRoles: ["Billing System", "Invoice Generator", "Revenue Management", "Billing Platform"]
  },
  {
    value: "contact-management",
    label: "Contact Management",
    description: "Manage contact information, relationships, and communication history",
    applicationRoles: ["CRM Platform", "Contact Manager", "Relationship Tool", "Address Book System"]
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

// Helper function to get application roles by purpose value
export const getPurposeApplicationRoles = (value: string): readonly string[] => {
  const purpose = DATA_PURPOSES.find(p => p.value === value);
  return purpose ? purpose.applicationRoles : [];
};