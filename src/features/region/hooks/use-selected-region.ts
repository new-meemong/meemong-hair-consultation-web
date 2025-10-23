import { useState, useEffect } from "react";

import { getUserSelectedRegionData, updateUserSelectedRegionData } from "@/shared";

import type { SelectedRegion } from "../types/selected-region";

export default function useSelectedRegion() {
  const [userSelectedRegionData, setUserSelectedRegionData] = useState<SelectedRegion | null>(null);

  useEffect(() => {
    setUserSelectedRegionData(getUserSelectedRegionData());
  }, []);

  const setSelectedRegionData = (selectedRegion: SelectedRegion | null) => {
    updateUserSelectedRegionData(selectedRegion);
    setUserSelectedRegionData(selectedRegion);
  };

  return { userSelectedRegionData, setSelectedRegionData };
}
