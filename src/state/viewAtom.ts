import { atom } from "jotai";

interface ViewState {
  showedHud: boolean;
  presentationMode: boolean;
}

export const viewAtom = atom<ViewState>({
  showedHud: true,
  presentationMode: false,
});
