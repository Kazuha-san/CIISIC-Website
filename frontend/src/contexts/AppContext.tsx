import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProblemStatement, User, SubmissionStatus } from '../types';
import { login as apiLogin, logout as apiLogout, getSession, fetchChallenges, createChallenge, updateChallenge, reviewChallenge } from '../lib/api';

export interface ToastType {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentUser: User | null;
  submissions: ProblemStatement[];
  toast: ToastType | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  addSubmission: (submission: Omit<ProblemStatement, 'id' | 'status' | 'submittedDate'>) => Promise<string>;
  updateSubmissionStatus: (id: string, status: SubmissionStatus, remarks?: string) => Promise<void>;
  updateSubmission: (submission: ProblemStatement) => Promise<void>;
  resetData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const mapUserRole = (user: any): User => {
  const roleMap: Record<string, 'industry' | 'admin'> = {
    INDUSTRY_SPOC: 'industry',
    SUPER_ADMIN: 'admin',
    CII_ADMIN: 'admin',
    INSTITUTION_SPOC: 'admin',
  };
  return {
    ...user,
    role: roleMap[user.role] || 'industry',
  };
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial user or check local storage
  // Duplicate initial user load removed; state will be set after session fetch

  // Load submissions from backend or fallback to localStorage
  const [submissions, setSubmissions] = useState<ProblemStatement[]>([]);

  // Load current user session
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ciisic_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Fetch session and challenges on mount
  useEffect(() => {
    (async () => {
      const user = await getSession();
      if (user) {
        setCurrentUser(mapUserRole(user));
      } else {
        setCurrentUser(null);
      }
      try {
        const challenges = await fetchChallenges();
        setSubmissions(challenges);
      } catch (err) {
        console.error("Failed to fetch challenges:", err);
      }
    })();
  }, []);

  // Sync submissions to localStorage (optional)
  useEffect(() => {
    if (submissions.length) {
      localStorage.setItem('ciisic_submissions', JSON.stringify(submissions));
    }
  }, [submissions]);

  // Global toast notification state
  const [toast, setToast] = useState<ToastType | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  // Sync to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ciisic_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ciisic_current_user');
    }
  }, [currentUser]);



  const login = async (email: string, password: string) => {
    try {
      const user = await apiLogin(email, password);
      setCurrentUser(mapUserRole(user));
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  const logout = async () => {
    await apiLogout();
    setCurrentUser(null);
  };

  const addSubmission = async (submissionData: Omit<ProblemStatement, 'id' | 'status' | 'submittedDate'>) => {
    const created = await createChallenge(submissionData);
    setSubmissions((prev) => [created, ...prev]);
    return created.id;
  };

  const updateSubmissionStatus = async (id: string, status: SubmissionStatus, remarks?: string) => {
    await reviewChallenge(id, status, remarks);
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === id ? { ...sub, status, reviewRemarks: remarks } : sub
      )
    );
  };

  const updateSubmission = async (updated: ProblemStatement) => {
    const saved = await updateChallenge(updated.id, updated);
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === saved.id ? saved : sub))
    );
  };

  const resetData = () => {
    setCurrentUser(null);
    setSubmissions([]);
    localStorage.removeItem('ciisic_current_user');
    localStorage.removeItem('ciisic_submissions');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        submissions,
        toast,
        showToast,
        hideToast,
        login,
        logout,
        addSubmission,
        updateSubmissionStatus,
        updateSubmission,
        resetData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
