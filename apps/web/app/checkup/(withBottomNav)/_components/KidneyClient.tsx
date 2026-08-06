"use client";

import commonStyle from "@/styles/common.module.css";
import EmptyPage from "@/app/_components/ui/EmptyPage";
import Tabs from "@/app/_components/ui/Tabs";

import { useState } from "react";
import { FileQuestionMark } from "lucide-react";

import { KidneyData, KidneyDataProps } from "./KidneyData";

interface KidneyClientProps {
  kidneyDataList: KidneyDataProps[];
}

export function KidneyClient({ kidneyDataList }: KidneyClientProps) {
  const [selectedYear, setSelectedYear] = useState(kidneyDataList[0]?.year);

  console.log(`selectedYear: ${selectedYear}`);
  const selectedData = kidneyDataList.find((d) => d.year === selectedYear);

  if (!selectedData) {
    return (
      <EmptyPage
        icon={<FileQuestionMark size={32} />}
        title="선택된 검진 데이터를 찾을 수 없어요"
      />
    );
  }

  const years = kidneyDataList.map((d) => d.year);

  const handleYearChange = (value: string) => {
    if (!value && value === undefined) return;
    setSelectedYear(+value.substring(4));
  };

  return (
    <>
      <header className={commonStyle.pageTitleWrapper}>
        <div className={commonStyle.left}>
          <h2 className={commonStyle.pageTitle}>신장</h2>
        </div>
      </header>

      <Tabs
        defaultValue={`year${selectedData.year}`}
        value={`year${selectedData.year}`}
        onChange={handleYearChange}
      >
        <Tabs.Nav>
          {[...years].reverse().map((y) => (
            <Tabs.NavItem key={y} value={`year${y}`} title={`${y}`} />
          ))}
        </Tabs.Nav>

        <KidneyData {...selectedData} />
      </Tabs>
    </>
  );
}
