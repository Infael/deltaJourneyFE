import { atom } from "jotai";
import { ProjectState, projectAtom } from "./projectAtom";

export const projectWriteAtom = atom(null, (get, set, updateFn: (prev: ProjectState) => ProjectState) => {
  const { current, past } = get(projectAtom);

  const updated = updateFn(current);

  set(projectAtom, {
    current: updated,
    past: [...past, current], // add to history
    future: [], // clear future when making a new change
  });
});

export const projectUndoAtom = atom(null, (get, set) => {
  const { current, past, future } = get(projectAtom);

  if (past.length === 0) return;

  const previous = past[past.length - 1];
  const newPast = past.slice(0, -1);

  set(projectAtom, {
    current: previous,
    past: newPast,
    future: [current, ...future],
  });
});

export const projectRedoAtom = atom(null, (get, set) => {
  const { current, past, future } = get(projectAtom);

  if (future.length === 0) return;

  const next = future[0];
  const newFuture = future.slice(1);

  set(projectAtom, {
    current: next,
    past: [...past, current],
    future: newFuture,
  });
});

export const canUndoAtom = atom((get) => {
  const { past } = get(projectAtom);
  return past.length > 0;
});

export const canRedoAtom = atom((get) => {
  const { future } = get(projectAtom);
  return future.length > 0;
});
