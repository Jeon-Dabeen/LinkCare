import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { CirclePlus } from "lucide-react";

import commonStyle from "@/styles/common.module.css";
import Button from "@/app/_components/ui/Button";
import { ENV } from "@/env";
import { CheckupDashboardClient } from "../_components/CheckupDashboardClient";

export default async function Page() {
  const cookieStore = await cookies();
  console.log("cookieStore: " + cookieStore);
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    redirect("/auth/login");
  }

  const realToken = token.split(";")[0];
  console.log(`realToken: ${realToken}`);
  const response = await fetch(`${ENV.API_URL}/checkup`, {
    headers: { Cookie: `access_token=${realToken}` },
    cache: "no-store",
  });

  if (response.status === 404) {
    redirect("/checkup/upload");
  }

  if (!response.ok) {
    throw new Error(`검진 결과 조회 실패: ${response.status}`);
  }

  const json = await response.json();

  // json.data가 배열 형태 [ { id: 1, ... }, { id: 2, ... } ]
  const checkupList = json.data;
  console.log(`data: ${JSON.stringify(checkupList)}`);

  return (
    <section className={commonStyle.mainContent}>
      {/* 배열 데이터 전체를 클라이언트 컴포넌트로 전달 */}
      <CheckupDashboardClient checkupList={checkupList} />
    </section>
  );
}
