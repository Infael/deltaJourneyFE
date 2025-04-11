import { atom } from "jotai";
import { ReactInstance, RefObject } from "react";

export const mapRefAtom = atom<RefObject<ReactInstance> | null>(null);
