import commonStyle from "@/styles/common.module.css";
import formStyle from "@/styles/components/form.module.css";

import { CircleQuestionMark, FileCode } from "lucide-react";
import Button from "@/app/_components/ui/Button";
import Modal from "@/app/_components/ui/Modal";
import StatePage from "@/app/_components/ui/StatePage";
import Link from "next/link";

import clsx from "clsx";
import { FormEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ENV } from "@/env";

import { CheckupHistoryItem, UploadedData } from "@/types/checkup";

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

interface CheckupUploadFormProps {
  updateStep: (step: "upload" | "confirm") => void;
  updateUploadedData: (data: UploadedData) => void;
  isStatePageOpen: boolean;
  handleStageOpenChange: (bool: boolean) => void;
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

export default function CheckupUploadForm({
  updateStep,
  updateUploadedData,
  isStatePageOpen,
  handleStageOpenChange,
}: CheckupUploadFormProps) {
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const pdfFileNameRef = useRef<HTMLParagraphElement>(null);
  const [pdfFile, setPdfFile] = useState<File>();
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
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

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    console.log(pdfFile);
    if (!pdfFile) {
      toast.warning("PDF 파일이 업로드 되지 않았어요!");
      handleStageOpenChange(false);
      return;
    }
    formData.append("file", pdfFile);

    const response = await fetch(`${ENV.API_URL}/checkup/upload`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (response.status > 399) {
      toast.warning(
        `링크케어 AI가 분서 분석을 못해냈어요. 빠르게 수정할게요! 며칠 뒤 다시 시도해주세요.`,
      );
      router.push("/home");
    }
    console.info(`pdf 업로드 결과: ${response.status}`);
    const json = await response.json();
    const data = json.data;

    const checkupHistory: UploadedData = {
      checkup_history: data.checkup_history.map(transformCheckupItem).reverse(),
    };

    updateUploadedData(checkupHistory);
    updateStep("confirm");
    handleStageOpenChange(false);
  };

  const handleGuideModalOpen = () => {
    setIsGuideModalOpen(true);
  };

  const handleGuideModalClose = () => {
    setIsGuideModalOpen(false);
  };

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
          <div className={clsx(formStyle.formButtonWrapper, formStyle.column)}>
            <div className={formStyle.formBoxCenter}>
              <Button
                onClick={handleGuideModalOpen}
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
                onClick={() => handleStageOpenChange(true)}
              >
                검진 파일 업로드
              </Button>
            </div>
          </div>
        </form>
      </div>

      <Modal
        title="건강검진 PDF 받기"
        open={isGuideModalOpen}
        onClose={handleGuideModalClose}
      >
        <ul className={commonStyle.ollist}>
          <li>
            국민건강보험 로그인{" "}
            <Link
              href="https://www.nhis.or.kr/"
              target="_blank"
              className={commonStyle.link}
            >
              바로가기
            </Link>
          </li>
          <li>건강모아 → 나의 건강 → 건강검진 결과조회 → 결과 한눈에 보기</li>
          <li>출력/저장 → PDF 저장</li>
        </ul>
      </Modal>

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
