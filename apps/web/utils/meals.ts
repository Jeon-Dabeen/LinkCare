
export function parseKcal(text: string): number | null {
  const nums = text.match(/\d+/g);

  if (!nums) return null;

  if (nums.length === 1) {
    return Number(nums[0]);
  }

  return Math.round(
    (Number(nums[0]) + Number(nums[1])) / 2
  );
}

