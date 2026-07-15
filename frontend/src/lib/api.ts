import { ProblemStatement, User, SubmissionStatus } from '../types';

/**
 * Base URL comes from VITE_API_URL (e.g., http://localhost:3001)
 */
const API_BASE = import.meta.env.VITE_API_URL;

/** Helper to include credentials for NextAuth cookies */
async function fetchJSON<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, { credentials: 'include', ...init });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'API error');
  }
  return data.data as T;
}

/** Auth */
export async function login(email: string, password: string) {
  // 1. Fetch CSRF Token
  const csrfRes = await fetch(`${API_BASE}/api/auth/csrf`, {
    credentials: 'include',
  });
  const csrfData = await csrfRes.json();
  const csrfToken = csrfData.csrfToken;

  // 2. POST to the credentials callback.
  //    By passing ?json=true, Auth.js behaves correctly.
  //    Using redirect: 'manual' is crucial: it prevents the browser from following the 302 redirect
  //    cross-origin, which would otherwise trigger a CORS violation on the backend root page.
  //    The browser still processes the Set-Cookie headers from the 302 response correctly.
  await fetch(`${API_BASE}/api/auth/callback/credentials?json=true`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ 
      email, 
      password, 
      csrfToken,
      callbackUrl: '/' 
    }).toString(),
    credentials: 'include',
    redirect: 'manual',
  });

  // 3. Fetch the session.
  const sessionRes = await fetch(`${API_BASE}/api/auth/session`, {
    credentials: 'include',
  });
  const sessionData = await sessionRes.json();

  if (!sessionData?.user) {
    throw new Error('Invalid email or password.');
  }

  return sessionData.user;
}

export async function logout() {
  // Fetch CSRF token for the state-changing signout POST request
  const csrfRes = await fetch(`${API_BASE}/api/auth/csrf`, {
    credentials: 'include',
  });
  const csrfData = await csrfRes.json();
  const csrfToken = csrfData.csrfToken;

  await fetch(`${API_BASE}/api/auth/signout?json=true`, { 
    method: 'POST', 
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ 
      csrfToken,
      callbackUrl: '/' 
    }).toString(),
    credentials: 'include',
    redirect: 'manual'
  });
}

export async function getSession(): Promise<User | null> {
  try {
    return await fetchJSON<User>(`${API_BASE}/api/auth/me`);
  } catch {
    return null;
  }
}

/** Challenges */
export async function fetchChallenges(): Promise<ProblemStatement[]> {
  const { data: challenges } = await fetchJSON<{ data: any[] }>(`${API_BASE}/api/challenges`);
  return (challenges || []).map(mapBackendToProblemStatement);
}

function mapSectorToCellTheme(sector: string): string {
  const normalized = (sector || '').toUpperCase().trim();
  if (normalized.includes("AGRI") || normalized.includes("FARM") || normalized.includes("FOOD")) {
    return "AGRITECH";
  }
  if (normalized.includes("AI") || normalized.includes("SOFTWARE") || normalized.includes("TECH") || normalized.includes("INFORMATION")) {
    return "AI_IN_BUSINESS";
  }
  if (normalized.includes("START") || normalized.includes("ENTREP")) {
    return "STARTUP";
  }
  if (normalized.includes("FAMILY") || normalized.includes("BUSINESS")) {
    return "FAMILY_BUSINESS";
  }
  if (normalized.includes("TALENT") || normalized.includes("EDUCATION") || normalized.includes("ACADEMIC")) {
    return "TALENT_READINESS";
  }
  if (normalized.includes("SKILL") || normalized.includes("TRAIN") || normalized.includes("DEVELOPMENT")) {
    return "SKILL_DEVELOPMENT";
  }
  return "RESEARCH_INNOVATION";
}

function getDeadline(payload: any): string {
  const notes = payload.additional?.additionalNotes || '';
  const match = notes.match(/Target date:\s*(\d{2})\/(\d{2})\/(\d{4})/);
  if (match) {
    const [_, day, month, year] = match;
    const date = new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);
    if (date > new Date()) {
      return date.toISOString();
    }
  }
  const defaultDate = new Date();
  defaultDate.setMonth(defaultDate.getMonth() + 3);
  return defaultDate.toISOString();
}

function getBudgetRange(payload: any): string {
  const notes = payload.additional?.additionalNotes || '';
  const match = notes.match(/Budget allocated:\s*([^\.]+)/);
  if (match) {
    return match[1].trim();
  }
  return notes || 'Not Specified';
}

function flattenChallengePayload(payload: any): any {
  const flat: any = {
    title: payload.details?.title || 'No Title Provided',
    description: payload.details?.description || 'No Description Provided',
    problemStatement: payload.details?.businessChallenge || payload.details?.description || 'No Problem Statement Provided',
    domain: mapSectorToCellTheme(payload.company?.industrySector || payload.company?.industryName || ''),
    deadline: getDeadline(payload),
    budgetRange: getBudgetRange(payload),
    tags: payload.technical?.requiredTechnologies || [],
    attachmentUrls: payload.additional?.fileAttachmentName ? [payload.additional.fileAttachmentName] : [],
    organizationName: payload.company?.companyName || 'Unknown Organization',
    duration: payload.technical?.expectedDuration || '6 Months',
  };

  if (payload.status) {
    const statusMap: Record<SubmissionStatus, string> = {
      'Pending': 'PENDING_APPROVAL',
      'Approved': 'OPEN',
      'Rejected': 'REJECTED',
    };
    flat.status = statusMap[payload.status as SubmissionStatus] || 'DRAFT';
  }

  return flat;
}

export async function createChallenge(payload: Omit<ProblemStatement, 'id' | 'status' | 'submittedDate'>): Promise<ProblemStatement> {
  const flatPayload = flattenChallengePayload(payload);
  const created = await fetchJSON<any>(`${API_BASE}/api/challenges`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(flatPayload),
  });
  return mapBackendToProblemStatement(created);
}

export async function updateChallenge(id: string, payload: Partial<ProblemStatement>) {
  const flatPayload = {};
  const tempFlat = flattenChallengePayload(payload);
  
  // Extract only updated fields for PATCH to avoid overwriting defaults
  if (payload.details?.title) (flatPayload as any).title = tempFlat.title;
  if (payload.details?.description) (flatPayload as any).description = tempFlat.description;
  if (payload.details?.businessChallenge) (flatPayload as any).problemStatement = tempFlat.problemStatement;
  if (payload.company?.industrySector || payload.company?.industryName) (flatPayload as any).domain = tempFlat.domain;
  if (payload.additional?.additionalNotes) {
    (flatPayload as any).budgetRange = tempFlat.budgetRange;
    (flatPayload as any).deadline = tempFlat.deadline;
  }
  if (payload.technical?.requiredTechnologies) (flatPayload as any).tags = tempFlat.tags;
  if (payload.additional?.fileAttachmentName) (flatPayload as any).attachmentUrls = tempFlat.attachmentUrls;
  if (payload.company?.companyName) (flatPayload as any).organizationName = tempFlat.organizationName;
  if (payload.technical?.expectedDuration) (flatPayload as any).duration = tempFlat.duration;
  if (payload.status) (flatPayload as any).status = tempFlat.status;

  const updated = await fetchJSON<any>(`${API_BASE}/api/challenges/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(flatPayload),
  });
  return mapBackendToProblemStatement(updated);
}

/** Admin review */
export async function reviewChallenge(id: string, status: SubmissionStatus, remarks?: string) {
  const action = status === 'Approved' ? 'APPROVE' : 'REJECT';
  const body: any = { action };
  if (remarks) body.remarks = remarks;
  await fetchJSON<any>(`${API_BASE}/api/admin/challenges/${id}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/** File upload */
export async function uploadFile(file: File, type: 'LOGO' | 'DOCUMENT') {
  const form = new FormData();
  form.append('file', file);
  form.append('type', type);

  const result = await fetchJSON<any>(`${API_BASE}/api/upload`, {
    method: 'POST',
    body: form,
  });
  return result;
}

/** Mappers */
function mapBackendToProblemStatement(backend: any): ProblemStatement {
  return {
    id: backend.id,
    company: {
      industryName: backend.domain ?? '',
      companyName: backend.organizationName ?? '',
      representativeName: backend.industry?.representativeName ?? '',
      designation: backend.industry?.designation ?? '',
      email: backend.industry?.email ?? '',
      phone: backend.industry?.phone ?? '',
      website: backend.industry?.website ?? '',
      industrySector: backend.domain ?? '',
    },
    details: {
      title: backend.title ?? '',
      description: backend.description ?? '',
      businessChallenge: backend.problemStatement ?? '',
      existingProcess: '',
      expectedOutcome: backend.description ?? '',
      projectObjectives: '',
    },
    technical: {
      requiredTechnologies: backend.tags ?? [],
      requiredSkills: [],
      preferredBranches: [],
      preferredAcademicYear: '',
      difficultyLevel: 'Medium',
      expectedDuration: backend.duration ?? '',
    },
    additional: {
      expectedDeliverables: '',
      additionalNotes: backend.budgetRange ?? '',
      fileAttachmentName: backend.attachmentUrls?.[0] ?? '',
      declarationAccepted: true,
    },
    status: mapBackendStatus(backend.status),
    submittedDate: backend.createdAt,
    reviewRemarks: backend.reviewRemarks,
  } as ProblemStatement;
}

function mapBackendStatus(status: string): SubmissionStatus {
  const map: Record<string, SubmissionStatus> = {
    PENDING_APPROVAL: 'Pending',
    OPEN: 'Approved',
    REJECTED: 'Rejected',
    DRAFT: 'Pending',
    UNDER_REVIEW: 'Pending',
    CLOSED: 'Approved',
    ARCHIVED: 'Rejected',
  };
  return map[status] || 'Pending';
}
