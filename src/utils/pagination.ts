// src/utils/pagination.ts
export function extractList(res: any) {
  if (!res) return [];
  // res might already be unwrapped JSON (res) or axios response (res.data)
  const payload = res?.results ? res : res?.data ? res.data : res;

  if (Array.isArray(payload)) return payload;
  if (payload.results && Array.isArray(payload.results)) return payload.results;
  if (payload.data && Array.isArray(payload.data)) return payload.data;
  return [];
}

export function extractMeta(res: any) {
  // returns { count, next, previous, page, page_size }
  const payload = res?.results ? res : res?.data ? res.data : res;
  return {
    count: payload?.count ?? null,
    next: payload?.next ?? null,
    previous: payload?.previous ?? null,
    // Some backends include page/page_size; if not, these remain null
    page: payload?.page ?? null,
    page_size: payload?.page_size ?? null,
  };
}
