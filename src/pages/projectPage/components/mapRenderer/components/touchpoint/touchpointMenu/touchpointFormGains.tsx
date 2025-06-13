import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { useFormResponses } from "@/hooks/useFormResponses";
import { FC } from "react";

interface TouchpointFormGainsProps {
  touchpointId: string;
}

export const TouchpointFormGains: FC<TouchpointFormGainsProps> = ({ touchpointId }) => {
  const { getTouchpointGainAnswers, isLoading } = useFormResponses();

  const gains = getTouchpointGainAnswers(touchpointId);

  return (
    <div className="flex flex-col gap-1">
      <Heading level="h4">Gains</Heading>
      {isLoading ? <Paragraph>Loading gains...</Paragraph> : <Paragraph>Gains from your survey responses:</Paragraph>}
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
          <Paragraph className="text-muted-foreground text-sm">No gains found for this touchpoint.</Paragraph>
        )
      )}
    </div>
  );
};
