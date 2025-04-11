import { atom } from "jotai";

interface ViewState {
  showedHud: boolean;
  presentationMode: boolean;
}

export const ViewAtom = atom<ViewState>({
  showedHud: true,
  presentationMode: false,
});
