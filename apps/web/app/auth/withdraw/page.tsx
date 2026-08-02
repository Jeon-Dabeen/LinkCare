"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import commonStyle from "@/styles/common.module.css";
import styles from "@/styles/auth/withdraw.module.css";
import formStyle from "@/styles/components/form.module.css";

import CheckBox from "@/app/_components/ui/Checkbox";
import Button from "@/app/_components/ui/Button";
import BottomSheet from "@/app/_components/ui/BottomSheet";
import Input from "@/app/_components/ui/Input";
import { apiFetch } from "@/app/meal/_api/apiFetch";
import { toast } from "sonner";

export default function WithdrawPage() {
  const router = useRouter();

  // 내용동의 체크 상태 관리
  const [isChecked, setIsChecked] = useState(false);

  // 바텀시트 상태 관리
  const [isOpen, setIsOpen] = useState(false);

  // 키 입력 상태 관리
  const [editingValue, setEditingValue] = useState<string>("");

  // 바텀시트 닫기
  const onClose = () => {
    setIsOpen(false);
  };

  // 탈퇴 완료 클릭 시 처리
  const handleWithdrawComplete = async () => {
    try {
      const response = await apiFetch<{ success: boolean; message: string }>(
        `/profile/withdraw`,
        {
          method: "POST",
          body: JSON.stringify({ password: editingValue }),
        },
      );

      // 브라우저의 쿠키 삭제
      document.cookie =
        "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      toast.success(response.message || "회원 탈퇴가 완료되었어요");
      onClose();
      router.replace("/auth/login");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        setEditingValue("");
      }
    }
  };

  return (
    <section className={commonStyle.mainContent}>
      <div className={commonStyle.pageTitleWrapper}>
        <h2 className={commonStyle.pageTitle}>회원 탈퇴</h2>
      </div>
      <div className={styles.withdrawWrapper}>
        <p className={styles.comment}>
          정말 떠나시겠어요?
          <br />
          계정을 삭제하기 전 아래 내용을 꼭 확인해 주세요.
        </p>
        <ul className={styles.list}>
          <li>
            LinkCare에서 이용하셨던 모든 개인정보와 기록은 다시 볼 수 없어요.
          </li>
          <li>
            작성하신 게시글 및 댓글은 자동 삭제되지 않으니, 탈퇴 전에 직접
            삭제해 주세요.
          </li>
          <li>
            탈퇴 신청 후 30일 동안은 동일한 이메일과 닉네임으로 다시 가입할 수
            없어요.
          </li>
          <li>
            계정 데이터는 30일간 안전하게 보존된 후 완전히 파기되어 복구할 수
            없어요.
          </li>
          <li>
            관련 법령에 의해 보관이 필요한 정보는 지정된 법적 기간 동안 안전하게
            보존돼요.
          </li>
        </ul>
        <div className={styles.checkAgree}>
          <CheckBox
            type="checkbox"
            id="terms"
            name="terms"
            label="내용을 확인했어요"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
          />
        </div>

        <div className={commonStyle.fixedBottom}>
          <div className={commonStyle.fixedBottomInner}>
            <Button
              type="button"
              variant="primary"
              size="large"
              onClick={() => setIsOpen(true)}
              disabled={!isChecked}
            >
              회원탈퇴
            </Button>
          </div>
        </div>
      </div>

      <BottomSheet open={isOpen} title="회원 탈퇴" onClose={onClose}>
        <div className={formStyle.formWrapper}>
          <div className={formStyle.formGroup}>
            <label htmlFor="password" className={formStyle.formLabel}>
              비밀번호를 입력하세요
            </label>
            <div className={formStyle.formInputWrapper}>
              <Input
                type="password"
                id="password"
                name="password"
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
              />
            </div>
          </div>
          <div className={formStyle.formButtonWrapper}>
            <Button
              type="button"
              variant="secondary"
              size="large"
              onClick={() => setIsOpen(false)}
              disabled={false}
            >
              취소
            </Button>
            <Button
              type="button"
              variant="primary"
              size="large"
              onClick={handleWithdrawComplete}
              disabled={!editingValue}
            >
              탈퇴 완료
            </Button>
          </div>
        </div>
      </BottomSheet>
    </section>
  );
}
