"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import commonStyle from "@/styles/common.module.css";
import formStyle from "@/styles/components/form.module.css";
import genderStyles from "@/styles/mypage/gender.module.css";
import Button from "@/app/_components/ui/Button";
import Input from "@/app/_components/ui/Input";
import CheckBox from "@/app/_components/ui/Checkbox";
import BottomSheet from "@/app/_components/ui/BottomSheet";
import { toast } from "sonner";
import clsx from "clsx";
import { Check, Mars, Venus } from "lucide-react";
import { GenderType, genderTypeLabel } from "@/types/profileType";
import dayjs from "dayjs";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

export default function Register() {
  const [open, setOpen] = useState(false);
  const [loginInfo, setLoginInfo] = useState(true);
  const [personalInfo, setPersonalInfo] = useState(false);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const isPasswordMatch = password === confirmPassword;

  const [birth, setBirth] = useState("");
  const [selectedGender, setSelectedGender] = useState<GenderType | null>(null);
  const [height, setHeight] = useState("");

  // 약관 동의 체크 상태 관리
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    sensitive: false,
  });

  const isAllAgreed =
    agreements.terms && agreements.privacy && agreements.sensitive;

  // 필수정보 - 개별 체크박스 변경 핸들러
  const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setAgreements((prev) => ({ ...prev, [name]: checked }));
  };

  // step1 - 이메일, 비밀번호 입력 확인
  function saveEmailStep() {
    if (!isEmailChecked) {
      toast.warning("이메일 중복 확인을 진행해 주세요.");
      return;
    }

    if (password.length < 6) {
      toast.warning(`비밀번호는 6자 이상으로 입력해주세요.`);
      return;
    }

    setLoginInfo(false);
    setPersonalInfo(true);
  }

  // step2 - 개인정보 입력 확인
  function handleOpenSheet() {
    if (!birth) {
      toast.warning("생년월일을 입력해주세요.");
      return;
    }

    if (!selectedGender) {
      toast.warning(`성별을 선택해주세요.`);
      return;
    }

    if (!height) {
      toast.warning(`키를 입력해주세요.`);
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
        toast.success("회원가입이 완료되었습니다!");
        setPersonalInfo(false);
        setOpen(false);
        router.push("/auth/login"); // 로그인 페이지 이동
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("Register Error:", error);
      toast.error("서버 통신 중 오류가 발생했어요, 잠시후 다시 시도해주세요.");
    }
  };

  // 비밀번호 확인
  const passwordErrorMessage =
    confirmPassword && !isPasswordMatch
      ? "비밀번호가 일치하지 않습니다."
      : confirmPassword && isPasswordMatch
        ? "비밀번호가 일치합니다."
        : "";

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
      const response = await fetch(
        `${API_BASE_URL}/check-email?email=${email}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );

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

  // 생년월일 입력 핸들러
  const onChangeBirth = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBirthDate(e.target.value);
    setBirth(formatted);

    // 10자 되었을 때 검증 수행
    if (formatted.length === 10) {
      const isValid = validateBirthDate(formatted);

      if (!isValid) {
        // toast.error("올바른 날짜 형식이 아니에요. (예: 1998-05-20)");
        birthErrorMessage = "올바른 날짜 형식이 아니에요. (예: 1998-05-20)";
      } else { "" }
    }
  };

  // 생년월일 오류 메시지
  let birthErrorMessage;

  // 날짜 유효성 검증 함수 (dayjs strict mode 사용)
  const validateBirthDate = (dateString: string): boolean => {
    if (dateString.length !== 10) return false;
    // YYYY-MM-DD 포맷과 일치하며 실제 존재하는 날짜(Strict)인지 체크
    return dayjs(dateString, "YYYY-MM-DD", true).isValid();
  };

  // 숫자만 입력받아 YYYY-MM-DD로 포맷팅하는 함수
  const formatBirthDate = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);

    if (digits.length <= 4) {
      return digits;
    }
    if (digits.length <= 6) {
      return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    }
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
  };

  // 성별 선택 핸들러
  const handleGenderSelect = (gender: GenderType | null) => {
    setSelectedGender(gender);
  };

  // 키 입력 핸들러
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (val === "") {
      setHeight("");
      return;
    }

    // 숫자 및 소수점 1자리까지만 허용하는 정규식
    const regex = /^\d*(\.\d{0,1})?$/;

    if (regex.test(val)) {
      const numVal = Number(val);
      // 300 이하일 때만 state 업데이트 (300을 넘는 입력 방지)
      if (numVal <= 300) {
        setHeight(val);
      }
    }
  };

  return (
    <section className={commonStyle.mainContent}>
      <div className={commonStyle.pageTitleWrapper}>
        <h2 className={commonStyle.pageTitle}>회원 정보를 입력해주세요</h2>
      </div>
      <div className={formStyle.formWrapper}>
        <form className={formStyle.form}>
          {loginInfo && (<>
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
                <Button
                  type="button"
                  variant="secondary"
                  size="medium"
                  onClick={handleCheckEmail}
                >
                  중복 확인
                </Button>
              </div>
              {/* 검증 결과 안내 메시지 표시 */}
              {emailMessage && (
                <p
                  className={
                    isEmailChecked
                      ? commonStyle.textSuccess
                      : commonStyle.textError
                  }
                >
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
                    isPasswordMatch
                      ? commonStyle.textSuccess
                      : commonStyle.textError
                  }
                >
                  {passwordErrorMessage}
                </p>
              )}
            </div>
            <div className={commonStyle.fixedBottom}>
              <div className={commonStyle.fixedBottomInner}>
                <Button
                  type="button"
                  variant="primary"
                  size="large"
                  onClick={saveEmailStep}
                >
                  다음
                </Button>
              </div>
            </div>
          </>)}


          {/* 개인정보 입력 */}
          {personalInfo && (
            <>
              <div className={formStyle.formGroup}>
                <label htmlFor="birth" className={formStyle.formLabel}>
                  생년월일
                </label>
                <Input
                  type="string"
                  id="birthDate"
                  name="birthDate"
                  value={birth}
                  placeholder="YYYY-MM-DD"
                  onChange={onChangeBirth}
                  required
                />
              </div>
              {/* 검증 안내 메시지 */}
              {birthErrorMessage && (
                <p
                  className={
                    isPasswordMatch
                      ? commonStyle.textSuccess
                      : commonStyle.textError
                  }
                >
                  {birthErrorMessage}
                </p>
              )}

              <div className={formStyle.formGroup}>
                <label htmlFor="gender" className={formStyle.formLabel}>
                  성별
                </label>
                <div className={genderStyles.genderGroup}>
                  {/* 여성 버튼 */}
                  <button
                    type="button"
                    className={clsx(
                      genderStyles.radioButton,
                      selectedGender === "F" && genderStyles.active,
                    )}
                    onClick={() => handleGenderSelect("F")}
                  >
                    <Venus size={20} className={genderStyles.genderIcon} />
                    <span>{genderTypeLabel.F}</span>
                    {selectedGender === "F" && (
                      <Check size={18} className={genderStyles.checkIcon} />
                    )}
                  </button>

                  {/* 남성 버튼 */}
                  <button
                    type="button"
                    className={clsx(
                      genderStyles.radioButton,
                      selectedGender === "M" && genderStyles.active,
                    )}
                    onClick={() => handleGenderSelect("M")}
                  >
                    <Mars size={20} className={genderStyles.genderIcon} />
                    <span>{genderTypeLabel.M}</span>
                    {selectedGender === "M" && (
                      <Check size={16} className={genderStyles.checkIcon} />
                    )}
                  </button>

                  {/* 선택 안함 버튼 */}
                  <button
                    type="button"
                    className={clsx(genderStyles.radioButton, selectedGender === null && genderStyles.active,)}
                    onClick={() => handleGenderSelect(null)}
                  >
                    <span>{genderTypeLabel.null}</span>
                    {selectedGender === null && (<Check size={18} className={genderStyles.checkIcon} />)}
                  </button>
                </div>
              </div>

              <div className={formStyle.formGroup}>
                <label htmlFor="height" className={formStyle.formLabel}>
                  키
                </label>
                <Input
                  type="text"
                  inputMode="decimal"
                  id="newHeight"
                  name="newHeight"
                  value={height}
                  placeholder="예: 175.5"
                  unit="cm"
                  onChange={handleHeightChange}
                  required
                />
              </div>

              <div className={commonStyle.fixedBottom}>
                <div className={commonStyle.fixedBottomInner}>
                  <Button
                    type="button"
                    variant="primary"
                    size="large"
                    onClick={handleOpenSheet}
                  >
                    회원가입
                  </Button>
                </div>
              </div>
            </>)}
          <div className={formStyle.formBoxCenter}>
            <Button
              variant="text-primary"
              size="small"
              onClick={() => router.push("/auth/login")}
            >
              로그인
            </Button>
          </div>

        </form>
      </div >
      <BottomSheet open={open} title="약관 동의" onClose={() => setOpen(false)}>
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
              <Button type="button" variant="text-secondary" size="small">
                약관 보기
              </Button>
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
              <Button type="button" variant="text-secondary" size="small">
                약관 보기
              </Button>
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
              <Button type="button" variant="text-secondary" size="small">
                약관 보기
              </Button>
            </div>
          </div>
          <div className={formStyle.formGroup}>
            <p className={commonStyle.textInfo}>
              필수약관에 동의하신 후 서비스를 이용할 수 있습니다.
            </p>
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
    </section >
  );
}
