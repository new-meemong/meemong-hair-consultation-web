const STORE_RETURN_STATUS_STORAGE_PREFIX = 'store-return-status:';

export const STORE_RETURN_STATUS_KEYS = {
  MEEMONG_PASS: 'meemong-pass',
  GROWTH_PASS: 'growth-pass',
} as const;

export type StoreReturnStatusKey =
  (typeof STORE_RETURN_STATUS_KEYS)[keyof typeof STORE_RETURN_STATUS_KEYS];

function getStoreReturnStatusStorageKey(key: StoreReturnStatusKey) {
  return `${STORE_RETURN_STATUS_STORAGE_PREFIX}${key}`;
}

export function markPendingStoreReturnStatusCheck(key: StoreReturnStatusKey) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(getStoreReturnStatusStorageKey(key), '1');
}

export function hasPendingStoreReturnStatusCheck(key: StoreReturnStatusKey) {
  if (typeof window === 'undefined') return false;
  return window.sessionStorage.getItem(getStoreReturnStatusStorageKey(key)) === '1';
}

export function clearPendingStoreReturnStatusCheck(key: StoreReturnStatusKey) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(getStoreReturnStatusStorageKey(key));
}
