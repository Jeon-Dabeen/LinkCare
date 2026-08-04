"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import Button from "@/app/_components/ui/Button";
import commonStyle from "@/styles/common.module.css";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 서버 컴포넌트에서 throw된 에러 메시지를 Toast로 전송
    toast.error(error.message || "데이터를 불러오는 중 오류가 발생했어요..");
  }, [error]);

  return (
    <section className={commonStyle.mainContent}>
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <h2>검진 데이터를 불러올 수 없어요.</h2>
        <p style={{ margin: "12px 0 24px", color: "#666" }}>
          서버 통신에 실패했거나 일시적인 오류일 수 있습니다.
        </p>
        <Button variant="primary" size="medium" onClick={() => reset()}>
          다시 시도하기
        </Button>
      </div>
    </section>
  );
}