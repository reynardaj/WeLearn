// src/components/Providers.tsx  
'use client';  

import { TuteeFormProvider } from '@/contexts/TuteeFormContext';  

export function Providers({ children }: { children: React.ReactNode }) {  
  return (  
    <TuteeFormProvider>  
      {children}  
    </TuteeFormProvider>  
  );  
}  