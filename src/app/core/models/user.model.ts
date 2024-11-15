export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  token?: string;
  isActive: boolean;
}

export interface RoleDTO {
  roleId: string;
  roleName: string;
}

export interface UserProfile {
  userId?: string;
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  createdAt?: string; 
  updatedAt?: string;
  role: RoleDTO;
  isActive: boolean;
}


export enum UserRole {
  ADMIN = 'ADMIN',
  LOAN_OFFICER = 'LOAN_OFFICER',
  UNDERWRITER = 'UNDERWRITER',
  RISK_ANALYST = 'RISK_ANALYST',
  COMPLIANCE_OFFICER = 'COMPLIANCE_OFFICER',
  MANAGER = 'MANAGER',
  SENIOR_MANAGER = 'SENIOR_MANAGER'
}

