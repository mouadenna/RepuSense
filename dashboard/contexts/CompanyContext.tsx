"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import config from '@/lib/config';

interface CompanyContextType {
  selectedCompany: string | null;
  setSelectedCompany: (company: string) => void;
  clearSelectedCompany: () => void;
  isCompanySelected: boolean;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [selectedCompany, setSelectedCompanyState] = useState<string | null>(null);

  // Check for saved company in localStorage on initial load (client-side only)
  useEffect(() => {
    const savedCompany = localStorage.getItem('selectedCompany');
    if (savedCompany) {
      setSelectedCompanyState(savedCompany);
    }
  }, []);

  // Update localStorage when company changes
  const setSelectedCompany = (company: string) => {
    setSelectedCompanyState(company);
    localStorage.setItem('selectedCompany', company);
  };

  const clearSelectedCompany = () => {
    setSelectedCompanyState(null);
    localStorage.removeItem('selectedCompany');
  };

  return (
    <CompanyContext.Provider
      value={{
        selectedCompany,
        setSelectedCompany,
        clearSelectedCompany,
        isCompanySelected: !!selectedCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
} 