import Link from "next/link";

import style from "@/styles/layout/header.module.css";

export default function Header() {
  return (
    <header className={style.header}>
      <Link href="/" className={style.link}>
        <h1 className={style.logo}>
          <span>Link</span><span>Care</span>
        </h1>
      </Link>
    </header>
  );
}
