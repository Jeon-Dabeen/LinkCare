"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import clsx from "clsx";
import commonStyle from "@/styles/common.module.css";
import formStyle from "@/styles/components/form.module.css";

import Button from "@/app/_components/ui/Button";
import Input from "@/app/_components/ui/Input";
import { apiFetch } from "@/app/meal/_api/apiFetch";
import { toast } from "sonner";

export default function ChangePasswordPage() {
  const router = useRouter();

  // 폼 입력 상태 관리
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 비밀번호 일치 여부 확인
  const isPasswordMatch = newPassword !== "" && newPassword === confirmPassword;

  // 비밀번호 입력 관련 에러 메시지
  const passwordErrorMessage =
    confirmPassword && !isPasswordMatch
      ? "비밀번호가 일치하지 않습니다."
      : confirmPassword && isPasswordMatch
        ? "비밀번호가 일치합니다."
        : "";

  // 폼 제출 가능 여부 (모든 필드 입력 + 새 비밀번호 일치 + 로딩 중이 아님)
  const isFormValid =
    currentPassword.trim() !== "" &&
    newPassword.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    isPasswordMatch &&
    !isLoading;

  // 비밀번호 변경 요청 처리
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid) return;

    setIsLoading(true);
    try {
      const response = await apiFetch<{ success: boolean; message: string }>(
        `/profile/changePassword`,
        {
          method: "POST",
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        },
      );

      toast.success(response.message || "비밀번호가 변경되었습니다.");
      router.replace("/mypage");
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
        <h2 className={commonStyle.pageTitle}>비밀번호 변경</h2>
      </div>

      <div className={formStyle.formWrapper}>
        <form className={formStyle.form} onSubmit={handleSubmit}>
          {/* 현재 비밀번호 */}
          <div className={formStyle.formGroup}>
            <label htmlFor="currentPassword" className={formStyle.formLabel}>
              현재 비밀번호
            </label>
            <Input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="현재 비밀번호를 입력해 주세요"
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
          </div>

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

          <div className={clsx(formStyle.formButtonWrapper, formStyle.column)}>
            <div className={formStyle.formBox}>
              <Button
                type="submit"
                variant="primary"
                size="large"
                full
                disabled={!isFormValid}
              >
                {isLoading ? "변경 중..." : "비밀번호 변경"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
