import { cn } from "@/lib/utils";
import { viewAtom } from "@/state/viewAtom";
import { Color } from "@tiptap/extension-color";

import { updateTextMetricValueCommand } from "@/lib/project/commands/metricCommands/textMetricCommands/updateTextMetricValueCommand";
import { TextMetricData } from "@/lib/project/models/metrics";
import { projectWriteAtom } from "@/state/projectWriteAtom";
import Highlight from "@tiptap/extension-highlight";
import TextStyle from "@tiptap/extension-text-style";
import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useAtomValue, useSetAtom } from "jotai";
import { FC, useEffect } from "react";
import { MapCell } from "../../mapCell";
import { MetricDataWithTouchpoint } from "../metric";

interface TextMetricProps {
  metricData: MetricDataWithTouchpoint<TextMetricData>[];
}

const GREEN = "#008000";
const RED = "#ff5454";
const BLUE = "#0000ff";

const DEFAULT_CONTENT = '<p><span style="color: rgb(204, 204, 204)">Nothing here<br>start typing now...</span></p>';

interface TextMetricEditorProps {
  data: MetricDataWithTouchpoint<TextMetricData>;
}

export const TextMetricEditor: FC<TextMetricEditorProps> = ({ data }) => {
  const extensions = [Color.configure({ types: [TextStyle.name] }), TextStyle, StarterKit, Highlight];
  const updateProject = useSetAtom(projectWriteAtom);

  const editor = useEditor({
    extensions,
    content: data?.metricData?.value ?? DEFAULT_CONTENT,
    onUpdate: ({ editor }) => {
      updateProject((prev) => {
        const newProject = updateTextMetricValueCommand(prev.project, {
          metricId: data.metricData?.id ?? data.metricId,
          touchpointId: data.touchpointId,
          value: editor.getHTML(),
          versionId: prev.actualShowedVersion,
        });

        return {
          ...prev,
          project: newProject,
        };
      });
    },
    onFocus: ({ editor }) => {
      if (editor.getHTML() === DEFAULT_CONTENT) {
        editor.commands.setContent("");
      }
    },
    onBlur: ({ editor }) => {
      if (editor.isEmpty) {
        editor.commands.setContent(DEFAULT_CONTENT);
      }
    },
  });

  // if you change the data from outside, editor will not update the content automatically
  // we need to change it manually
  useEffect(() => {
    if (editor && data?.metricData?.value !== editor.getHTML()) {
      editor.commands.setContent(data?.metricData?.value ?? DEFAULT_CONTENT);
    }
  }, [data]);

  const bubbleMenuButtonStyle = (isActive: boolean) =>
    cn("hover:bg-bg rounded-sm py-1 px-2 cursor-pointer", isActive ? "bg-main hover:bg-main" : "");

  const bubbleMenuColorButtonStyle = (isActive: boolean, color: string) =>
    cn(
      `my-auto mr-1 cursor-pointer w-4 h-4 hover:outline-3 hover:outline-bg ${color}`,
      isActive ? "outline-main outline-3 hover:outline-main" : "",
    );

  return (
    editor && (
      <>
        <EditorContent editor={editor} className="w-full" />

        <BubbleMenu
          className="bg-bw shadow-shadow flex flex-nowrap content-center rounded-sm border-1"
          tippyOptions={{ duration: 100 }}
          editor={editor}
        >
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={bubbleMenuButtonStyle(editor.isActive("bold"))}
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={bubbleMenuButtonStyle(editor.isActive("italic"))}
          >
            <i>I</i>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={bubbleMenuButtonStyle(editor.isActive("strike"))}
          >
            <s>S</s>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={bubbleMenuButtonStyle(editor.isActive("highlight"))}
          >
            Highlight
          </button>
          <button
            onClick={() =>
              editor.isActive("textStyle", { color: RED })
                ? editor.chain().focus().unsetColor().run()
                : editor.chain().focus().setColor(RED).run()
            }
            className={cn(
              bubbleMenuColorButtonStyle(editor.isActive("textStyle", { color: RED }), "bg-[#ff5454]"),
              "ml-2",
            )}
          />
          <button
            onClick={() =>
              editor.isActive("textStyle", { color: GREEN })
                ? editor.chain().focus().unsetColor().run()
                : editor.chain().focus().setColor(GREEN).run()
            }
            className={bubbleMenuColorButtonStyle(editor.isActive("textStyle", { color: GREEN }), "bg-[#008000]")}
          />
          <button
            onClick={() =>
              editor.isActive("textStyle", { color: BLUE })
                ? editor.chain().focus().unsetColor().run()
                : editor.chain().focus().setColor(BLUE).run()
            }
            className={bubbleMenuColorButtonStyle(editor.isActive("textStyle", { color: BLUE }), "bg-[#0000ff]")}
          />
        </BubbleMenu>
      </>
    )
  );
};

export const TextMetric: FC<TextMetricProps> = ({ metricData: data }) => {
  const { presentationMode } = useAtomValue(viewAtom);

  return data.map((metric, index) => (
    <MapCell key={`${metric.metricData?.id}_${index}`} className="overflow-visible">
      {presentationMode && metric.metricData && (
        <p className="text-center text-sm" dangerouslySetInnerHTML={{ __html: metric.metricData.value }}></p>
      )}
      <div className={presentationMode ? "hidden" : ""}>
        <TextMetricEditor data={metric} />
      </div>
    </MapCell>
  ));
};
