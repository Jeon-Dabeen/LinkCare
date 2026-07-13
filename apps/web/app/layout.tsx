import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/reset.css";
import "@/styles/variables.css";
import "@/styles/globals.css";
import style from "@/styles/layout/layout.module.css";

import Header from "@/app/_components/layout/Header";
import SampleLink from "./_components/SampleLink";


const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "LinkCare",
  description: "AI 기반 맞춤형 웰니스 케어 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pretendard.variable}`}>
        <SampleLink />
        <div className={style.wrapper}>
          <aside />
          <div className={style.app}>
            <Header />
            <main className={style.main}>{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
