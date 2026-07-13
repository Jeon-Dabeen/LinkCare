import Link from "next/link";


export default function SampleLink() {
  return (
    <aside style={{ 
      position: "fixed", bottom: 0, right: 0, 
      maxWidth: "var(--app-max-width)", 
      padding: "20px",
      fontWeight: 600,
      backgroundColor: "#fff"
    }}>
      <p>- auth -</p>
      <ul style={{
        listStyle: "number", paddingLeft: '15px',
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        marginTop: "10px"
      }}>
        <li><Link href="/auth/register">회원가입</Link></li>
      </ul>
    </aside>
  );
}


