// src/contexts/TuteeFormContext.tsx  
'use client';  

import React, { createContext, useState, useContext } from 'react';  

interface TuteeFormData {  
  firstName?: string;
  lastName?: string;
  subjects?: string[];  
  education?: string | null;  
  days?: string[];  
  times?: string[];  
  minBudget?: number | null;  
  maxBudget?: number | null;  
}  

interface TuteeFormContextType {  
  formData: TuteeFormData;  
  updateFormData: (newData: Partial<TuteeFormData>) => void;  
}  

const TuteeFormContext = createContext<TuteeFormContextType | undefined>(undefined);  

export const TuteeFormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {  
  const [formData, setFormData] = useState<TuteeFormData>({});  

  const updateFormData = (newData: Partial<TuteeFormData>) => {  
    setFormData(prev => ({ ...prev, ...newData }));  
  };  

  return (  
    <TuteeFormContext.Provider value={{ formData, updateFormData }}>  
      {children}  
    </TuteeFormContext.Provider>  
  );  
};  

export const useTuteeForm = () => {  
  const context = useContext(TuteeFormContext);  
  if (context === undefined) {  
    throw new Error('useTuteeForm must be used within a TuteeFormProvider');  
  }  
  return context;  
};  