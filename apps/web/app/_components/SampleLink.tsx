import Link from "next/link";


export default function SampleLink() {
  return (
    <aside style={{ 
      position: "fixed", bottom: 0, right: 0, 
      maxWidth: "var(--app-max-width)", 
      padding: "20px",
      fontWeight: 600,
      backgroundColor: "#fff",
      zIndex: 9000
    }}>

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
        <li><Link href="/daily/bloodPressure">혈압</Link></li>
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
      </ul>

    </aside>
  );
}


