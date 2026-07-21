/**
 * 건강검진 수치 -> 위험도 판정 유틸리티 (TypeScript 버전)
 *
 * thresholds.json 구조 특성:
 * 1) 성별로 나뉜 항목: waist, hemoglobin, ygtp  -> thresholds[key][gender]
 * 2) 세부항목으로 나뉜 항목: bp -> thresholds["bp"]["systolic"/"diastolic"]
 * 3) 단일 범위 항목: bmi, fbg, creatinine, egfr, ast, alt
 * 4) 범위가 아닌 문자열 매칭 항목: urine_protein
 */

type Gender = "male" | "female";

interface Range {
  min: number;
  max: number;
}

// 레벨 이름(normal, warning, danger 등) -> Range 또는 문자열
type LevelMap = Record<string, Range> | Record<string, string>;

// 성별로 나뉜 노드인지, 서브타입 노드인지, 아니면 바로 LevelMap인지가
// 항목마다 달라서 최상위 타입은 unknown에 가깝게 두고 런타임에 판별합니다.
type ThresholdNode = Record<string, unknown>;

export interface Thresholds {
  [key: string]: ThresholdNode;
}

// classify_all에 넘길 측정값. bp처럼 서브타입이 있는 항목은 객체로,
// 나머지는 number 또는 string(urine_protein)으로 넣습니다.
type MeasurementValue = number | string | Record<string, number>;

export interface Measurements {
  [key: string]: MeasurementValue;
}

export type ClassifyResult = string | undefined;

export class RiskClassifier {
  private thresholds: Thresholds;

  constructor(thresholds: Thresholds) {
    this.thresholds = thresholds;
  }

  static fromJson(json: string): RiskClassifier {
    return new RiskClassifier(JSON.parse(json) as Thresholds);
  }

  /** key(+gender/subtype)에 해당하는 범위 딕셔너리를 찾아 반환 */
  private resolveNode(
    key: string,
    gender?: Gender,
    subtype?: string,
  ): LevelMap {
    const top = this.thresholds[key];
    if (!top) {
      throw new Error(`알 수 없는 항목입니다: ${key}`);
    }

    let node: unknown = top;

    // bp처럼 systolic/diastolic 같은 서브타입이 있는 경우
    if (subtype !== undefined) {
      const withSub = node as Record<string, unknown>;
      if (!(subtype in withSub)) {
        throw new Error(`'${key}' 항목에 '${subtype}' 서브타입이 없습니다.`);
      }
      node = withSub[subtype];
    }

    // waist/hemoglobin/ygtp처럼 성별로 나뉜 경우
    // (최상위 키가 'male'/'female'을 모두 포함하는지로 판별)
    if (
      typeof node === "object" &&
      node !== null &&
      "male" in node &&
      "female" in node
    ) {
      if (gender === undefined) {
        throw new Error(
          `'${key}' 항목은 gender('male' 또는 'female')가 필요합니다.`,
        );
      }
      node = (node as Record<Gender, LevelMap>)[gender];
    }

    return node as LevelMap;
  }

  /**
   * 하나의 수치에 대한 위험도 레벨(문자열)을 반환.
   * 해당하는 구간이 없으면 undefined 반환.
   *
   * 예)
   *   classify("bmi", 27.3)                        -> "warning"
   *   classify("waist", 92, "male")                -> "danger"
   *   classify("bp", 135, undefined, "systolic")    -> "warning"
   *   classify("hemoglobin", 9.0, "female")         -> "warning"
   *   classify("urine_protein", "약양성")            -> "warning"
   */
  classify(
    key: string,
    value: number | string,
    gender?: Gender,
    subtype?: string,
  ): ClassifyResult {
    const node = this.resolveNode(key, gender, subtype);
    const entries = Object.entries(node);

    // urine_protein처럼 값 자체가 문자열이고, 레벨:문자열 매핑인 경우
    const isStringMap = entries.every(([, v]) => typeof v === "string");
    if (typeof value === "string" || isStringMap) {
      for (const [level, target] of entries) {
        if (target === value) return level;
      }
      return undefined;
    }

    // 숫자 범위 매칭
    for (const [level, rng] of entries as [string, Range][]) {
      if (value >= rng.min && value <= rng.max) {
        return level;
      }
    }
    return undefined;
  }

  /**
   * 여러 항목을 한 번에 판정.
   *
   * measurements 예시:
   * {
   *   waist: 92,
   *   bmi: 27.3,
   *   bp: { systolic: 135, diastolic: 85 },
   *   urine_protein: "약양성",
   *   hemoglobin: 9.0,
   *   fbg: 110,
   *   creatinine: 1.2,
   *   egfr: 70,
   *   ast: 45,
   *   alt: 30,
   *   ygtp: 40,
   * }
   */
  classifyAll(
    measurements: Measurements,
    gender: Gender,
  ): Record<string, ClassifyResult | Record<string, ClassifyResult>> {
    const results: Record<
      string,
      ClassifyResult | Record<string, ClassifyResult>
    > = {};

    for (const [key, value] of Object.entries(measurements)) {
      if (typeof value === "object" && value !== null) {
        // bp처럼 서브타입이 있는 경우
        const sub: Record<string, ClassifyResult> = {};
        for (const [subKey, subValue] of Object.entries(value)) {
          sub[subKey] = this.classify(key, subValue, gender, subKey);
        }
        results[key] = sub;
      } else {
        results[key] = this.classify(key, value, gender);
      }
    }

    return results;
  }
}

// ---- 사용 예시 ----
// import thresholdsJson from "./thresholds.json";
//
// const classifier = new RiskClassifier(thresholdsJson as Thresholds);
//
// const sample: Measurements = {
//   waist: 92,
//   bmi: 27.3,
//   bp: { systolic: 135, diastolic: 85 },
//   urine_protein: "약양성",
//   hemoglobin: 9.0,
//   fbg: 110,
//   creatinine: 1.2,
//   egfr: 70,
//   ast: 45,
//   alt: 30,
//   ygtp: 40,
// };
//
// console.log(classifier.classifyAll(sample, "male"));
