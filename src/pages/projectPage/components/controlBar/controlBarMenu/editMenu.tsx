import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { copyDjProject } from "@/lib/copyDjProject";
import { formatDjProject } from "@/lib/formatDjProject";
import { pasteDjProject } from "@/lib/pasteDjProject";
import { projectAtom } from "@/state/projectAtom";
import { canRedoAtom, canUndoAtom, projectRedoAtom, projectUndoAtom } from "@/state/projectWriteAtom";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";

export const EditMenu = () => {
  const canUndo = useAtomValue(canUndoAtom);
  const canRedo = useAtomValue(canRedoAtom);
  const undo = useSetAtom(projectUndoAtom);
  const redo = useSetAtom(projectRedoAtom);

  const [projectWithHistory, setCurrentProjectWithHistory] = useAtom(projectAtom);

  const handlePaste = async () => {
    const clipboardData = await pasteDjProject();
    if (clipboardData) {
      const project = formatDjProject(clipboardData);
      if (!project) {
        console.error("Invalid project data");
        return;
      }
      setCurrentProjectWithHistory((prev) => ({
        ...prev,
        current: project,
      }));
    }
  };

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
        <MenubarItem onClick={() => copyDjProject(projectWithHistory.current)}>Copy</MenubarItem>
        <MenubarItem onClick={handlePaste}>Paste and Replace</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
};
