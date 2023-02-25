import { useEffect } from 'react';
import { useTokenRefreshScheduler } from './TokenRefreshContext';

function Core({ remainingTime }: { remainingTime?: number }) {
  const scheduler = useTokenRefreshScheduler();

  useEffect(() => {
    if (!remainingTime) {
      return;
    }
    scheduler.schedule(remainingTime);
  }, [remainingTime, scheduler]);

  useEffect(() => {
    const cleanup = scheduler.setup();
    return () => {
      cleanup();
    };
  }, [scheduler]);

  return null;
}

export default Core;
