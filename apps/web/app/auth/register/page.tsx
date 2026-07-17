'use client';

import { useState } from "react";

import commonStyle from "@/styles/common.module.css";
import formStyle from "@/styles/components/form.module.css";

import Button from "@/app/_components/ui/Button";
import Input from "@/app/_components/ui/Input";
import CheckBox from "@/app/_components/ui/Checkbox";
import BottomSheet from "@/app/_components/ui/BottomSheet";


export default function Register() {
  const [open, setOpen] = useState(false);

  function handleOpenSheet() {
    setOpen(true);
  }


  return (
    <section className={commonStyle.mainContent}>
      <div className={commonStyle.pageTitleWrapper}>
        <h2 className={commonStyle.pageTitle}>회원 정보를 입력해주세요</h2>
      </div>
      <div className={formStyle.formWrapper}>
        <form className={formStyle.form}>
          <div className={formStyle.formGroup}>
            <label htmlFor="confirmPassword" className={formStyle.formLabel}>
              비밀번호 확인
            </label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
            />
          </div>
          <div className={formStyle.formGroup}>
            <label htmlFor="upassword" className={formStyle.formLabel}>
              비밀번호
            </label>
            <Input type="password" id="upassword" name="upassword" required />
          </div>
          <div className={formStyle.formGroup}>
            <label htmlFor="uemail" className={formStyle.formLabel}>
              이메일
            </label>
            <div className={formStyle.formInputWrapper}>
              <Input type="email" id="uemail" name="uemail" required />
              <Button type="button" variant="secondary" size="medium" onClick={() => console.log("중복 확인 버튼 클릭")}>
                중복 확인
              </Button>
            </div>
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
        onClose={() => setOpen(false)}>
          <div className={formStyle.formWrapper}>
            <div className={formStyle.formGroup}>
              <div className={formStyle.formInputWrapper}>
                <CheckBox 
                  type="checkbox" id="terms" name="terms" 
                  label="[필수]이용약관에 동의합니다"
                  required 
                />
                <Button type="button" variant="text-secondary" size="small">약관 보기</Button>
              </div>
            </div>
            <div className={formStyle.formGroup}>
              <div className={formStyle.formInputWrapper}>
                <CheckBox 
                  type="checkbox" id="privacy" name="privacy" 
                  label="[필수]개인정보처리방침에 동의합니다"
                  required 
                />
                <Button type="button" variant="text-secondary" size="small">약관 보기</Button>
              </div>
            </div>
            <div className={formStyle.formGroup}>
              <div className={formStyle.formInputWrapper}>
                <CheckBox 
                  type="checkbox" id="sensitive" name="sensitive" 
                  label="[필수]민감정보 활용에 동의합니다" 
                  required 
                />
                <Button type="button" variant="text-secondary" size="small">약관 보기</Button>
              </div>
            </div>
            <div className={formStyle.formGroup}>
              <p className={commonStyle.textInfo}>필수약관에 동의하신 후 서비스를 이용할 수 있습니다.</p>
            </div>
            <Button type="button" variant="primary" size="large" onClick={() => {}} disabled>
              확인
            </Button>
          </div>
      </BottomSheet>
    </section>
  );
}
