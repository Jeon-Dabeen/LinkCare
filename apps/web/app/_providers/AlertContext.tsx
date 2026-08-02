"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import styles from "@/styles/components/alertModal.module.css";

interface AlertOptions {
  title?: string;
  buttonText?: string;
}

interface AlertConfig extends AlertOptions {
  isOpen: boolean;
  message: string;
  resolve: () => void;
}

interface AlertContextType {
  customAlert: (message: string, options?: AlertOptions) => Promise<void>;
}

const AlertContext = createContext<AlertContextType | null>(null);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AlertConfig>({
    isOpen: false,
    message: "",
    resolve: () => {},
  });

  const customAlert = useCallback(
    (message: string, options?: AlertOptions): Promise<void> => {
      return new Promise((resolve) => {
        setConfig({
          isOpen: true,
          message,
          title: options?.title || "알림",
          buttonText: options?.buttonText || "확인",
          resolve,
        });
      });
    },
    [],
  );

  const handleClose = useCallback(() => {
    config.resolve();
    setConfig((prev) => ({ ...prev, isOpen: false }));
  }, [config]);

  // 키보드 이벤트 (Enter, Esc)
  useEffect(() => {
    if (!config.isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [config.isOpen, handleClose]);

  return (
    <AlertContext.Provider value={{ customAlert }}>
      {children}

      {config.isOpen && (
        <div className={styles.overlay} onClick={handleClose}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            {config.title && <h3 className={styles.title}>{config.title}</h3>}
            <p className={styles.message}>{config.message}</p>
            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={styles.btnConfirm}
                onClick={handleClose}
                autoFocus
              >
                {config.buttonText}
              </button>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
}

// 사용할 때 부르는 훅
export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert는 AlertProvider 내부에서만 사용할 수 있습니다");
  }
  return context;
}
