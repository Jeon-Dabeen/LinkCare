import { ChevronRight } from "lucide-react";
import styles from "@/styles/mypage/mypage.module.css";

import { ButtonIcon } from "@/app/_components/ui/Button";

interface MyCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onClick: () => void;
}

export default function MyCard({ icon, label, value, onClick }: MyCardProps) {
  return (
    <div className={styles.item}>
      <span className={styles.icon}>{icon}</span>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
      <ButtonIcon color="textLight" onClick={onClick}>
        <ChevronRight size={16} />
      </ButtonIcon>
    </div>
  );
}
