'use client';


import { useState } from "react";
import { CircleQuestionMark, FileCode } from "lucide-react";

import clsx from "clsx";
import commonStyle from "@/styles/common.module.css";
import formStyle from "@/styles/components/form.module.css";

import Button from "@/app/_components/ui/Button";



export default function Page(){

  const [selectedFile, setSelectedFile] = useState(null);


  return (
    <section className={commonStyle.mainContent}>
      <div className={commonStyle.pageTitleWrapper}>
        <h2 className={commonStyle.pageTitle}>건강검진 결과 파일 등록</h2>
      </div>

      <div className={formStyle.formWrapper}>
        <form className={formStyle.form}>
          <div className={formStyle.formGroup}>
            <div className={formStyle.formFileUpload}>
              <p className={formStyle.info}>파일 선택 버튼을 눌러 파일을 직접 선택해주세요.</p>
              <Button type="button" variant="secondary" round>파일 선택</Button>
            </div>
          </div>
          <div className={formStyle.formGroup}>
            <div className={formStyle.formFileName}>
              <FileCode />
              <p className={formStyle.text}>1차건강검진결과_20260703.xml</p>
            </div>
          </div>
          <div className={clsx(formStyle.formButtonWrapper, formStyle.column)}>
            <div className={formStyle.formBoxCenter}>
              <Button variant="text-primary" size="small">
                <CircleQuestionMark />
                <span>건강검진 결과 파일은 어디서 가져오나요?</span>
              </Button>
            </div>
            <div className={formStyle.formBox}>
              <Button type="button" variant="primary" size="large" full>
                검진 파일 업로드
              </Button>
            </div>
          </div>
          </form>
      </div>
    </section>
  )
}
