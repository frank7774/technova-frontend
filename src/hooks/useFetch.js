import { useEffect, useState } from 'react';
export function useFetch(fn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    let activo = true;
    setLoading(true); setError(null);
    fn().then((res) => { if (activo) setData(res); }).catch((err) => { if (activo) setError(err.message); }).finally(() => { if (activo) setLoading(false); });
    return () => { activo = false; };
  }, deps);
  return { data, loading, error };
}