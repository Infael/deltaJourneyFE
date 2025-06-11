import { Button } from "@/components/ui/button";
import { EditorField } from "@/components/ui/editor/editor";
import { EditorButton } from "@/components/ui/editor/editorButton";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { updateTouchpointNotesCommand } from "@/lib/project/commands/touchpointCommands/updateTouchpointNotesCommand";
import { currentProjectVersionAtom, projectWriteAtom } from "@/state/projectWriteAtom";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TextStyle from "@tiptap/extension-text-style";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useAtom, useAtomValue } from "jotai";
import { NotebookPenIcon } from "lucide-react";
import { FC, useEffect, useMemo } from "react";

interface TouchpointNotesProps {
  id: string;
}

export const TouchpointNotes: FC<TouchpointNotesProps> = ({ id }) => {
  const currentVersion = useAtomValue(currentProjectVersionAtom);
  const [, updateProject] = useAtom(projectWriteAtom);

  const touchpoint = useMemo(() => currentVersion?.touchpoints.find((tp) => tp.id === id), [currentVersion, id]);

  // Editor config
  const extensions = [Color.configure({ types: [TextStyle.name] }), TextStyle, StarterKit, Highlight];

  const editor = useEditor({
    extensions,
    content: touchpoint?.notes ?? "",
  });

  const handleSave = () => {
    if (!editor || !touchpoint || !currentVersion) {
      return;
    }

    if (editor.getHTML() === touchpoint.notes) {
      return;
    }

    updateProject((prev) => {
      const updatedProject = updateTouchpointNotesCommand(prev.project, {
        versionId: currentVersion.id,
        touchpointId: touchpoint.id,
        name: editor.getHTML(),
      });
      return {
        ...prev,
        project: updatedProject,
      };
    });
  };

  // if you change the data from outside, editor will not update the content automatically
  // we need to change it manually
  useEffect(() => {
    if (editor && touchpoint?.notes !== editor.getHTML()) {
      editor.commands.setContent(touchpoint?.notes ?? "");
    }
  }, [touchpoint]);

  if (!touchpoint || !editor) {
    return null;
  }

  return (
    <Sheet onOpenChange={(open) => !open && handleSave()}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="h-6 px-2">
          <NotebookPenIcon />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" portalContainerId="">
        <SheetHeader>
          <SheetTitle>{touchpoint?.name} Notes</SheetTitle>
          <SheetDescription>Here you can add and edit notes for the touchpoint.</SheetDescription>
        </SheetHeader>

        <div className="m-4 flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <EditorButton
              command={() => editor.chain().focus().toggleBold().run()}
              icon={<strong>B</strong>}
              tooltipContent="Bold"
              isActive={editor.isActive("bold")}
            />
            <EditorButton
              command={() => editor.chain().focus().toggleItalic().run()}
              icon={<i>I</i>}
              tooltipContent="Italic"
              isActive={editor.isActive("italic")}
            />
            <EditorButton
              command={() => editor.chain().focus().toggleStrike().run()}
              icon={<s>S</s>}
              tooltipContent="Strike"
              isActive={editor.isActive("strike")}
            />
            <EditorButton
              command={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              icon={<h1>H1</h1>}
              tooltipContent="Heading 1"
              isActive={editor.isActive("heading", { level: 1 })}
            />
            <EditorButton
              command={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              icon={<h2>H2</h2>}
              tooltipContent="Heading 2"
              isActive={editor.isActive("heading", { level: 2 })}
            />
            <EditorButton
              command={() => editor.chain().focus().toggleBulletList().run()}
              icon={<p>•</p>}
              tooltipContent="Bullet List"
              isActive={editor.isActive("bulletList")}
            />
            <EditorButton
              command={() => editor.chain().focus().toggleOrderedList().run()}
              icon={<p>1.</p>}
              tooltipContent="Ordered List"
              isActive={editor.isActive("orderedList")}
            />
          </div>
          <EditorField editor={editor} />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button>Save and close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
