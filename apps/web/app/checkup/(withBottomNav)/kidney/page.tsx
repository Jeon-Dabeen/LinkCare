import commonStyle from "@/styles/common.module.css";
import { ENV } from "@/env";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { KidneyClient } from "../_components/KidneyClient";
import { CheckupLineChart } from "../_components/CheckupLineChart";
import { KidneyDataProps } from "../_components/KidneyData";

export default async function Page() {
  const cookieStore = await cookies();
  console.log("cookieStore: " + cookieStore);
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    redirect("/auth/login");
  }

  const realToken = token.split(";")[0];
  console.log(`realToken: ${realToken}`);
  const response = await fetch(`${ENV.API_URL}/checkup/kidney`, {
    headers: { Cookie: `access_token=${realToken}` },
    cache: "no-store",
  });

  if (response.status === 404) {
    redirect("/checkup");
  }

  if (!response.ok) {
    throw new Error(`신장 수치 조회 실패: ${response.status}`);
  }

  const json = await response.json();

  const kidneyDataList = json.data;
  console.log(`data: ${JSON.stringify(kidneyDataList)}`);

  const { years, egfrs } = kidneyDataList.reduceRight(
    (acc: { years: number[]; egfrs: number[] }, d: KidneyDataProps) => {
      acc.years.push(d.year);
      acc.egfrs.push(d.egfr);
      return acc;
    },
    { years: [] as number[], egfrs: [] as number[] },
  );

  return (
    <section className={commonStyle.mainContent}>
      <KidneyClient kidneyDataList={kidneyDataList} />
      <CheckupLineChart
        lineChartData={[{ label: "eGFR", years, data: egfrs, unit: "mL/min" }]}
      />
    </section>
  );
}
