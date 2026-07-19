
export function formatNumber(value?: number | null) {
  return value == null ? "-" : value.toLocaleString();
}

