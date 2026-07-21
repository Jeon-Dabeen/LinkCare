import clsx from "clsx";
import styles from "@/styles/components/statusTag.module.css";
import {StatusType} from "@/types/statusType";

type Status = StatusType;

type StatusTagProps = {
  status: Status;
  label: string;
}


export default function StatusTag({
  status,
  label
}: StatusTagProps){

  return(
    <span 
      className={clsx(
        styles.statusTag,
        styles[status]
      )}
    >
      {label}
    </span>
  )
}


