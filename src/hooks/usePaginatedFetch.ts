// src/hooks/usePaginatedFetch.ts
import { useCallback, useEffect, useRef, useState } from "react";
import { customerApi } from "../api/axios";

interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

export function usePaginatedFetch<T = any>(
  endpoint: string,
  initialParams: Record<string, any> = {}
) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState<number>(initialParams.page ?? 1);
  const [pageSize, setPageSize] = useState<number>(initialParams.page_size ?? 5);
  const [count, setCount] = useState<number>(0);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [params, setParams] = useState<Record<string, any>>({
    ...initialParams,
  });

  // used to ignore stale responses
  const fetchIdRef = useRef<number>(0);

  // core fetcher: explicit page and params arguments (no reliance on outer stale vars)
  const fetchPage = useCallback(
    async (pageNumber: number = 1, appliedParams: Record<string, any> = params, append = false) => {
      const fetchId = ++fetchIdRef.current;
      setLoading(true);
      setError(null);

      try {
        const res = await customerApi.get<PaginatedResponse<T>>(endpoint, {
          params: {
            ...appliedParams,
            page: pageNumber,
            page_size: pageSize,
          },
        });

        // If a newer fetch started while this response was inflight, ignore this result
        if (fetchId !== fetchIdRef.current) return;

        const list = Array.isArray(res.results) ? res.results : [];
        if (append && pageNumber > 1) {
          setItems((prev) => [...prev, ...list]);
        } else {
          setItems(list);
        }

        setCount(res.count ?? list.length);
        setNext(res.next ?? null);
        setPrevious(res.previous ?? null);
      } catch (err: any) {
        // normalize error message
        const msg = err?.message || (err?.response && err.response.statusText) || "Failed to load";
        setError(msg);
      } finally {
        if (fetchId === fetchIdRef.current) {
          setLoading(false);
        }
      }
    },
    [endpoint, pageSize, params]
  );

  // effect: fetch whenever page OR params OR pageSize change
  useEffect(() => {
    // Standard behavior: replace results when page changes (not append)
    fetchPage(page, params, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, params, pageSize, fetchPage]);

  // helper: load next page and append
  const loadMore = useCallback(async () => {
    // if there's no next or already loading, do nothing
    if (!next || loading) return;
    const nextPage = page + 1;
    // update page (this will trigger effect which calls fetchPage)
    // but we want append behavior for loadMore -> call fetchPage directly with append=true
    setPage(nextPage);
    await fetchPage(nextPage, params, true);
  }, [next, loading, page, params, fetchPage]);

  // helper: force refresh (go to page 1 and refetch)
  const refresh = useCallback(() => {
    setPage(1);
    fetchPage(1, params, false);
  }, [fetchPage, params]);

  // direct setter for params that optionally resets page
  const setQueryParams = useCallback(
    (newParams: Record<string, any>, resetPage = true) => {
      setParams((prev) => ({ ...prev, ...newParams }));
      if (resetPage) setPage(1);
    },
    []
  );

  return {
    items,
    loading,
    error,

    page,
    pageSize,
    count,
    next,
    previous,

    setPage,
    setPageSize,
    setQueryParams,
    fetchPage, // call directly if needed
    loadMore,
    refresh,
  };
}
