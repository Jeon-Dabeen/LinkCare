import { logger } from "../../config/logger";
import * as REFERENCE_RANGES from "./checkup-range.json";

export class CheckupEvaluator {
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
  {
  "total_count": 3,
  "gender": "female",
  "checkup_status": [
    {
      "checkup_year": "`25",
      "waist": "normal",
      "bmi": "normal",
      "bp_systolic": "warning",
      "bp_diastolic": "warning",
      "urine_protein": "normal",
      "hemoglobin": "normal",
      "fbg": "warning",
      "creatinine": "normal",
      "egfr": "normal",
      "ast": "normal",
      "alt": "normal",
      "ygtp": "normal"
    },
    {
      "checkup_year": "`23",
      "waist": "normal",
      "bmi": "normal",
      ...
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
   * 단일 검진 레코드를 받아 원하는 형태의 status 객체로 변환
   */
  public static evaluateRecord(record: Record<string, any>, gender: "male" | "female") {
    // 1) waist (허리둘레 - 성별 구분)
    const waistVal = parseFloat(record.waist);
    const waistStatus = this.evaluateRange(waistVal, REFERENCE_RANGES.waist[gender]);

    // 2) bmi (성별 공통)
    const bmiVal = parseFloat(record.bmi);
    const bmiStatus = this.evaluateRange(bmiVal, REFERENCE_RANGES.bmi);

    // 3) bp (혈압 - 수축기 / 이완기)
    const bpSystolicVal = parseFloat(record.bp_systolic);
    const bpDiastolicVal = parseFloat(record.bp_diastolic);
    const bpSystolicStatus = this.evaluateRange(bpSystolicVal, REFERENCE_RANGES.bp.systolic);
    const bpDiastolicStatus = this.evaluateRange(bpDiastolicVal, REFERENCE_RANGES.bp.diastolic);

    // 4) urine_protein (요단백 - 텍스트 매칭)
    const proteinVal = record.urine_protein;
    let urineProteinStatus = "unknown";
    if (proteinVal === REFERENCE_RANGES.urine_protein.normal) urineProteinStatus = "normal";
    else if (proteinVal === REFERENCE_RANGES.urine_protein.warning) urineProteinStatus = "warning";
    else if (proteinVal === REFERENCE_RANGES.urine_protein.danger) urineProteinStatus = "danger";

    // 5) hemoglobin (혈색소 - 성별 구분)
    const hbVal = parseFloat(record.hemoglobin);
    const hemoglobinStatus = this.evaluateRange(hbVal, REFERENCE_RANGES.hemoglobin[gender]);

    // 6) fbg (공복혈당)
    const fbgVal = parseFloat(record.fbg);
    const fbgStatus = this.evaluateRange(fbgVal, REFERENCE_RANGES.fbg);

    // 7) creatinine (크레아티닌)
    const creVal = parseFloat(record.creatinine);
    const creatinineStatus = this.evaluateRange(creVal, REFERENCE_RANGES.creatinine);

    // 8) egfr (신사구체신재율)
    const egfrVal = parseFloat(record.egfr);
    const egfrStatus = this.evaluateRange(egfrVal, REFERENCE_RANGES.egfr);

    // 9) ast
    const astVal = parseFloat(record.ast);
    const astStatus = this.evaluateRange(astVal, REFERENCE_RANGES.ast);

    // 10) alt
    const altVal = parseFloat(record.alt);
    const altStatus = this.evaluateRange(altVal, REFERENCE_RANGES.alt);

    // 11) ygtp (감마지티피 - 성별 구분)
    const ygtpVal = parseFloat(record.ygtp);
    const ygtpStatus = this.evaluateRange(ygtpVal, REFERENCE_RANGES.ygtp[gender]);

    // 1 depth JSON 규격으로 반환
    return {
      checkup_year: record.checkup_year ?? "",
      waist: waistStatus,
      bmi: bmiStatus,
      bp_systolic: bpSystolicStatus,
      bp_diastolic: bpDiastolicStatus,
      urine_protein: urineProteinStatus,
      hemoglobin: hemoglobinStatus,
      fbg: fbgStatus,
      creatinine: creatinineStatus,
      egfr: egfrStatus,
      ast: astStatus,
      alt: altStatus,
      ygtp: ygtpStatus,
    };
  }
}
