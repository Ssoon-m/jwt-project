import { useRef } from 'react';
import { useUserStore } from '@/store/user';

interface Props {
  user: {
    userId: number;
    username: string;
  } | null;
}

const StoreInitializer = (props: Props) => {
  const setUser = useUserStore((state) => state.setUser);
  const initialized = useRef(false);
  if (!initialized.current) {
    setUser(props.user);
    initialized.current = true;
  }
  return null;
};

export default StoreInitializer;
