'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import commonStyle from "@/styles/common.module.css";
import formStyle from "@/styles/components/form.module.css";
import Button from "@/app/_components/ui/Button";
import Input from "@/app/_components/ui/Input";
import CheckBox from "@/app/_components/ui/Checkbox";
import BottomSheet from "@/app/_components/ui/BottomSheet";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

export default function Register() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const isPasswordMatch = password === confirmPassword;

  // 약관 동의 체크 상태 관리
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    sensitive: false,
  });

  const isAllAgreed = agreements.terms && agreements.privacy && agreements.sensitive;

  // 필수정보 - 개별 체크박스 변경 핸들러
  const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setAgreements((prev) => ({ ...prev, [name]: checked, }));
  };

  // 확인
  function handleOpenSheet() {
    if (!isEmailChecked) {
      alert("이메일 중복 확인을 진행해 주세요.");
      return;
    }

    if (password.length < 6) {
      alert(`비밀번호는 6자 이상으로 입력해주세요.`);
      return;
    }

    setOpen(true);
  }

  // 등록
  const handleRegister = async () => {
    if (!isAllAgreed) return;

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        alert("회원가입이 완료되었습니다!");
        setOpen(false);
        router.push("/auth/login"); // 로그인 페이지 이동
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("Register Error:", error);
      alert("서버 통신 중 오류가 발생했습니다.");
    }
  };

  // 비밀번호 확인
  const passwordErrorMessage =
    confirmPassword && !isPasswordMatch ? "비밀번호가 일치하지 않습니다."
      : confirmPassword && isPasswordMatch ? "비밀번호가 일치합니다." : "";

  // 이메일 중복 체크 함수
  const handleCheckEmail = async () => {
    if (!email) {
      setEmailMessage("이메일을 입력해 주세요.");
      return;
    }

    // 간단한 이메일 정규식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailMessage("올바른 이메일 형식이 아닙니다.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/check-email?email=${email}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", },
      });

      const data = await response.json();

      if (response.ok) {
        setIsEmailChecked(true);
        setEmailMessage("사용 가능한 이메일입니다.");
      } else {
        setIsEmailChecked(false);
        setEmailMessage(data.message || "이미 사용 중인 이메일입니다.");
      }
    } catch (error) {
      console.error("이메일 중복 확인 오류:", error);
      setEmailMessage("중복 확인 중 오류가 발생했습니다.");
    }
  };

  return (
    <section className={commonStyle.mainContent}>
      <div className={commonStyle.pageTitleWrapper}>
        <h2 className={commonStyle.pageTitle}>회원 정보를 입력해주세요</h2>
      </div>
      <div className={formStyle.formWrapper}>
        <form className={formStyle.form}>
          <div className={formStyle.formGroup}>
            <label htmlFor="email" className={formStyle.formLabel}>
              이메일
            </label>
            <div className={formStyle.formInputWrapper}>
              <Input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsEmailChecked(false); // 이메일 변경 시 중복 확인 상태 초기화
                  setEmailMessage("");
                }}
                required
              />
              <Button type="button" variant="secondary" size="medium" onClick={handleCheckEmail}>
                중복 확인
              </Button>
            </div>
            {/* 검증 결과 안내 메시지 표시 */}
            {emailMessage && (
              <p className={isEmailChecked ? commonStyle.textSuccess : commonStyle.textError}>
                {emailMessage}
              </p>
            )}
          </div>
          {/* 비밀번호 입력 */}
          <div className={formStyle.formGroup}>
            <label htmlFor="upassword" className={formStyle.formLabel}>
              비밀번호
            </label>
            <Input
              type="password"
              id="upassword"
              name="upassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* 비밀번호 확인 입력 */}
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
              required
            />
            {/* 검증 안내 메시지 */}
            {passwordErrorMessage && (
              <p
                className={
                  isPasswordMatch ? commonStyle.textSuccess : commonStyle.textError
                }
              >
                {passwordErrorMessage}
              </p>
            )}
          </div>
          <div className={commonStyle.fixedBottom}>
            <div className={commonStyle.fixedBottomInner}>
              <Button type="button" variant="primary" size="large" onClick={handleOpenSheet}>
                회원가입
              </Button>
            </div>
          </div>
        </form>
      </div>
      <BottomSheet
        open={open}
        title="약관 동의"
        onClose={() => setOpen(false)}
      >
        <div className={formStyle.formWrapper}>
          <div className={formStyle.formGroup}>
            <div className={formStyle.formInputWrapper}>
              <CheckBox
                type="checkbox"
                id="terms"
                name="terms"
                label="[필수]이용약관에 동의합니다"
                checked={agreements.terms}
                onChange={handleCheckChange}
                required
              />
              <Button type="button" variant="text-secondary" size="small">약관 보기</Button>
            </div>
          </div>
          <div className={formStyle.formGroup}>
            <div className={formStyle.formInputWrapper}>
              <CheckBox
                type="checkbox"
                id="privacy"
                name="privacy"
                label="[필수]개인정보처리방침에 동의합니다"
                checked={agreements.privacy}
                onChange={handleCheckChange}
                required
              />
              <Button type="button" variant="text-secondary" size="small">약관 보기</Button>
            </div>
          </div>
          <div className={formStyle.formGroup}>
            <div className={formStyle.formInputWrapper}>
              <CheckBox
                type="checkbox"
                id="sensitive"
                name="sensitive"
                label="[필수] 민감정보 활용에 동의합니다"
                checked={agreements.sensitive}
                onChange={handleCheckChange}
                required
              />
              <Button type="button" variant="text-secondary" size="small">약관 보기</Button>
            </div>
          </div>
          <div className={formStyle.formGroup}>
            <p className={commonStyle.textInfo}>필수약관에 동의하신 후 서비스를 이용할 수 있습니다.</p>
          </div>

          {/* disabled 및 onClick 연결 */}
          <Button
            type="button"
            variant="primary"
            size="large"
            disabled={!isAllAgreed}
            onClick={handleRegister}
          >
            확인
          </Button>
        </div>
      </BottomSheet>
    </section>
  );
}
