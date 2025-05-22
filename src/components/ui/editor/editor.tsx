import { cn } from "@/lib/utils";
import { Editor, EditorContent } from "@tiptap/react";
import { FC } from "react";

import style from "./editor.module.css";

interface EditorFieldProps {
  editor: Editor;
  className?: string;
}

export const EditorField: FC<EditorFieldProps> = ({ editor, className }) => {
  return <EditorContent editor={editor} className={cn("w-full rounded-md border-1 p-2", style.editor, className)} />;
};
