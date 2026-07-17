'use client';

import { useState } from "react";

import commonStyle from "@/styles/common.module.css";
import formStyle from "@/styles/components/form.module.css";

import Button from "@/app/_components/ui/Button";
import Input from "@/app/_components/ui/Input";


export default function Register() {

  return (
    <section className={commonStyle.mainContent}>
      <div className={commonStyle.pageTitleWrapper}>
        <h2 className={commonStyle.pageTitle}>체중과 키를 입력하세요</h2>
      </div>
      <div className={formStyle.formWrapper}>
        <form className={formStyle.form}>
          <div className={formStyle.formGroup}>
            <label htmlFor="currentWeight" className={formStyle.formLabel}>
              체중
            </label>
            <Input unit="kg" type="number" id="currentWeight" name="currentWeight" required />
          </div>
          <div className={formStyle.formGroup}>
            <label htmlFor="currentHeight" className={formStyle.formLabel}>
              키
            </label>
            <Input unit="cm" type="number" id="currentHeight" name="currentHeight" required />
          </div>
          <div className={formStyle.formGroup}>
            <label htmlFor="goalWeight" className={formStyle.formLabel}>
              목표체중
            </label>
            <Input unit="kg" type="number" id="goalWeight" name="goalWeight" required />
          </div>
          <div className={commonStyle.fixedBottom}>
            <div className={commonStyle.fixedBottomInner}>
              <Button type="button" variant="secondary" size="large">
                건너뛰기
              </Button>
              <Button type="button" variant="primary" size="large">
                기록
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
