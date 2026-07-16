import clsx from "clsx";
import styles from "@/styles/components/statusTag.module.css";

type Status = "normal" | "warning" | "danger";

type StatusTagProps = {
  status?: Status;
}

const STATUS_LABEL: Record<Status, string> = {
  normal: "정상",
  warning: "주의",
  danger: "위험",
}

export default function StatusTag({
  status = "normal"
}: StatusTagProps){

  return(
    <span 
      className={clsx(
        styles.statusTag,
        styles[status]
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}


