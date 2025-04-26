import { atom } from "jotai";

interface MapStyle {
  key: string;
  bgColor: string;
  textColor: string;
}

export const mapStyles = {
  light: {
    key: "light",
    bgColor: "#fff",
    textColor: "#000",
  },
  dark: {
    key: "dark",
    bgColor: "#212121",
    textColor: "#fff",
  },
};

export const mapStyleAtom = atom<MapStyle>(mapStyles.light);
