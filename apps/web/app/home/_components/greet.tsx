'use client';

import { useBaseDate } from "@/app/_providers/BaseDateProvider";
import styles from "@/styles/home/home.module.css";
import { useEffect, useRef, useState } from 'react';
import { ChevronUp, ChevronDown } from "lucide-react";

interface DailyCommentData {
  nickname: string;
  aiComment: string;
}

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/greet`;

export default function Greet() {
  const { baseDate, formattedDate } = useBaseDate();
  const [data, setData] = useState<DailyCommentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 더보기 관련 State & Ref
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
  const commentRef = useRef<HTMLDivElement>(null);
  const targetDate = formattedDate;

  useEffect(() => {
    // dailyComment 조회
    const fetchDailyComment = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_BASE_URL}?dailyDate=${targetDate}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error('데이터를 불러오는 데 실패했습니다.');
        }

        const result: DailyCommentData = await response.json();
        console.log("⑤ 결과", result);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 에러가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDailyComment();
  }, [targetDate]);

  // 텍스트가 5줄을 초과하는지 체크
  useEffect(() => {
    if (data && commentRef.current) {
      const element = commentRef.current;

      // 5줄 높이(line-height * 5줄)보다 내용 전체 높이(scrollHeight)가 큰지 확인
      // (1px 정도의 오차 방지를 위해 + 2px 여유)
      const hasOverflow = element.scrollHeight > element.clientHeight + 2;

      // 아직 접힌 상태(isExpanded === false)일 때만 overflow 여부를 판단하여 고정
      if (!isExpanded) {
        setIsOverflowing(hasOverflow);
      }
    }
  }, [data, isExpanded]);

  return (
    <div className={styles.greetingWrapper}>
      <p className={styles.greeting}>오늘도 반가워요,</p>
      <p className={styles.nickname}>
        <strong>하늘을 나는 코끼리</strong>님!
      </p>

      <div className={styles.aiComment}>
        {loading ? (
          <span></span>
        ) : error || !data ? (
          <span>데이터를 못 불러왔어요.</span>
        ) : (
          <div
            ref={commentRef}
            className={`${styles.commentContainer} ${isExpanded ? styles.expanded : styles.clamped}`}
          >
            <span>{data.aiComment}</span>
            {isOverflowing && (
              <button
                type="button"
                className={styles.inlineMoreBtn}
                onClick={() => setIsExpanded((prev) => !prev)}
                aria-label={isExpanded ? "접기" : "더보기"}
              >
                {isExpanded ? (
                  <ChevronUp size={16} className={styles.icon} />
                ) : (
                  <ChevronDown size={16} className={styles.icon} />
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}