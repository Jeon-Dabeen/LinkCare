import BottomNav from "@/app/_components/layout/BottomNav";


export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  )
}

