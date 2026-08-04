'use client';

import { useState } from "react";
import commonStyle from "@/styles/common.module.css";
import Grid from "@/app/_components/ui/Grid";
import Button from "@/app/_components/ui/Button";
import { CheckupAI } from "./CheckupAI";
import { CheckupData } from "./CheckupData";
// 기존 page.tsx에 있던 Interface 사용
import { CheckupDashBoardResponse } from "@/types/checkup";
import Link from "next/link";
import { CirclePlus } from "lucide-react";

interface Props {
  checkupList: CheckupDashBoardResponse[];
}

export function CheckupDashboardClient({ checkupList }: Props) {
  // 기본값으로 가장 최근 검진(첫 번째 요소) 데이터 선택
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!checkupList || checkupList.length === 0) {
    return <div>검진 데이터가 없습니다.</div>;
  }

  // 현재 선택된 검진 데이터
  const selectedData = checkupList[selectedIndex];

  if (!selectedData) {
    return <div>선택된 검진 데이터를 찾을 수 없습니다.</div>;
  }

  return (
    <div>
      <header className={commonStyle.pageTitleWrapper}>
        <div className={commonStyle.left}>
          <h2 className={commonStyle.pageTitle}>건강검진</h2>
        </div>
        <div className={commonStyle.right}>
          {checkupList.map((item, index) => {
            const label = `${item.year}`;

            return (
              <Button
                key={item.id}
                variant={selectedIndex === index ? "text-primary" : "text-secondary"}
                onClick={() => setSelectedIndex(index)}
              >
                {label}
              </Button>
            );
          })}
          <Link href="/checkup/upload">
            <Button variant="text-primary">
              <CirclePlus />
              {/* <span>건강검진 데이터 추가</span> */}
            </Button>
          </Link>
        </div>
      </header>

      {/* 선택된 데이터로 컴포넌트 호출 */}
      <Grid>
        <CheckupAI id={selectedData.id} />
        <CheckupData {...selectedData} />
      </Grid>
    </div>
  );
}