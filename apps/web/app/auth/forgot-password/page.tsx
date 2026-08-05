"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiFetch } from "@/utils/api/apiFetch";

import clsx from "clsx";
import commonStyle from "@/styles/common.module.css";
import formStyle from "@/styles/components/form.module.css";

import Button from "@/app/_components/ui/Button";
import Input from "@/app/_components/ui/Input";

export default function ForgotPasswordPage() {
  const router = useRouter();

  //입력값 상태
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //비밀번호 형식 확인
  const isValidNewPassword = newPassword.length >= 6;

  const newPasswordMessage = isValidNewPassword
    ? "사용할 수 있는 비밀번호예요"
    : "비밀번호는 6자 이상 입력해 주세요";

  //비밀번호 일치 여부
  const isPasswordMatch = newPassword !== "" && newPassword === confirmPassword;

  //비밀번호 확인 메시지
  const passwordErrorMessage =
    confirmPassword && !isPasswordMatch
      ? "변경할 비밀번호가 서로 달라요"
      : confirmPassword && isPasswordMatch
        ? "변경할 비밀번호가 일치해요"
        : "";

  //이메일 + 비밀번호 입력 + 비밀번호 일치 + 로딩 여부
  const isFormValid =
    email.trim() !== "" &&
    newPassword.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    isValidNewPassword &&
    isPasswordMatch &&
    !isLoading;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid) return;

    setIsLoading(true);

    try {
      const response = await apiFetch<{
        success: boolean;
        message: string;
      }>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, newPassword }),
      });
      toast.success(response.message || "비밀번호가 재설정되었습니다.");

      router.replace("/auth/login");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={commonStyle.mainContent}>
      <div className={commonStyle.pageTitleWrapper}>
        <h2 className={commonStyle.pageTitle}>비밀번호 재설정</h2>
      </div>

      <div className={formStyle.formWrapper}>
        <form className={formStyle.form} onSubmit={handleSubmit}>
          {/* 이메일 */}
          <div className={formStyle.formGroup}>
            <label htmlFor="email" className={formStyle.formLabel}>
              이메일
            </label>

            <Input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="가입한 이메일을 입력해 주세요"
              required
            />
          </div>

          {/* 변경할 비밀번호 */}
          <div className={formStyle.formGroup}>
            <label htmlFor="newPassword" className={formStyle.formLabel}>
              변경할 비밀번호
            </label>

            <Input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="새로운 비밀번호를 입력해 주세요"
              required
            />

            {/* 비밀번호 형식 확인 메시지 */}
            {newPassword && (
              <p
                className={
                  isValidNewPassword
                    ? commonStyle.textSuccess
                    : commonStyle.textError
                }
              >
                {newPasswordMessage}
              </p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div className={formStyle.formGroup}>
            <label htmlFor="confirmPassword" className={formStyle.formLabel}>
              비밀번호 확인
            </label>

            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="새로운 비밀번호를 다시 입력해 주세요"
              required
            />

            {/* 비밀번호 일치 상태 메시지 */}
            {passwordErrorMessage && (
              <p
                className={
                  isPasswordMatch
                    ? commonStyle.textSuccess
                    : commonStyle.textError
                }
              >
                {passwordErrorMessage}
              </p>
            )}
          </div>

          <div className={clsx(formStyle.formButtonWrapper, formStyle.column)}>
            <div className={formStyle.formBox}>
              <Button
                type="submit"
                variant="primary"
                size="large"
                full
                disabled={!isFormValid}
              >
                {isLoading ? "재설정 중..." : "비밀번호 재설정"}
              </Button>
            </div>

            <div className={formStyle.formBoxCenter}>
              <Button
                type="button"
                variant="text-primary"
                size="small"
                onClick={() => router.push("/auth/login")}
              >
                로그인으로 돌아가기
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
