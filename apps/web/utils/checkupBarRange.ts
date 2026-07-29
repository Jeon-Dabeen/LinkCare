type Range = { min: number; max: number };
type GradeThresholds = Record<string, Range>;
type SortedEntry = { grade: string } & Range;

const EXTREME_GRADES = ["low", "danger"]; // 최저나 최고가 0, 999 등 극단적인 수치를 가진 레벨
const REFERENCE_GRADE = "normal"; // 정상 레벨은 다른 레벨보다 범위가 넓어서 low나 danger의 가상 경계를 정하기에 좋은 값이 아니라 평균치 계산에서 제외

const EGFR_DISPLAY_MAX = 120;

// danger로 갈수록 수치가 작아지는 경우 오름차순으로 재정렬하는 함수
function sortEntriesByMin(thresholds: GradeThresholds): SortedEntry[] {
  return Object.entries(thresholds)
    .map(([grade, range]) => ({ grade, ...range }))
    .sort((a, b) => a.min - b.min);
}

function getAvgMiddleWidth(entries: SortedEntry[]): number {
  const middleWidths = entries
    .filter(
      (e) => e.grade !== REFERENCE_GRADE && !EXTREME_GRADES.includes(e.grade),
    )
    .map((e) => e.max - e.min);

  if (middleWidths.length > 0) {
    return middleWidths.reduce((sum, w) => sum + w, 0) / middleWidths.length;
  }

  const reference = entries.find((e) => e.grade === REFERENCE_GRADE);
  if (!reference) {
    throw new Error(`Thresholds must include a "${REFERENCE_GRADE}" grade.`);
  }
  return reference.max - reference.min;
}

// value가 속하는 band 안에서 위치하는 부분 (0 ~ 1 사이의 비율)
function localRatio(value: number, min: number, max: number): number {
  const clamped = Math.min(Math.max(value, min), max);
  return (clamped - min) / (max - min);
}

function toPercentage(
  bandIndex: number,
  ratio: number,
  bandWidth: number,
): number {
  const pct = bandIndex * bandWidth + ratio * bandWidth;
  return Math.min(100, Math.max(0, pct));
}

function findEntryIndex(entries: SortedEntry[], value: number): number {
  const index = entries.findIndex((e) => value >= e.min && value <= e.max);
  if (index !== -1) return index;
  return value < entries[0]!.min ? 0 : entries.length - 1;
}

function getBarRange(thresholds: GradeThresholds) {
  const entries = Object.entries(thresholds)
    .map(([grade, range]) => ({ grade, ...range }))
    .sort((a, b) => a.min - b.min);

  const referenceEntry = entries.find((e) => e.grade === REFERENCE_GRADE)!;

  const middleWidths = entries
    .filter(
      (e) => e.grade !== REFERENCE_GRADE && !EXTREME_GRADES.includes(e.grade),
    )
    .map((e) => e.max - e.min);

  const avgWidth =
    middleWidths.length > 0
      ? // low normal danger나 normal danger만 존재할 경우를 위해 초기값 필수로 지정
        middleWidths.reduce((a, b) => a + b, 0) / middleWidths.length
      : referenceEntry.max - referenceEntry.min;

  const first = entries[0]!;
  const last = entries[entries.length - 1]!;

  // effectiveMin, effectiveMax => 0이나 999 같은 극단적 수치를 의미있는 값으로 변경
  const effectiveMin = EXTREME_GRADES.includes(first.grade)
    ? first.max - avgWidth
    : first.min;

  const effectiveMax = EXTREME_GRADES.includes(last.grade)
    ? last.min + avgWidth
    : last.max;

  console.log(`effectiveMin: ${effectiveMin}, effectiveMax: ${effectiveMax}`);

  return {
    min: effectiveMin,
    max: effectiveMax,
    avgWidth,
    entries,
  };
}

export function getBarPercentage(
  value: number,
  thresholds: GradeThresholds,
  upperDangerBeyondNormal: boolean = false,
  /*
    hemoglobin만 true에 해당
    normal이 Bar 가장 오른쪽에 위치하고 최고 상한이 존재하는 경우 사용하는 boolean 값  
  */
): number {
  const entries = sortEntriesByMin(thresholds);
  const n = entries.length;
  const avgWidth = getAvgMiddleWidth(entries);

  const hasLeadingNormalBand = entries[0]!.grade === REFERENCE_GRADE;

  // normal의 Bar 가장 오른쪽에 있고 상한이 999가 아닌 경우 (hemoglobin)
  const hasTrailingDangerBand =
    upperDangerBeyondNormal && entries[n - 1]!.grade === REFERENCE_GRADE;

  const totalBands =
    n + Number(hasLeadingNormalBand) + Number(hasTrailingDangerBand);
  const bandWidth = 100 / totalBands;
  const indexOffset = Number(hasLeadingNormalBand);

  // normal 상한을 넘은 경우
  if (hasTrailingDangerBand) {
    const normalEntry = entries[n - 1]!;
    if (value > normalEntry.max) {
      const bandIndex = n - 1 + indexOffset + 1;
      const ratio = localRatio(
        value,
        normalEntry.max,
        normalEntry.max + avgWidth,
      );
      return toPercentage(bandIndex, ratio, bandWidth);
    }
  }

  const index = findEntryIndex(entries, value);
  const entry = entries[index]!;
  const isFirst = index === 0;
  const isLast = index === n - 1;

  let effMin = entry.min;
  let effMax = entry.max;

  if (isFirst && EXTREME_GRADES.includes(entry.grade)) {
    effMin = entry.max - avgWidth;
  }
  if (
    isLast &&
    EXTREME_GRADES.includes(entry.grade) &&
    !hasTrailingDangerBand
  ) {
    effMax = entry.min + avgWidth;
  }

  const ratio = localRatio(value, effMin, effMax);
  return toPercentage(index + indexOffset, ratio, bandWidth);
}

export function getEgfrBarPercentage(value: number): number {
  const percentage = (value / EGFR_DISPLAY_MAX) * 100;
  return Math.min(100, Math.max(0, percentage));
}
