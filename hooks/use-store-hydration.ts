import { useEffect, useState } from 'react';
import { useFinanceStore } from '../stores/finance-store';

export function useStoreHydration() {
  const [hydrated, setHydrated] = useState(useFinanceStore.persist.hasHydrated());

  useEffect(() => {
    const unsub = useFinanceStore.persist.onFinishHydration(() => setHydrated(true));
    return () => unsub();
  }, []);

  return hydrated;
}
