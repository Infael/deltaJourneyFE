import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { canRedoAtom, canUndoAtom, projectRedoAtom, projectUndoAtom } from "@/state/projectWriteAtom";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";

export const EditMenu = () => {
  const canUndo = useAtomValue(canUndoAtom);
  const canRedo = useAtomValue(canRedoAtom);
  const undo = useSetAtom(projectUndoAtom);
  const redo = useSetAtom(projectRedoAtom);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && event.metaKey && event.key === "z") {
        event.preventDefault();
        redo();
      } else if (event.metaKey && event.key === "z") {
        event.preventDefault();
        undo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [undo]);

  return (
    <MenubarMenu>
      <MenubarTrigger>Edit</MenubarTrigger>
      <MenubarContent>
        <MenubarItem onClick={() => undo()} disabled={!canUndo}>
          Undo <MenubarShortcut>⌘Z</MenubarShortcut>
        </MenubarItem>
        <MenubarItem onClick={() => redo()} disabled={!canRedo}>
          Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem>Copy</MenubarItem>
        <MenubarItem>Paste and Replace</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
};
