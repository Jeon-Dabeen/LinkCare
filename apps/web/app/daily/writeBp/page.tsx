'use client';

import { useState } from "react";

import commonStyle from "@/styles/common.module.css";
import formStyle from "@/styles/components/form.module.css";

import Button from "@/app/_components/ui/Button";
import Input from "@/app/_components/ui/Input";
import Radio from "@/app/_components/ui/Radio";


export default function Register() {

  const [period, setPeriod] = useState('morning');

  const handlePeriod = (value: string) => {
    setPeriod(value);
  }

  return (
    <section className={commonStyle.mainContent}>
      <div className={commonStyle.pageTitleWrapper}>
        <h2 className={commonStyle.pageTitle}>오늘 측정한 혈압을 입력하세요</h2>
      </div>
      <div className={formStyle.formWrapper}>
        <form className={formStyle.form}>
          <div className={formStyle.formGroup}>
            <Radio value={period} onChange={handlePeriod}>
              <Radio.Item id="morning" value="morning" text="아침" />
              <Radio.Item id="evening" value="evening" text="저녁" disabled />
            </Radio>
          </div>
          <div className={formStyle.formGroup}>
            <label htmlFor="bpHigh" className={formStyle.formLabel}>
              최고혈압
            </label>
            <Input 
              unit="mmHg"
              type="number" 
              id="bpHigh" 
              name="bpHigh"
              placeholder="120"
              min={10}
              max={200}
              required
            />
          </div>
          <div className={formStyle.formGroup}>
            <label htmlFor="bpLow" className={formStyle.formLabel}>
              최저혈압
            </label>
            <Input 
              unit="mmHg"
              type="number" 
              id="bpLow" 
              name="bpLow"
              placeholder="80"
              required
            />
          </div>
          <div className={formStyle.formGroup}>
            <label htmlFor="bpm" className={formStyle.formLabel}>
              맥박
            </label>
            <Input 
              unit="bpm"
              type="number" 
              id="bpm" 
              name="bpm"
              placeholder="90"
              required
            />
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
