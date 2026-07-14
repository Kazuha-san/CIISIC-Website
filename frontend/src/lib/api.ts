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
  //    Auth.js always returns a 302 from this endpoint regardless of the body contents —
  //    redirect:'false' is only honoured by the next-auth/react client helper, NOT the raw endpoint.
  //    Using redirect:'manual' tells the browser NOT to follow the redirect, but the browser still
  //    stores the Set-Cookie header from the 302 response, so the session cookie is set correctly.
  await fetch(`${API_BASE}/api/auth/callback/credentials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ email, password, csrfToken }).toString(),
    credentials: 'include',
    redirect: 'manual',  // opaqueredirect — cookie is stored, we don't follow
  });

  // 3. The callback response is opaque (status 0, type 'opaqueredirect') — we can't read it.
  //    Instead fetch the session; if the cookie was set correctly this will return the user.
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
  await fetch(`${API_BASE}/api/auth/signout`, { method: 'POST', credentials: 'include' });
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

export async function createChallenge(payload: Omit<ProblemStatement, 'id' | 'status' | 'submittedDate'>): Promise<ProblemStatement> {
  const created = await fetchJSON<any>(`${API_BASE}/api/challenges`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return mapBackendToProblemStatement(created);
}

export async function updateChallenge(id: string, payload: Partial<ProblemStatement>) {
  const updated = await fetchJSON<any>(`${API_BASE}/api/challenges/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return mapBackendToProblemStatement(updated);
}

/** Admin review */
export async function reviewChallenge(id: string, status: SubmissionStatus, remarks?: string) {
  const body: any = { status };
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
