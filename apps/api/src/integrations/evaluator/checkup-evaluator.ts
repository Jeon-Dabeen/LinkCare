import { logger } from "../../config/logger";
import * as REFERENCE_RANGES from "./checkup-range.json";

export class CheckupEvaluator {
  // 검진 항목별 메타데이터 매핑
  private static readonly ITEM_METADATA: Array<{
    key: string;
    unit: string;
    rangeKey: string;
    subKey?: string; // bp.systolic 처럼 2단계 깊이인 경우
    isGenderSpecific?: boolean; // 성별 분기가 필요한 항목인지
  }> = [
    { key: "waist", unit: "cm", rangeKey: "waist", isGenderSpecific: true },
    { key: "bmi", unit: "kg/m²", rangeKey: "bmi" },
    { key: "bp_systolic", unit: "mmHg", rangeKey: "bp", subKey: "systolic" },
    { key: "bp_diastolic", unit: "mmHg", rangeKey: "bp", subKey: "diastolic" },
    { key: "hemoglobin", unit: "g/dL", rangeKey: "hemoglobin", isGenderSpecific: true },
    { key: "fbg", unit: "mg/dL", rangeKey: "fbg" },
    { key: "creatinine", unit: "mg/dL", rangeKey: "creatinine" },
    { key: "egfr", unit: "mL/min/1.73m²", rangeKey: "egfr" },
    { key: "ast", unit: "U/L", rangeKey: "ast" },
    { key: "alt", unit: "U/L", rangeKey: "alt" },
    { key: "ygtp", unit: "U/L", rangeKey: "ygtp", isGenderSpecific: true },
  ];

  /**
   * @param inputData - { total_count: 3, checkup_history: [...] } 형태의 객체 또는 배열
   * @param gender - 'female' | 'male'
   */
  public static evaluateList(inputData: any, gender: "female" | "male") {
    logger.info(`evaluateList started.`);
    // 1. checkup_history가 있으면 해당 배열을 꺼내고, 아니면 inputData 자체를 배열로 판단
    const historyArray: any[] = Array.isArray(inputData)
      ? inputData
      : (inputData?.checkup_history ?? []);

    // 2. 추출한 배열로 상태(Status) 평가 진행
    const checkupStatusList = historyArray.map((record) => this.evaluateRecord(record, gender));

    // 3. 최종 JSON 결과 조립하여 반환
    logger.info(`evaluateList ended. count: ${checkupStatusList.length}`);
    logger.debug(checkupStatusList);
    return {
      total_count: checkupStatusList.length,
      gender: gender,
      checkup_status: checkupStatusList,
    };
  }

  /* 리턴 데이터 예시
  
    "total_count": 3,
    "gender": "female",
    "checkup_status": [
        {
          "checkup_year": "`25",
          "waist": {
              "value": "65.0",
              "unit": "cm",
              "status": "normal"
          },
          "bmi": {
              "value": "22.9",
              "unit": "kg/m²",
              "status": "normal"
          },
          "bp_systolic": {
              "value": "130",
              "unit": "mmHg",
              "status": "warning"
          },
          "bp_diastolic": {
              "value": "84",
              "unit": "mmHg",
              "status": "warning"
          },
          "hemoglobin": {
              "value": "12.9",
              "unit": "g/dL",
              "status": "normal"
          },
          "fbg": {
              "value": "105.0",
              "unit": "mg/dL",
              "status": "warning"
          },
          "creatinine": {
              "value": "0.58",
              "unit": "mg/dL",
              "status": "normal"
          },
          "egfr": {
              "value": "98.0",
              "unit": "mL/min/1.73m²",
              "status": "normal"
          },
          "ast": {
              "value": "21.0",
              "unit": "U/L",
              "status": "normal"
          },
          "alt": {
              "value": "13.0",
              "unit": "U/L",
              "status": "normal"
          },
          "ygtp": {
              "value": "16.0",
              "unit": "U/L",
              "status": "normal"
          },
          "urine_protein": {
              "value": "음성",
              "unit": "",
              "status": "normal"
          }
        },
        // ... 이하 생략
      }
    ]
  }
  */

  /**
   * 단일 수치와 범주 범위 기준을 비교하여 해당하는 카테고리(normal, warning 등) 리턴
   * 수치로 값이 되어있는 것만 처리 (요단백 제외)
   */
  private static evaluateRange(
    val: number,
    rangeObj: Record<string, { min: number; max: number }>,
  ): string {
    if (isNaN(val)) return "unknown";

    for (const [status, range] of Object.entries(rangeObj)) {
      if (val >= range.min && val <= range.max) {
        return status;
      }
    }
    return "unknown";
  }

  /**
   * 단일 검진 레코드를 받아 원하는 형태의 객체로 변환
   */
  public static evaluateRecord(record: Record<string, any>, gender: "male" | "female") {
    const result: Record<string, any> = {
      checkup_year: record.checkup_year ?? "",
    };

    // 1. 수치형 항목 반복문으로 일괄 처리
    for (const item of this.ITEM_METADATA) {
      const rawValue = record[item.key];
      const numericVal = parseFloat(rawValue);

      // 기준표 타겟 객체 탐색 (bp처럼 subKey가 있거나 성별 구분이 있는 경우 대응)
      let rangeTarget = REFERENCE_RANGES[item.rangeKey];
      if (item.subKey) rangeTarget = rangeTarget[item.subKey];
      if (item.isGenderSpecific) rangeTarget = rangeTarget[gender];

      result[item.key] = {
        value: rawValue ?? "",
        unit: item.unit,
        status: this.evaluateRange(numericVal, rangeTarget),
      };
    }

    // 2. 특수 항목: 요단백 (문자열 정성 검사이므로 단독 처리)
    const proteinVal = record.urine_protein ?? "";
    let urineProteinStatus = "unknown";
    if (proteinVal === REFERENCE_RANGES.urine_protein.normal) urineProteinStatus = "normal";
    else if (proteinVal === REFERENCE_RANGES.urine_protein.warning) urineProteinStatus = "warning";
    else if (proteinVal === REFERENCE_RANGES.urine_protein.danger) urineProteinStatus = "danger";

    result["urine_protein"] = {
      value: proteinVal,
      unit: "",
      status: urineProteinStatus,
    };

    return result;
  }
}
