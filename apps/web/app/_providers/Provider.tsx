"use client";

import { ReactNode } from "react";
import { BaseDateProvider } from "./BaseDateProvider";
import { AlertProvider } from "./AlertContext";
import { ConfirmProvider } from "./ConfirmContext";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <BaseDateProvider>
      <ConfirmProvider>
        <AlertProvider>{children}</AlertProvider>
      </ConfirmProvider>
    </BaseDateProvider>
  );
}
