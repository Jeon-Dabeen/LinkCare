'use client';

import { useState } from "react";

import commonStyle from "@/styles/common.module.css";
import formStyle from "@/styles/components/form.module.css";

import Button from "@/app/_components/ui/Button";
import Input from "@/app/_components/ui/Input";
import Radio from "@/app/_components/ui/Radio";


export default function Register() {

  const [type, setType] = useState('breakfast');
  const [timing, setTiming] = useState('before');

  const handleType = (value: string) => {
    setType(value);
  }
  const handleTiming = (value: string) => {
    setTiming(value);
  }

  return (
    <section className={commonStyle.mainContent}>
      <div className={commonStyle.pageTitleWrapper}>
        <h2 className={commonStyle.pageTitle}>오늘 측정한 혈당을 입력하세요</h2>
      </div>
      <div className={formStyle.formWrapper}>
        <form className={formStyle.form}>
          <div className={formStyle.formGroup}>
            <Radio value={type} onChange={handleType}>
              <Radio.Item id="breakfase" value="breakfase" text="아침" />
              <Radio.Item id="lunch" value="lunch" text="점심" />
              <Radio.Item id="dinner" value="dinner" text="저녁" />
            </Radio>
          </div>
          <div className={formStyle.formGroup}>
            <Radio value={timing} onChange={handleTiming}>
              <Radio.Item id="before" value="before" text="식전" />
              <Radio.Item id="after" value="after" text="식후" />
            </Radio>
          </div>
          <div className={formStyle.formGroup}>
            <label htmlFor="bpm" className={formStyle.formLabel}>
              혈당
            </label>
            <Input 
              unit="mg/dL"
              type="number" 
              id="bpm" 
              name="bpm"
              placeholder="90"
              required
            />
          </div>
          <div className={formStyle.formButtonWrapper}>
            <Button type="button" variant="secondary" size="large">
              건너뛰기
            </Button>
            <Button type="button" variant="primary" size="large">
              기록
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
