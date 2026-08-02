"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import styles from "@/styles/components/confirmModal.module.css";

interface ConfirmOptions {
  title?: string;
  confirmText?: string;
  cancelText?: string;
}

interface ConfirmConfig extends ConfirmOptions {
  isOpen: boolean;
  message: string;
  resolve: (value: boolean) => void;
}

interface ConfirmContextType {
  customConfirm: (
    message: string,
    options?: ConfirmOptions,
  ) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ConfirmConfig>({
    isOpen: false,
    message: "",
    resolve: () => {},
  });

  const customConfirm = useCallback(
    (message: string, options?: ConfirmOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        setConfig({
          isOpen: true,
          message,
          title: options?.title || "확인",
          confirmText: options?.confirmText || "확인",
          cancelText: options?.cancelText || "취소",
          resolve,
        });
      });
    },
    [],
  );

  const handleConfirm = useCallback(() => {
    config.resolve(true);
    setConfig((prev) => ({ ...prev, isOpen: false }));
  }, [config]);

  const handleCancel = useCallback(() => {
    config.resolve(false);
    setConfig((prev) => ({ ...prev, isOpen: false }));
  }, [config]);

  // Esc 키 지원
  useEffect(() => {
    if (!config.isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [config.isOpen, handleCancel]);

  return (
    <ConfirmContext.Provider value={{ customConfirm }}>
      {children}
      {config.isOpen && (
        <div className={styles.overlay} onClick={handleCancel}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            {config.title && <h3 className={styles.title}>{config.title}</h3>}
            <p className={styles.message}>{config.message}</p>
            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={styles.btnCancel}
                onClick={handleCancel}
              >
                {config.cancelText}
              </button>
              <button
                type="button"
                className={styles.btnConfirm}
                onClick={handleConfirm}
                autoFocus
              >
                {config.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error(
      "useConfirm은 ConfirmProvider 내부에서만 사용할 수 있습니다.",
    );
  }
  return context;
}
