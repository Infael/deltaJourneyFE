import { atom } from "jotai";

interface AuthAtom {
  authenticated: boolean;
}

export const authAtom = atom<AuthAtom>({
  authenticated: false,
});
