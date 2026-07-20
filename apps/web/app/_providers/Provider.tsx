'use client';

import { ReactNode } from "react";
import { BaseDateProvider } from "./BaseDateProvider";


type ProvidersProps = {
  children: ReactNode;
}

export function Providers({
  children
}: ProvidersProps){
  return(
    <BaseDateProvider>
      {children}
    </BaseDateProvider>
  )
}

