import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

/** Loads data when the screen gains focus; exposes reload for pull-to-refresh. */
export function useApiData<T>(loader: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setError(null);
      setData(await loader());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  return { data, loading, error, reload, setData };
}
