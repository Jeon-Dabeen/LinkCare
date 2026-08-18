import commonStyle from "@/styles/common.module.css";
import formStyle from "@/styles/components/form.module.css";

import { FileQuestionMark } from "lucide-react";
import Input from "@/app/_components/ui/Input";
import StatePage from "@/app/_components/ui/StatePage";
import Button from "@/app/_components/ui/Button";
import EmptyPage from "@/app/_components/ui/EmptyPage";

import clsx from "clsx";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ENV } from "@/env";

import { CheckupHistoryItem, UploadedData } from "@/types/checkup";
import { useEffect, useState } from "react";

interface CheckupRegistrationFormProps {
  uploadedData: UploadedData;
  updateStep: (step: "upload" | "confirm") => void;
  isStatePageOpen: boolean;
  handleStageOpenChange: (bool: boolean) => void;
  handleInputChange: (
    year: number,
    field: keyof CheckupHistoryItem,
    value: string | number | undefined,
  ) => void;
}

export default function CheckupRegistrationForm({
  uploadedData,
  updateStep,
  isStatePageOpen,
  handleStageOpenChange,
  handleInputChange,
}: CheckupRegistrationFormProps) {
  const router = useRouter();
  const [originalData, setOriginalData] = useState<CheckupHistoryItem[]>(
    uploadedData.checkup_history,
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setOriginalData(uploadedData.checkup_history);
  }, [uploadedData]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [index]);

  if (!uploadedData) {
    toast.error("검진 결과를 불러오지 못했어요. 다시 파일을 업로드 해주세요.");
    updateStep("upload");
  }

  const historyItems = uploadedData.checkup_history;

  const handleButtonClick = async () => {
    if (index !== historyItems.length - 1) {
      setIndex((prev) => prev + 1);
      return;
    }

    const response = await fetch(`${ENV.API_URL}/checkup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(uploadedData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || "검진 데이터 저장 중 오류가 발생했습니다.";

      toast.error("등록이 실패했습니다. 다시 시도 해주세요.");
      throw new Error(errorMessage);
    }

    handleStageOpenChange(true);

    router.push("/checkup");
  };

  return (
    <section className={commonStyle.mainContent}>
      <div className={commonStyle.pageTitleWrapper}>
        <h2 className={commonStyle.pageTitle}>건강검진 결과 확인</h2>
      </div>
      <div className={formStyle.formWrapper}>
        {historyItems[index] && originalData[index] ? (
          <div className={formStyle.form}>
            <div className={formStyle.formGroup}>
              <div className={formStyle.formInputWrapper}>
                <div className={formStyle.formGroup}>
                  <p className={formStyle.formLabel}>년도</p>
                  <Input
                    key={`checkup_year-${index}`}
                    type="number"
                    placeholder={`${originalData[index].checkup_year}`}
                    defaultValue={historyItems[index].checkup_year}
                    onChange={(event) =>
                      handleInputChange(
                        historyItems[index]?.checkup_year as number,
                        "checkup_year",
                        +event.target.value,
                      )
                    }
                  />
                </div>
                <div className={formStyle.formGroup}>
                  <p className={formStyle.formLabel}>신장</p>
                  <Input
                    key={`height-${index}`}
                    unit="cm"
                    type="number"
                    placeholder={`${originalData[index].height}`}
                    defaultValue={historyItems[index].height}
                    onChange={(event) =>
                      handleInputChange(
                        historyItems[index]?.checkup_year as number,
                        "height",
                        +event.target.value,
                      )
                    }
                  />
                </div>
                <div className={formStyle.formGroup}>
                  <p className={formStyle.formLabel}>체중</p>
                  <Input
                    key={`weight-${index}`}
                    unit="kg"
                    type="number"
                    placeholder={`${originalData[index].weight}`}
                    defaultValue={historyItems[index].weight}
                    onChange={(event) =>
                      handleInputChange(
                        historyItems[index]?.checkup_year as number,
                        "weight",
                        +event.target.value,
                      )
                    }
                  />
                </div>
              </div>
            </div>
            <div className={formStyle.formGroup}>
              <div className={formStyle.formInputWrapper}>
                <div className={formStyle.formGroup}>
                  <p className={formStyle.formLabel}>허리둘레</p>
                  <Input
                    key={`waist-${index}`}
                    unit="cm"
                    type="number"
                    placeholder={`${originalData[index].waist}`}
                    defaultValue={historyItems[index].waist}
                    onChange={(event) =>
                      handleInputChange(
                        historyItems[index]?.checkup_year as number,
                        "waist",
                        +event.target.value,
                      )
                    }
                  />
                </div>
                <div className={formStyle.formGroup}>
                  <p className={formStyle.formLabel}>체질량지수</p>
                  <Input
                    key={`bmi-${index}`}
                    unit="kg/㎡"
                    type="number"
                    placeholder={`${originalData[index].bmi}`}
                    defaultValue={historyItems[index].bmi}
                    onChange={(event) =>
                      handleInputChange(
                        historyItems[index]?.checkup_year as number,
                        "bmi",
                        +event.target.value,
                      )
                    }
                  />
                </div>
              </div>
            </div>
            <div className={formStyle.formGroup}>
              <div className={formStyle.formInputWrapper}>
                <div className={formStyle.formGroup}>
                  <p className={formStyle.formLabel}>시력 좌</p>
                  <Input
                    key={`visionLeft-${index}`}
                    type="number"
                    placeholder={`${originalData[index].visionLeft}`}
                    defaultValue={historyItems[index].visionLeft}
                    onChange={(event) =>
                      handleInputChange(
                        historyItems[index]?.checkup_year as number,
                        "visionLeft",
                        +event.target.value,
                      )
                    }
                  />
                </div>
                <div className={formStyle.formGroup}>
                  <p className={formStyle.formLabel}>시력 우</p>
                  <Input
                    key={`visionRight-${index}`}
                    type="number"
                    placeholder={`${originalData[index].visionRight}`}
                    defaultValue={historyItems[index].visionRight}
                    onChange={(event) =>
                      handleInputChange(
                        historyItems[index]?.checkup_year as number,
                        "visionRight",
                        +event.target.value,
                      )
                    }
                  />
                </div>
              </div>
            </div>
            <div className={formStyle.formGroup}>
              <p className={formStyle.formLabel}>청력</p>
              <Input
                key={`hearing-${index}`}
                type="text"
                placeholder={`${originalData[index].hearing}`}
                defaultValue={historyItems[index].hearing}
                onChange={(event) =>
                  handleInputChange(
                    historyItems[index]?.checkup_year as number,
                    "hearing",
                    event.target.value,
                  )
                }
              />
            </div>
            <div className={formStyle.formGroup}>
              <div className={formStyle.formInputWrapper}>
                <div className={formStyle.formGroup}>
                  <p className={formStyle.formLabel}>수축기혈압</p>
                  <Input
                    key={`bp_systolic-${index}`}
                    unit="mmHg"
                    type="number"
                    placeholder={`${originalData[index].bp_systolic}`}
                    defaultValue={historyItems[index].bp_systolic}
                    onChange={(event) =>
                      handleInputChange(
                        historyItems[index]?.checkup_year as number,
                        "bp_systolic",
                        +event.target.value,
                      )
                    }
                  />
                </div>
                <div className={formStyle.formGroup}>
                  <p className={formStyle.formLabel}>확장기혈압</p>
                  <Input
                    key={`bp_diastolic-${index}`}
                    unit="mmHg"
                    type="number"
                    placeholder={`${originalData[index].bp_diastolic}`}
                    defaultValue={historyItems[index].bp_diastolic}
                    onChange={(event) =>
                      handleInputChange(
                        historyItems[index]?.checkup_year as number,
                        "bp_diastolic",
                        +event.target.value,
                      )
                    }
                  />
                </div>
              </div>
            </div>
            <div className={formStyle.formGroup}>
              <p className={formStyle.formLabel}>요단백</p>
              <Input
                key={`urine_protein-${index}`}
                type="text"
                placeholder={`${originalData[index].urine_protein}`}
                defaultValue={historyItems[index].urine_protein}
                onChange={(event) =>
                  handleInputChange(
                    historyItems[index]?.checkup_year as number,
                    "urine_protein",
                    event.target.value,
                  )
                }
              />
            </div>
            <div className={formStyle.formGroup}>
              <p className={formStyle.formLabel}>혈색소</p>
              <Input
                key={`hemoglobin-${index}`}
                unit="g/DL"
                type="number"
                placeholder={`${originalData[index].hemoglobin}`}
                defaultValue={historyItems[index].hemoglobin}
                onChange={(event) =>
                  handleInputChange(
                    historyItems[index]?.checkup_year as number,
                    "hemoglobin",
                    +event.target.value,
                  )
                }
              />
            </div>
            <div className={formStyle.formGroup}>
              <p className={formStyle.formLabel}>식전혈당</p>
              <Input
                key={`fbg-${index}`}
                unit="mg/DL"
                type="number"
                placeholder={`${originalData[index].fbg}`}
                defaultValue={historyItems[index].fbg}
                onChange={(event) =>
                  handleInputChange(
                    historyItems[index]?.checkup_year as number,
                    "fbg",
                    +event.target.value,
                  )
                }
              />
            </div>
            <div className={formStyle.formGroup}>
              <div className={formStyle.formInputWrapper}>
                <div className={formStyle.formGroup}>
                  <p className={formStyle.formLabel}>혈청크레아티닌</p>
                  <Input
                    key={`creatinine-${index}`}
                    unit="mg/DL"
                    type="number"
                    placeholder={`${originalData[index].creatinine}`}
                    defaultValue={historyItems[index].creatinine}
                    onChange={(event) =>
                      handleInputChange(
                        historyItems[index]?.checkup_year as number,
                        "creatinine",
                        +event.target.value,
                      )
                    }
                  />
                </div>
                <div className={formStyle.formGroup}>
                  <p className={formStyle.formLabel}>신사구체여과율(GFR)</p>
                  <Input
                    key={`egfr-${index}`}
                    unit="mL/min"
                    type="number"
                    placeholder={`${originalData[index].egfr}`}
                    defaultValue={historyItems[index].egfr}
                    onChange={(event) =>
                      handleInputChange(
                        historyItems[index]?.checkup_year as number,
                        "egfr",
                        +event.target.value,
                      )
                    }
                  />
                </div>
              </div>
            </div>
            <div className={formStyle.formGroup}>
              <div className={formStyle.formInputWrapper}>
                <div className={formStyle.formGroup}>
                  <p className={formStyle.formLabel}>AST(SGOT)</p>
                  <Input
                    key={`ast-${index}`}
                    unit="U/L"
                    type="number"
                    placeholder={`${originalData[index].ast}`}
                    defaultValue={historyItems[index].ast}
                    onChange={(event) =>
                      handleInputChange(
                        historyItems[index]?.checkup_year as number,
                        "ast",
                        +event.target.value,
                      )
                    }
                  />
                </div>
                <div className={formStyle.formGroup}>
                  <p className={formStyle.formLabel}>ALT(SGPT)</p>
                  <Input
                    key={`alt-${index}`}
                    unit="U/L"
                    type="number"
                    placeholder={`${originalData[index].alt}`}
                    defaultValue={historyItems[index].alt}
                    onChange={(event) =>
                      handleInputChange(
                        historyItems[index]?.checkup_year as number,
                        "alt",
                        +event.target.value,
                      )
                    }
                  />
                </div>
              </div>
            </div>
            <div className={formStyle.formGroup}>
              <p className={formStyle.formLabel}>감마지피티(y-GPT)</p>
              <Input
                key={`ygtp-${index}`}
                unit="U/L"
                type="number"
                placeholder={`${originalData[index].ygtp}`}
                defaultValue={historyItems[index].ygtp}
                onChange={(event) =>
                  handleInputChange(
                    historyItems[index]?.checkup_year as number,
                    "ygtp",
                    +event.target.value,
                  )
                }
              />
            </div>
          </div>
        ) : (
          <EmptyPage
            icon={<FileQuestionMark size={32} />}
            description={`{y}년 데이터가 없어요.`}
          />
        )}
        <div className={clsx(formStyle.formButtonWrapper, formStyle.column)}>
          <div className={formStyle.formBox}>
            <Button
              type="button"
              variant="primary"
              size="large"
              full
              onClick={handleButtonClick}
            >
              {index !== historyItems.length - 1 ? "다음" : "저장"}
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
