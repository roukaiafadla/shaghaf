import { useState, useEffect, useCallback } from 'react';
import api from '../api/client';

// Loads posts one page at a time ("Load more" style).
//
//   const { posts, total, loading, loadingMore, error, hasMore, loadMore } =
//     usePagedPosts({ category: 'arts' });
//
// `params` are extra query parameters (category, search...). Changing them starts over.
const usePagedPosts = (params = {}, pageSize = 12) => {
  // A string key lets the effect below re-run only when the *values* change,
  // not every render (a new {} object each render would otherwise loop forever).
  const key = JSON.stringify(params);

  const [data, setData] = useState({ posts: [], page: 0, pages: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);

  const fetchPage = useCallback(
    (page) =>
      api.get('/posts', { params: { ...JSON.parse(key), page, limit: pageSize } }).then((res) => res.data),
    [key, pageSize]
  );

  // First page: runs on mount and whenever the filters change
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    fetchPage(1)
      .then((first) => {
        if (!cancelled) setData(first);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true; // ignore a slow answer that arrives after the filters changed
    };
  }, [fetchPage]);

  const hasMore = data.page < data.pages;

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const next = await fetchPage(data.page + 1);
      setData((prev) => {
        // New posts published meanwhile can push items onto the next page,
        // so skip anything we already have.
        const seen = new Set(prev.posts.map((p) => p._id));
        return { ...next, posts: [...prev.posts, ...next.posts.filter((p) => !seen.has(p._id))] };
      });
    } catch (err) {
      setError(true);
    } finally {
      setLoadingMore(false);
    }
  }, [data.page, hasMore, loadingMore, fetchPage]);

  return { posts: data.posts, total: data.total, loading, loadingMore, error, hasMore, loadMore };
};

export default usePagedPosts;
