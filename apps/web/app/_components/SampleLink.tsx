'use client';


import Link from "next/link";
import { useState } from "react";
import { ButtonClose, ButtonIcon } from "./ui/Button";
import { ExternalLink } from "lucide-react";

export default function SampleLink() {

  const [open, setOpen] = useState(true);

  const handleOpen = () => {
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  }

  if(!open){
    return (
    <aside style={{ 
      position: "fixed", bottom: 0, right: 0, 
      maxWidth: "var(--app-max-width)", 
      padding: "20px",
      maxHeight: "calc(100vh - 30px)",
      fontWeight: 600,
      backgroundColor: "#fff",
      overflowY: "auto",
      zIndex: 9000
    }}>
        <ButtonIcon onClick={handleOpen}>
          <ExternalLink />
        </ButtonIcon>
      </aside>
    )
  }

  return (
    <aside style={{ 
      position: "fixed", bottom: 0, right: 0, 
      maxWidth: "var(--app-max-width)", 
      padding: "20px",
      maxHeight: "calc(100vh - 30px)",
      fontWeight: 600,
      backgroundColor: "#fff",
      overflowY: "auto",
      zIndex: 9000
    }}>
      <div style={{
        position: "sticky",
        top: "-20px",
        right: 0,
        background: "#fff"
      }}>
        <ButtonClose onClick={handleClose} />
      </div>

      <ul style={{
        listStyle: "number", paddingLeft: '15px',
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        margin: "10px 0 15px"
      }}>
        <li><Link href="/home">HOME</Link></li>
      </ul>

      <p>- auth -</p>
      <ul style={{
        listStyle: "number", paddingLeft: '15px',
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        margin: "10px 0 15px"
      }}>
        <li><Link href="/auth/register">회원가입</Link></li>
        <li><Link href="/auth/login">로그인</Link></li>
      </ul>

      <p>- daily -</p>
      <ul style={{
        listStyle: "number", paddingLeft: '15px',
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        margin: "10px 0 15px"
      }}>
        <li><Link href="/daily/writeBp">혈압 입력</Link></li>
        <li><Link href="/daily/bloodPressure">혈압</Link></li>
        <li><Link href="/daily/writeWeight">체중 입력</Link></li>
        <li><Link href="/daily/weight">체중</Link></li>
      </ul>

      <p>- meal -</p>
      <ul style={{
        listStyle: "number", paddingLeft: '15px',
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        margin: "10px 0 15px"
      }}>
        <li><Link href="/meal">식사 다이어리</Link></li>
        <li><Link href="/meal/record">식사 기록</Link></li>
      </ul>

      <p>- checkup -</p>
      <ul style={{
        listStyle: "number", paddingLeft: '15px',
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        margin: "10px 0 15px"
      }}>
        <li><Link href="/checkup">검진 대시보드</Link></li>
        <li><Link href="/checkup/uploadFile">건강검진 결과 파일 등록</Link></li>
        <li><Link href="/checkup/basic">신체 기본 지표</Link></li>
      </ul>

    </aside>
  );
}


