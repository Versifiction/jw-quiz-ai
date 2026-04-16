import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

export function useDocument(collectionName, documentId) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!collectionName || !documentId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const snap = await getDoc(doc(db, collectionName, documentId));
        if (!cancelled) {
          setData(snap.exists() ? { id: snap.id, ...snap.data() } : null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => { cancelled = true; };
  }, [collectionName, documentId]);

  return { data, loading, error };
}