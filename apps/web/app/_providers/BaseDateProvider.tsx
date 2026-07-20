'use client';

import dayjs, { Dayjs } from 'dayjs';
import { usePathname } from 'next/navigation';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';



type BaseDateContextType = {
  baseDate: Dayjs;
  formattedDate: string;
};

type BaseDateProps = {
  children: ReactNode;
}

const BaseDateContext = createContext<BaseDateContextType | undefined>(undefined);


export function BaseDateProvider({ children }: BaseDateProps){

  const pathname = usePathname();
  const [baseDate, setBaseDate] = useState(dayjs());

  useEffect(() => {
    setBaseDate(dayjs());
  }, [pathname]);


  return (
    <BaseDateContext.Provider 
      value={{
        baseDate,
        formattedDate: baseDate.format("YYYY-MM-DD")
      }}
    >
      {children}
    </BaseDateContext.Provider>
  )
}


export const useBaseDate = () => {
  const context = useContext(BaseDateContext);

  if (!context) {
    throw new Error("useBaseDate must be used within BaseDateProvider");
  }

  return context;
};




