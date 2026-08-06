import commonStyle from "@/styles/common.module.css";
import { ENV } from "@/env";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { CheckupLineChart } from "../_components/CheckupLineChart";
import { Liver, LiverDataProps } from "../_components/LiverData";
import { LiverClient } from "../_components/LiverClient";

export default async function Page() {
  const cookieStore = await cookies();
  console.log("cookieStore: " + cookieStore);
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    redirect("/auth/login");
  }

  const realToken = token.split(";")[0];
  console.log(`realToken: ${realToken}`);

  const genderResponse = await fetch(`${ENV.API_URL}/profile/gender`, {
    headers: { Cookie: `access_token=${realToken}` },
    cache: "no-store",
  });

  const genderJson = await genderResponse.json();

  const genderData = genderJson.data;
  console.log(genderData.gender);

  const dataResponse = await fetch(`${ENV.API_URL}/checkup/liver`, {
    headers: { Cookie: `access_token=${realToken}` },
    cache: "no-store",
  });

  if (dataResponse.status === 404) {
    redirect("/checkup");
  }

  if (!dataResponse.ok) {
    throw new Error(`간 수치 조회 실패: ${dataResponse.status}`);
  }

  const json = await dataResponse.json();

  const liverDataList = json.data;
  console.log(`data: ${JSON.stringify(liverDataList)}`);

  const { years, alts, asts, ygpts } = liverDataList.reduceRight(
    (
      acc: { years: number[]; alts: number[]; asts: number[]; ygpts: number[] },
      d: Liver,
    ) => {
      acc.years.push(d.year);
      acc.alts.push(d.alt);
      acc.asts.push(d.ast);
      acc.ygpts.push(d.ygtp);
      return acc;
    },
    {
      years: [] as number[],
      alts: [] as number[],
      asts: [] as number[],
      ygpts: [] as number[],
    },
  );

  return (
    <section className={commonStyle.mainContent}>
      <LiverClient {...{ liverDataList, gender: genderData.gender }} />
      <CheckupLineChart
        {...{
          lineChartData: [
            { label: "ALT", years, data: alts, unit: "U/L" },
            { label: "AST", years, data: asts, unit: "U/L" },
            { label: "감마지피티(y-GPT)", years, data: ygpts, unit: "U/L" },
          ],
          max: 40,
          min: 0,
        }}
      />
    </section>
  );
}
