"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { CircleQuestionMark, FileCode } from "lucide-react";

import clsx from "clsx";
import commonStyle from "@/styles/common.module.css";
import formStyle from "@/styles/components/form.module.css";

import Button from "@/app/_components/ui/Button";
import StatePage from "@/app/_components/ui/StatePage";
import BottomSheet from "@/app/_components/ui/BottomSheet";
import { ENV } from "@/env";
import { toast } from "sonner";
import Tabs from "@/app/_components/ui/Tabs";
import Input from "@/app/_components/ui/Input";
import { useRouter } from "next/navigation";

interface ParsingPdfResponseData {
  checkup_year: string;
  checkup_date: string;
  height: string;
  weight: string;
  waist: string;
  bmi: string;
  vision_left: string;
  vision_right: string;
  hearing: string;
  bp_systolic: string;
  bp_diastolic: string;
  urine_protein: string;
  hemoglobin: string;
  fbg: string;
  creatinine: string;
  egfr: string;
  ast: string;
  alt: string;
  ygtp: string;
}

interface CheckupHistoryItem {
  checkup_year: number;
  checkup_date: string;
  height: number;
  weight: number;
  waist: number;
  bmi: number;
  visionLeft: number;
  visionRight: number;
  hearing: string;
  bp_systolic: number;
  bp_diastolic: number;
  urine_protein: string;
  hemoglobin: number;
  fbg: number;
  creatinine: number;
  egfr: number;
  ast: number;
  alt: number;
  ygtp: number;
}

interface UploadedData {
  checkup_history: CheckupHistoryItem[];
}

function transformCheckupItem(raw: ParsingPdfResponseData): CheckupHistoryItem {
  return {
    checkup_year: 2000 + Number(raw.checkup_year.slice(1)),
    checkup_date: raw.checkup_date,
    height: Number(raw.height),
    weight: Number(raw.weight),
    waist: Number(raw.waist),
    bmi: Number(raw.bmi),
    visionLeft: Number(raw.vision_left),
    visionRight: Number(raw.vision_right),
    hearing: raw.hearing === undefined ? "정상/정상" : raw.hearing,
    bp_systolic: Number(raw.bp_systolic),
    bp_diastolic: Number(raw.bp_diastolic),
    urine_protein: raw.urine_protein,
    hemoglobin: Number(raw.hemoglobin),
    fbg: Number(raw.fbg),
    creatinine: Number(raw.creatinine),
    egfr: Number(raw.egfr),
    ast: Number(raw.ast),
    alt: Number(raw.alt),
    ygtp: Number(raw.ygtp),
  };
}

export default function Page() {
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const pdfFileNameRef = useRef<HTMLParagraphElement>(null);
  const [step, setStep] = useState<"upload" | "confirm">("upload");
  const [pdfFile, setPdfFile] = useState<File>();
  const [uploadedData, setUploadedData] = useState<UploadedData>();
  const [years, setYears] = useState<number[]>();
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isStatePageOpen, setIsStatePageOpen] = useState(false);
  const router = useRouter();

  const handleUploadButtonClick = () => {
    pdfInputRef.current?.click();
  };

  const handleOnChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files[0]) {
      const file = files[0];
      if (!(file.type === "application/pdf")) {
        toast.error(`PDF 파일이 아니에요!`);
        return;
      }

      pdfFileNameRef.current!.textContent = file.name;
      setPdfFile(file);
    }
  };

  const handleBottomSheetOpen = () => {
    setIsBottomSheetOpen(true);
  };

  const handleBottomSheetClose = () => {
    setIsBottomSheetOpen(false);
  };

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    console.log(pdfFile);
    if (!pdfFile) {
      toast.warning("PDF 파일이 업로드 되지 않았어요!");
      setIsStatePageOpen(false);
      return;
    }

    formData.append("file", pdfFile);

    const response = await fetch(`${ENV.API_URL}/checkup/upload`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (response.status > 399) {

      toast.warning(`링크케어 AI가 분서 분석을 못해냈어요. 빠르게 수정할게요! 며칠 뒤 다시 시도해주세요.`);
      router.push('/home');
    }

    console.info(`pdf 업로드 결과: ${response.status}`);
    const json = await response.json();
    const data = json.data;

    const checkupHistory: UploadedData = {
      checkup_history: data.checkup_history.map(transformCheckupItem),
    };

    setYears(checkupHistory.checkup_history.map((h) => h.checkup_year));
    setUploadedData(checkupHistory);
    setStep("confirm");
    setIsStatePageOpen(false);
  };

  const handleStageOpen = () => {
    setIsStatePageOpen(true);
  };

  const handleChange = (
    year: number,
    field: keyof CheckupHistoryItem,
    value: string,
  ) => {
    setUploadedData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        checkup_history: prev.checkup_history.map((item) =>
          item.checkup_year === year ? { ...item, key: `checkup-${year}`, [field]: value } : item,
        ),
      };
    });
  };

  const handleSave = async () => {
    if (!uploadedData) {
      throw new Error("보낼 데이터가 없습니다!");
    }

    const response = await fetch(`${ENV.API_URL}/checkup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(uploadedData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || "검진 데이터 저장 중 오류가 발생했습니다.";

      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    setIsStatePageOpen(true);

    const data = response.json();
    alert(JSON.stringify(data));

    router.push("/checkup");
  };

  if (step === "upload") {
    return (
      <section className={commonStyle.mainContent}>
        <div className={commonStyle.pageTitleWrapper}>
          <h2 className={commonStyle.pageTitle}>건강검진 결과 파일 등록</h2>
        </div>

        <div className={formStyle.formWrapper}>
          <form className={formStyle.form} onSubmit={handleUpload}>
            <div className={formStyle.formGroup}>
              <div className={formStyle.formFileUpload}>
                <p className={formStyle.info}>
                  파일 선택 버튼을 눌러 파일을 직접 선택해주세요.
                </p>
                <input
                  type="file"
                  ref={pdfInputRef}
                  name="pdfFile"
                  accept=".pdf"
                  onChange={handleOnChangeFile}
                  hidden
                />
                <Button
                  type="button"
                  variant="secondary"
                  round
                  onClick={handleUploadButtonClick}
                >
                  파일 선택
                </Button>
              </div>
            </div>
            <div className={formStyle.formGroup}>
              <div className={formStyle.formFileName}>
                <FileCode />
                <p className={formStyle.text} ref={pdfFileNameRef}>
                  파일이 아직 업로드 되지 않았어요!
                </p>
              </div>
            </div>
            <div
              className={clsx(formStyle.formButtonWrapper, formStyle.column)}
            >
              <div className={formStyle.formBoxCenter}>
                <Button
                  onClick={handleBottomSheetOpen}
                  variant="text-primary"
                  size="small"
                >
                  <CircleQuestionMark />
                  <span>건강검진 결과 파일은 어디서 가져오나요?</span>
                </Button>
              </div>
              <div className={formStyle.formBox}>
                <Button
                  type="submit"
                  variant="primary"
                  size="large"
                  full
                  onClick={handleStageOpen}
                >
                  검진 파일 업로드
                </Button>
              </div>
            </div>
          </form>
        </div>

        <BottomSheet
          open={isBottomSheetOpen}
          onClose={handleBottomSheetClose}
          title="국가 건강검진 PDF 다운로드 가이드"
        >
          <p>1. 국민건강보험 접속 후 로그인</p>
          <p>
            2. 건강모아 탭 ➔ 나의 건강 ➔ 건강검진 결과조회 ➔ 검진결과 한눈에
            보기 ➔ 출력/저장 클릭 후 PDF 저장
          </p>
        </BottomSheet>

        <StatePage
          open={isStatePageOpen}
          title="건강검진 결과를 불러오고 있어요"
          description={
            <>
              검진 결과를 안전하게 불러오고 있어요.
              <br />
              데이터 양에 따라 조금 시간이 걸릴 수 있으니 <br />
              잠시만 기다려 주시면 건강 리포트를 확인하실 수 있어요.
            </>
          }
        />
      </section>
    );
  }
  if (step === "confirm" && uploadedData?.checkup_history.length !== 0) {
    return (
      <section className={commonStyle.mainContent}>
        <div className={commonStyle.pageTitleWrapper}>
          <h2 className={commonStyle.pageTitle}>건강검진 결과 확인</h2>
        </div>

        <div className={formStyle.formWrapper}>
          <Tabs defaultValue={`year${years![0]}`}>
            <Tabs.Nav key="tabNav">
              {[...years!].reverse().map((y) => (
                <Tabs.NavItem key={`nav-year-${y}`} value={`year${y}`} title={`${y}`} />
              ))}
            </Tabs.Nav>

            {[...years!].reverse().map((y) => {
              const yearData = uploadedData?.checkup_history.find(
                (d) => d.checkup_year === y,
              );

              return (
                <Tabs.Content key={y} value={`year${y}`}>
                  {yearData ? (
                    <div className={formStyle.formGroup}>
                      <label className={formStyle.formLabel}>
                        감마지피티(y-GPT)
                        <Input
                          key="ygtp"
                          unit="U/L"
                          type="number"
                          placeholder={`${yearData.ygtp}`}
                          defaultValue={yearData.ygtp}
                          onChange={() => handleChange}
                        />
                      </label>
                      <label className={formStyle.formLabel}>
                        ALT
                        <Input
                          key="alt"
                          unit="U/L"
                          type="number"
                          placeholder={`${yearData.alt}`}
                          defaultValue={yearData.alt}
                          onChange={() => handleChange}
                        />
                      </label>
                      <label className={formStyle.formLabel}>
                        AST
                        <Input
                          key="ast"
                          unit="U/L"
                          type="number"
                          placeholder={`${yearData.ast}`}
                          defaultValue={yearData.ast}
                          onChange={() => handleChange}
                        />
                      </label>
                      <label className={formStyle.formLabel}>
                        신사구체여과율(GFR)
                        <Input
                          key="egfr"
                          unit="mL/min"
                          type="number"
                          placeholder={`${yearData.egfr}`}
                          defaultValue={yearData.egfr}
                          onChange={() => handleChange}
                        />
                      </label>
                      <label className={formStyle.formLabel}>
                        혈청 크레아티닌
                        <Input
                          key="creatinine"
                          unit="mg/DL"
                          type="number"
                          placeholder={`${yearData.creatinine}`}
                          defaultValue={yearData.creatinine}
                          onChange={() => handleChange}
                        />
                      </label>
                      <label className={formStyle.formLabel}>
                        공복혈당
                        <Input
                          key="fbg"
                          unit="mg/DL"
                          type="number"
                          placeholder={`${yearData.fbg}`}
                          defaultValue={yearData.fbg}
                          onChange={() => handleChange}
                        />
                      </label>
                      <label className={formStyle.formLabel}>
                        혈색소
                        <Input
                          key="hemoglobin"
                          unit="g/DL"
                          type="number"
                          placeholder={`${yearData.hemoglobin}`}
                          defaultValue={yearData.hemoglobin}
                          onChange={() => handleChange}
                        />
                      </label>
                      <label className={formStyle.formLabel}>
                        요단백
                        <Input
                          key="urine_protein"
                          type="text"
                          placeholder={`${yearData.urine_protein}`}
                          defaultValue={yearData.urine_protein}
                          onChange={() => handleChange}
                        />
                      </label>
                      <label className={formStyle.formLabel}>
                        최저 혈압
                        <Input
                          key="bp_diastolic"
                          unit="mmHg"
                          type="number"
                          placeholder={`${yearData.bp_diastolic}`}
                          defaultValue={yearData.bp_diastolic}
                          onChange={() => handleChange}
                        />
                      </label>
                      <label className={formStyle.formLabel}>
                        최고 혈압
                        <Input
                          key="bp_systolic"
                          unit="mmHg"
                          type="number"
                          placeholder={`${yearData.bp_systolic}`}
                          defaultValue={yearData.bp_systolic}
                          onChange={() => handleChange}
                        />
                      </label>
                      <label className={formStyle.formLabel}>
                        청력
                        <Input
                          key="hearing"
                          type="text"
                          placeholder={`${yearData.hearing}`}
                          defaultValue={yearData.hearing}
                          onChange={() => handleChange}
                        />
                      </label>
                      <label className={formStyle.formLabel}>
                        시력 우
                        <Input
                          key="visionRight"
                          type="number"
                          placeholder={`${yearData.visionRight}`}
                          defaultValue={yearData.visionRight}
                          onChange={() => handleChange}
                        />
                      </label>
                      <label className={formStyle.formLabel}>
                        시력 좌
                        <Input
                          key="visionLeft"
                          type="number"
                          placeholder={`${yearData.visionLeft}`}
                          defaultValue={yearData.visionLeft}
                          onChange={() => handleChange}
                        />
                      </label>
                      <label className={formStyle.formLabel}>
                        BMI
                        <Input
                          key="bmi"
                          unit="kg/㎡"
                          type="number"
                          placeholder={`${yearData.bmi}`}
                          defaultValue={yearData.bmi}
                          onChange={() => handleChange}
                        />
                      </label>
                      <label className={formStyle.formLabel}>
                        허리둘레
                        <Input
                          key="waist"
                          unit="cm"
                          type="number"
                          placeholder={`${yearData.waist}`}
                          defaultValue={yearData.waist}
                          onChange={() => handleChange}
                        />
                      </label>
                      <label className={formStyle.formLabel}>
                        몸무게
                        <Input
                          key="weight"
                          unit="kg"
                          type="number"
                          placeholder={`${yearData.weight}`}
                          defaultValue={yearData.weight}
                          onChange={() => handleChange}
                        />
                      </label>
                      <label className={formStyle.formLabel}>
                        키
                        <Input
                          key="height"
                          unit="cm"
                          type="number"
                          placeholder={`${yearData.height}`}
                          defaultValue={yearData.height}
                          onChange={() => handleChange}
                        />
                      </label>
                    </div>
                  ) : (
                    <p>{y}년 데이터가 없어요.</p>
                  )}
                </Tabs.Content>
              );
            })}
          </Tabs>
          <div className={clsx(formStyle.formButtonWrapper, formStyle.column)}>
            <div className={formStyle.formBox}>
              <Button
                type="button"
                variant="primary"
                size="large"
                full
                onClick={handleSave}
              >
                저장
              </Button>
            </div>
          </div>
        </div>

        <StatePage
          open={isStatePageOpen}
          title="건강검진 결과를 저장하고 있어요"
          description={
            <>
              데이터 양에 따라 조금 시간이 걸릴 수 있으니 <br />
              잠시만 기다려 주시면 건강 리포트를 확인하실 수 있어요.
            </>
          }
        />
      </section>
    );
  }
}
