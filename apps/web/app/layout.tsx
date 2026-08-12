import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "@/styles/reset.css";
import "@/styles/variables.css";
import "@/styles/globals.css";
import style from "@/styles/layout/layout.module.css";

import Header from "@/app/_components/layout/Header";
import SampleLink from "./_components/SampleLink";
import { Providers } from "./_providers/Provider";
import { Toaster } from "sonner";


const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "LinkCare",
  description: "AI 기반 맞춤형 웰니스 케어 서비스",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // user-scalable=no 와 동일합니다.
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pretendard.variable}`}>
        {/* <SampleLink /> */}
        <div className={style.wrapper}>
          <aside />
          <Providers>
            <div className={style.app}>
              <Header />
              <main className={style.main}>{children}</main>
            </div>
          </Providers>
        </div>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
