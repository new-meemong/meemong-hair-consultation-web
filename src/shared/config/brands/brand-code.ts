export function hasBrandCode(brandCode: string | null): brandCode is string {
  return brandCode !== null && brandCode.trim().length > 0;
}
