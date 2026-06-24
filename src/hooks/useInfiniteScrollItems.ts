import { useState, useEffect, useRef, useCallback } from "react";
import useAuthSession from "./useAuthSession";

interface UseInfiniteScrollResult<T> {
  items: T[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
}

interface FilterParams {
  minP?: number;
  maxP?: number;
  maxD?: number;
  fav?: boolean;
  categories?: number[];
  tags?: number[];
  wears?: number[];
  deliveries?: number[];
  payments?: number[];
}

export function useInfiniteScrollItems<T extends { itemId: number }>(
  fetchFunction: (token: string, page: number, filters: FilterParams) => Promise<T[]>,
  filters: FilterParams
): UseInfiniteScrollResult<T> {
  const [items, setItems] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const pageRef = useRef(1);
  const { isAuthenticated, token, logout } = useAuthSession();

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const currentPage = pageRef.current;
      const data = await fetchFunction(token, currentPage, filters);

      const newHasMore = Array.isArray(data) && data.length > 0;
      
      setItems(prev => [...prev, ...(Array.isArray(data) ? data : [])]);
      setHasMore(newHasMore);
      pageRef.current = currentPage + 1;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, fetchFunction, filters]);

  // Reset and load first page when filters change
  useEffect(() => {
    setItems([]);
    pageRef.current = 1;
    setHasMore(true);
    setError(null);
    setLoading(true);
    
    // Load first page directly
    (async () => {
      try {
        const data = await fetchFunction(token, 1, filters);
        const newHasMore = Array.isArray(data) && data.length > 0;
        setItems(Array.isArray(data) ? data : []);
        setHasMore(newHasMore);
        pageRef.current = 2;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    })();
  }, [filters, fetchFunction]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { threshold: 0.1 }
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  return { items, loading, error, hasMore, sentinelRef };
}