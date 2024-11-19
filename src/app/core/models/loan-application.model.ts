export interface LoanApplication {
  id: string;
  applicantName: string;
  applicantEmail: string;
  loanAmount: number;
  purpose: string;
  status: LoanStatus;
  assignedUnderwriter?: string;
  assignedRiskAnalyst?: string;
  assignedManager?: string;
  createdAt: Date;
  updatedAt: Date;
  documents: Document[];
  comments: Comment[];
}

export interface LoanApplicationDTO {
  loanId?: string;
  lenderId: string;
  loanAmount: string;
  loanType: string;
  applicationStatus?: string;
  riskLevel: string;
  createdAt?: string;
  updatedAt?: string;
  requiredApprovalMatrix?: number;
  finalApprovalStatus?: string;
  finalApprovalTimestamp?: string;
  isActive: boolean;
  underwriterId: string;
  riskAnalystId: string;
  complianceOfficerId: string;
  managerId: string;
  seniorManagerId: string;
}

export interface LoanApprovalDTO {
  approvalId: string;
  approverId: string;
  loanId: string;
  approverName: string;
  approverRoleName: string;
  approvalLevel: number;
  approvalStatus: string;
  remarks: string;
  approvalDate: string;
  SLA: string;
}

export interface UnderwriterAssessmentDTO {
  underwriterAssessmentId: string;
  loanToValueRatio: number;
  incomeVerificationStatus: string;
  assessmentOutcome: string;
  remarks: string;
  assessmentDate: string;
}

export interface RiskAssessmentDTO {
  assessmentId: string;
  debtToIncomeRatio: number;
  creditScore: number;
  riskCategory: string;
  remarks: string;
  assessmentDate: string;
}

export interface ComplianceAssessmentDTO {
  complianceId: string;
  complianceStatus: string;
  remarks: string;
  assessmentDate: string;
}

export interface LoanApplicationExtendedDTO {
  loanApplication: LoanApplicationDTO;
  loanApprovals: LoanApprovalDTO[];
  underwriterAssessment: UnderwriterAssessmentDTO;
  riskAssessment: RiskAssessmentDTO;
  complianceAssessment: ComplianceAssessmentDTO;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: Date;
}

export enum LoanStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  PENDING_DOCUMENTS = 'PENDING_DOCUMENTS',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}