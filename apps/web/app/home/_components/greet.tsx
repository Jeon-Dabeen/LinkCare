'use client';

import { useBaseDate } from "@/app/_providers/BaseDateProvider";
import styles from "@/styles/home/home.module.css";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronUp, ChevronDown, RotateCw } from "lucide-react";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/greet`;

// 공통 API 호출 헬퍼 함수
const fetchCommentApi = async (url: string, options: RequestInit, errorMsg: string) => {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  });

  if (!res.ok) throw new Error(errorMsg);

  const data: { aiComment: string } = await res.json();
  return data.aiComment;
};

export default function Greet() {
  const { baseDate, formattedDate: targetDate } = useBaseDate();
  const [nickName, setNickName] = useState<string>('');

  const [aiComment, setAiComment] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0); // 재생성
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 더보기 관련 State & Ref
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
  const commentRef = useRef<HTMLDivElement>(null);

  // nickName 조회
  useEffect(() => {
    fetch(`${API_BASE_URL}/name`, { credentials: "include" })
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data: { nickName: string }) => setNickName(data.nickName))
      .catch(() => {
        setNickName('자랑스러운 우리 회원');
      });
  }, []);

  // dailyComment 조회
  // [GET] 조회 함수
  const fetchDailyComment = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const comment = await fetchCommentApi(
        `${API_BASE_URL}?dailyDate=${targetDate}`,
        { method: "GET" },
        "데이터를 불러오지 못했어요."
      );
      setAiComment(comment);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [targetDate]);

  // [PATCH] 재생성 함수
  const handleRegenerate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;

    try {
      setLoading(true);
      setError(null);
      setIsExpanded(false);

      const comment = await fetchCommentApi(
        API_BASE_URL,
        { method: "PATCH", body: JSON.stringify({ dailyDate: targetDate }) },
        "재생성에 실패했어요."
      );
      setAiComment(comment);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyComment();
  }, [fetchDailyComment]);

  // 텍스트가 5줄을 초과하는지 체크
  useEffect(() => {
    if (aiComment && commentRef.current) {
      const element = commentRef.current;
      const hasOverflow = element.scrollHeight > element.clientHeight + 2;

      // 접힌 상태일 때만 overflow 여부를 판단하여 고정
      if (!isExpanded) {
        setIsOverflowing(hasOverflow);
      }
    }
  }, [aiComment, isExpanded]);

  return (
    <div className={styles.greetingWrapper}>
      <p className={styles.greeting}>오늘도 반가워요,</p>
      <p className={styles.nickname}>
        <span><strong>{nickName} </strong>님!</span>
        {loading ? (
          <span></span>
        ) : (<button
          type="button"
          className={styles.refreshBtn}
          onClick={handleRegenerate} /* 실행할 재생성 함수 */
          disabled={loading}        /* 로딩 중 중복 클릭 방지 */
          aria-label="AI 건강분석 다시 생성"
        >
          <RotateCw
            size={16}
            className={`${styles.refreshIcon} ${loading ? styles.spinning : ''}`}
          />
        </button>)}
      </p>

      <div className={styles.aiComment}>
        {loading ? (
          <span></span>
        ) : error || !aiComment ? (
          <span>데이터를 못 불러왔어요.</span>
        ) : (
          <div
            ref={commentRef}
            className={`${styles.commentContainer} ${isExpanded ? styles.expanded : styles.clamped}`}
          >
            <span>{aiComment}</span>
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