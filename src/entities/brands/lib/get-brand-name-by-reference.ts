type BrandReference = {
  id: number;
};

type GetBrandNameByReferenceParams = {
  brands?: BrandReference[] | null;
  brandIds?: number[] | null;
  brandIdMap: Map<number, string>;
  fallbackBrandName?: string;
};

export function getBrandNameByReference({
  brands,
  brandIds,
  brandIdMap,
  fallbackBrandName,
}: GetBrandNameByReferenceParams) {
  const ids = brandIds && brandIds.length > 0 ? brandIds : (brands?.map(({ id }) => id) ?? []);

  if (ids.length === 0) {
    return fallbackBrandName;
  }

  return ids.map((id) => brandIdMap.get(id)).find((name): name is string => Boolean(name));
}
