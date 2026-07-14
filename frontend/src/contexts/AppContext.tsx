import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProblemStatement, User, SubmissionStatus } from '../types';
import { MOCK_USERS, INITIAL_SUBMISSIONS } from '../data/mockData';

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
  login: (email: string, role: 'industry' | 'admin') => { success: boolean; error?: string };
  logout: () => void;
  addSubmission: (submission: Omit<ProblemStatement, 'id' | 'status' | 'submittedDate'>) => string;
  updateSubmissionStatus: (id: string, status: SubmissionStatus, remarks?: string) => void;
  updateSubmission: (submission: ProblemStatement) => void;
  resetData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial user or check local storage
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ciisic_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Load submissions or fall back to mock data
  const [submissions, setSubmissions] = useState<ProblemStatement[]>(() => {
    const saved = localStorage.getItem('ciisic_submissions');
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

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

  useEffect(() => {
    localStorage.setItem('ciisic_submissions', JSON.stringify(submissions));
  }, [submissions]);

  const login = (email: string, role: 'industry' | 'admin') => {
    // Find the matching mock user
    const foundUser = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.role === role
    );

    if (foundUser) {
      setCurrentUser(foundUser);
      return { success: true };
    }

    // Dynamic generation if they input a new email to make it extremely flexible
    if (email.includes('@')) {
      const generatedUser: User = {
        id: `user_${Date.now()}`,
        name: email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
        email: email,
        role: role,
        companyName: role === 'industry' ? 'CII Industry Partner' : 'CII Directorate',
        designation: role === 'industry' ? 'General Manager' : 'Officer'
      };
      setCurrentUser(generatedUser);
      return { success: true };
    }

    return { success: false, error: 'Please enter a valid email address.' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addSubmission = (submissionData: Omit<ProblemStatement, 'id' | 'status' | 'submittedDate'>) => {
    const nextIdNum = submissions.reduce((max, sub) => {
      const num = parseInt(sub.id.replace('PS-2026-', ''));
      return isNaN(num) ? max : Math.max(max, num);
    }, 3); // Start after our seeded ones

    const newId = `PS-2026-0${nextIdNum + 1}`;
    const newSubmission: ProblemStatement = {
      ...submissionData,
      id: newId,
      status: 'Pending',
      submittedDate: new Date().toISOString()
    };

    setSubmissions((prev) => [newSubmission, ...prev]);
    return newId;
  };

  const updateSubmissionStatus = (id: string, status: SubmissionStatus, remarks?: string) => {
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === id ? { ...sub, status, reviewRemarks: remarks } : sub
      )
    );
  };

  const updateSubmission = (updated: ProblemStatement) => {
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === updated.id ? updated : sub))
    );
  };

  const resetData = () => {
    setCurrentUser(null);
    setSubmissions(INITIAL_SUBMISSIONS);
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
