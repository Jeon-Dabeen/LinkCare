'use client';

import { useCallback, useEffect, useState } from "react";
import { MessageSquareCheck, Loader } from "lucide-react";
import styles from "@/styles/checkup/checkupDash.module.css";
import loadingStyles from "@/styles/components/statePage.module.css";
import Grid from "@/app/_components/ui/Grid";
import Card from "@/app/_components/ui/Card";
import { ENV } from "@/env";

// Props 인터페이스 정의
interface CheckupAIProps {
  id: number;
}

// API 호출 헬퍼 함수
const fetchCommentApi = async (url: string) => {
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) throw new Error("AI 코멘트를 불러오는데 실패했습니다.");

  const data: { aiComment: string } = await res.json();
  return data.aiComment;
};

// Main 컴포넌트 (async 제거 및 Props 구조분해할당 적용)
export function CheckupAI({ id }: CheckupAIProps) {
  const [aiComment, setAiComment] = useState<string | null>(null);
  const [aiGuide, setAiGuide] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDailyComment = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const comment = await fetchCommentApi(`${ENV.API_URL}/checkup/ai/${id}`);
      const aiCommentArr = comment?.split("\n\n") ?? [];

      setAiGuide(aiCommentArr[1] ?? "건강 데이터 분석에 오류가 발생했어요.");
      setAiComment(aiCommentArr[0] ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // 1. 컴포넌트 마운트 및 id 변경 시 API 데이터 페칭
  useEffect(() => {
    if (id) {
      fetchDailyComment();
    }
  }, [id, fetchDailyComment]);

  // 2. 1초 이상 로딩 지속 시 스피너 노출
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setTimeout(() => setShowLoader(true), 1000);
    } else {
      setShowLoader(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <Grid.ItemFull>
      <Card variant="color">
        {showLoader ? (
          <div className={loadingStyles.icon}>
            <Loader size={32} className={styles.loading} />
            <div className={styles.description}>
              링크케어 AI가 데이터를 분석하고 있어요...
            </div>
          </div>
        ) : error ? (
          <span>데이터를 못 불러왔어요.</span>
        ) : (
          <>
            <Card.Header icon={<MessageSquareCheck />} title={aiGuide ?? "AI 분석 가이드"} />
            <Card.Body noTopPadding>
              <div className={styles.aiComment}>
                {aiComment?.replace("\n", " ")}
              </div>
            </Card.Body>
          </>
        )}
      </Card>
    </Grid.ItemFull>
  );
}