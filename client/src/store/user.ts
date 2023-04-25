import { create } from 'zustand';

type State = {
  user: {
    userId: number;
    username: string;
  } | null;
};

type Actions = {
  setUser: (user: State['user']) => void;
};

export const useUserStore = create<State & Actions>((set) => ({
  user: null,
  setUser: (user) => set((state) => ({ user })),
}));
