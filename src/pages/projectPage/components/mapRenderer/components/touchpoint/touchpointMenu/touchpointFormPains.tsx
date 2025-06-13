import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { useFormResponses } from "@/hooks/useFormResponses";
import { FC } from "react";

interface TouchpointFormPainsProps {
  touchpointId: string;
}

export const TouchpointFormPains: FC<TouchpointFormPainsProps> = ({ touchpointId }) => {
  const { getTouchpointPainAnswers, isLoading } = useFormResponses();

  const gains = getTouchpointPainAnswers(touchpointId);

  return (
    <div className="flex flex-col gap-1">
      <Heading level="h4">Pains</Heading>
      {isLoading ? <Paragraph>Loading pains...</Paragraph> : <Paragraph>Pains from your survey responses:</Paragraph>}
      {gains?.length !== 0 ? (
        <ul>
          {gains.map((gain, index) => (
            <li key={index} className="ml-6 list-disc text-sm">
              {gain}
            </li>
          ))}
        </ul>
      ) : (
        !isLoading && (
          <Paragraph className="text-muted-foreground text-sm">No pains found for this touchpoint.</Paragraph>
        )
      )}
    </div>
  );
};
