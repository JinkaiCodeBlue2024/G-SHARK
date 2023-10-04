import { atom } from "jotai";

export const loadingStateAtom = atom<
  { isLoading: boolean; message?: string }
>({
  isLoading: false,
});
