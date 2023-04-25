import { useEffect } from 'react';
import { useTokenRefreshScheduler } from './TokenRefreshContext';
import { useUserStore } from '@/store/user';

function Core({ remainingTime }: { remainingTime?: number }) {
  const scheduler = useTokenRefreshScheduler();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (!remainingTime || !user) {
      return;
    }
    scheduler.schedule(remainingTime);
  }, [remainingTime, scheduler, user]);

  useEffect(() => {
    if (!user) return;
    const cleanup = scheduler.setup();
    return () => {
      cleanup();
    };
  }, [scheduler, user]);

  return null;
}

export default Core;
