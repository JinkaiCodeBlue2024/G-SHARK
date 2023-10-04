import { atom } from "jotai";

export const loadingStateAtom = atom<
  { isLoading: boolean; message?: string }
>({
  isLoading: false,
});

export const showDarkerOverlayAtom = atom(false);
export const sidebarOpenAtom = atom(false);
