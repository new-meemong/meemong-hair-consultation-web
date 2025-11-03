import { ALL_OPTION } from "@/features/region/constants/region";
import type { SelectedRegion } from "@/features/region/types/selected-region";

export default function convertToAddresses(  selectedRegion: SelectedRegion | null) {
  return selectedRegion
  ? selectedRegion.values.map((value) => value === ALL_OPTION ? selectedRegion.key : `${selectedRegion.key} ${value}`)
  : undefined;
}