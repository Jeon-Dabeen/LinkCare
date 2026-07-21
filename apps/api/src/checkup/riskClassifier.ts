type Gender = "male" | "female";

interface Range {
  min: number;
  max: number;
}

// 위험도 수준(normal, warning, danger ...) -> Range or string
type LevelMap = Record<string, Range> | Record<string, string>;

// 하위 노드가 성별이나 다른 서브 타입의 노드, 또는 리프노드(LevelMap)가 될 수 있음
// 리프노드는 문자열이거나 숫자이기 때문에 런타임시 판별
type ThresholdNode = Record<string, unknown>;

export interface Thresholds {
  [key: string]: ThresholdNode;
}

// 받는 데이터 => 즉, riskRange.json에 있는 값과 비교할 사용자의 데이터
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

  private resolveNode(key: string, gender?: Gender, subtype?: string): LevelMap {
    const top = this.thresholds[key];
    if (!top) throw new Error(`알 수 없는 항목: ${key}`);

    let node: unknown = top;

    if (subtype !== undefined) {
      const withSub = node as Record<string, unknown>;
      if(!(subtype in withSub))
        throw new Error(`${key} 항목에 ${subtype} 서브타입이 없음`);
      node = withSub[subtype];
    }

    if (typeof node === "object" && node !== null && "male" in node && "female" in node) {
      if(gender === undefined) throw new Error(`${key} 항목에 gender가 없음`);
      node = (node as Record<Gender, LevelMap>)[gender];
    }

    return node as LevelMap;
  }

  classify(key:string, value: number|string, gender?:Gender, subtype?:string): ClassifyResult {
    const node = this.
  }
}
