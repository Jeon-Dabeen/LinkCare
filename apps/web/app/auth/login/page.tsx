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
            <Input type="email" id="uemail" name="uemail" required />
          </div>
          <div className={formStyle.formGroup}>
            <label htmlFor="upassword" className={formStyle.formLabel}>
              비밀번호
            </label>
            <Input type="password" id="upassword" name="upassword" required />
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
