import { atom } from "jotai";

interface ViewState {
  showedHud: boolean;
}

export const ViewAtom = atom<ViewState>({
  showedHud: true,
});
