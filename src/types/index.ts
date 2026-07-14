export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';
export type SubmissionStatus = 'Pending' | 'Approved' | 'Rejected';

export interface CompanyInfo {
  industryName: string;
  companyName: string;
  representativeName: string;
  designation: string;
  email: string;
  phone: string;
  website: string;
  industrySector: string;
}

export interface ProblemDetails {
  title: string;
  description: string;
  businessChallenge: string;
  existingProcess: string;
  expectedOutcome: string;
  projectObjectives: string;
}

export interface TechnicalDetails {
  requiredTechnologies: string[];
  requiredSkills: string[];
  preferredBranches: string[];
  preferredAcademicYear: string;
  difficultyLevel: DifficultyLevel;
  expectedDuration: string;
}

export interface AdditionalDetails {
  expectedDeliverables: string;
  additionalNotes: string;
  fileAttachmentName?: string;
  declarationAccepted: boolean;
}

export interface ProblemStatement {
  id: string;
  company: CompanyInfo;
  details: ProblemDetails;
  technical: TechnicalDetails;
  additional: AdditionalDetails;
  status: SubmissionStatus;
  submittedDate: string;
  reviewRemarks?: string;
  editedByAdmin?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'industry' | 'admin';
  companyName?: string;
  designation?: string;
}
