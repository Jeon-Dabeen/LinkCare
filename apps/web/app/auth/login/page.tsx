'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";

import clsx from "clsx";
import commonStyle from "@/styles/common.module.css";
import formStyle from "@/styles/components/form.module.css";

import Button from "@/app/_components/ui/Button";


export default function Login() {
  const router = useRouter();

  return (
    <section className={commonStyle.mainContent}>
      <div className={commonStyle.pageTitleWrapper}>
        <h2 className={commonStyle.pageTitle}>로그인</h2>
      </div>
      <div className={formStyle.formWrapper}>
        <form className={formStyle.form}>
          <div className={formStyle.formGroup}>
            <label htmlFor="uemail" className={formStyle.formLabel}>
              이메일
            </label>
            <input type="email" id="uemail" name="uemail" className={formStyle.formInput} required />
          </div>
          <div className={formStyle.formGroup}>
            <label htmlFor="upassword" className={formStyle.formLabel}>
              비밀번호
            </label>
            <input type="password" id="upassword" name="upassword" className={formStyle.formInput} required />
          </div>
          <div className={clsx(formStyle.formButtonWrapper, formStyle.column)}>
            <div className={clsx(formStyle.formBoxRight)}>
              <Button variant="text-primary" size="small">비밀번호를 잊으셨나요?</Button>
            </div>
            <div className={formStyle.formBox}>
              <Button type="button" variant="primary" size="large" full>
                로그인
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
