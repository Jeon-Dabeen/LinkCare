'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";

import clsx from "clsx";
import commonStyle from "@/styles/common.module.css";
import formStyle from "@/styles/components/form.module.css";

import Button from "@/app/_components/ui/Button";
import Input from "@/app/_components/ui/Input";


export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;

    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // HTTP-Only 쿠키를 수신하고 발급받기 위해 반드시 포함해야 함
        credentials: "include", 
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // 로그인 성공 시 쿠키는 브라우저에 자동으로 저장
        router.push("/home"); 
      } else {
        const errorData = await response.json().catch(() => ({}));
        setErrorMessage(errorData.message || "로그인에 실패했습니다. 정보를 확인해주세요.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage("서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={commonStyle.mainContent}>
      <div className={commonStyle.pageTitleWrapper}>
        <h2 className={commonStyle.pageTitle}>로그인</h2>
      </div>
      <div className={formStyle.formWrapper}>
        <form className={formStyle.form} onSubmit={handleSubmit}>
          <div className={formStyle.formGroup}>
            <label htmlFor="email" className={formStyle.formLabel}>
              이메일
            </label>
            <Input type="email" id="email" name="email" required />
          </div>
          <div className={formStyle.formGroup}>
            <label htmlFor="password" className={formStyle.formLabel}>
              비밀번호
            </label>
            <Input type="password" id="password" name="password" required />
          </div>

          {/* 에러 메시지 표시 영역 */}
          {errorMessage && (
            <div style={{ color: "red", fontSize: "14px", marginTop: "8px" }}>
              {errorMessage}
            </div>
          )}

          <div className={clsx(formStyle.formButtonWrapper, formStyle.column)}>
            <div className={clsx(formStyle.formBoxRight)}>
              <Button variant="text-primary" size="small">비밀번호를 잊으셨나요?</Button>
            </div>
            <div className={formStyle.formBox}>
              <Button type="submit" variant="primary" size="large" full disabled={loading}>
                {loading ? "로그인 중..." : "로그인"}
              </Button>
            </div>
            <div className={formStyle.formBoxCenter}>
              <Button variant="text-primary" size="small" onClick={() => router.push("/auth/register")}>회원가입</Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
