import { useState, useEffect } from 'react';
import { loadKnowledgeFile } from '../services/knowledgeService';

/**
 * Custom React hook for fetching a specific knowledge file safely.
 * @param {string} filename - The name of the JSON file (e.g., 'projects.json')
 */
export function useKnowledge(filename) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    loadKnowledgeFile(filename)
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [filename]);

  return { data, loading, error };
}

export default useKnowledge;
