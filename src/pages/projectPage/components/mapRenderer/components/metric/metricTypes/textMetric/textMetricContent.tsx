import { compareStateAtom } from "@/state/compareStateAtom";
import { useAtomValue } from "jotai";
import { FC, useMemo } from "react";

interface TextMetricContentProps {
  content: string;
  comparedContent?: string;
}

export const TextMetricContent: FC<TextMetricContentProps> = ({ content, comparedContent }) => {
  const { activated, currentVersionColor, selectedVersionColor } = useAtomValue(compareStateAtom);

  const shouldShowComparison = useMemo(() => {
    if (!activated) return false;

    return content !== comparedContent;
  }, [content, comparedContent]);

  return (
    <div className="">
      {comparedContent && shouldShowComparison && (
        <div className="min-w-full flex-1 items-center justify-center text-center">
          <p
            className="mb-1 rounded-md px-2 py-1 text-sm line-through"
            dangerouslySetInnerHTML={{ __html: comparedContent }}
            style={{ backgroundColor: selectedVersionColor }}
          />
        </div>
      )}
      <div className="min-w-full flex-1 items-center justify-center text-center">
        <p
          className="rounded-md px-2 py-1 text-sm"
          dangerouslySetInnerHTML={{ __html: content }}
          style={{ backgroundColor: shouldShowComparison ? currentVersionColor : "" }}
        />
      </div>
    </div>
  );
};
