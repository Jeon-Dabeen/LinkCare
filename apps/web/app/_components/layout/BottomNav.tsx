
import Link from "next/link";
import { FilePenLine, House, UserRound } from "lucide-react";

import styles from "@/styles/layout/bottomNav.module.css";


export default function BottomNav(){

  return (
    <div className={styles.bottomNavWrapper}>
      <Link href="" className={styles.link}>
        <FilePenLine />
        <span>건강검진</span>
      </Link>
      <Link href="/home" className={styles.link}>
        <House />
        <span>홈</span>
      </Link>
      <Link href="/mypage" className={styles.link}>
        <UserRound />
        <span>마이페이지</span>
      </Link>
    </div>
  )
}

