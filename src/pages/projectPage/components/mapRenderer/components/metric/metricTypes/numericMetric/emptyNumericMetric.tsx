import { Paragraph } from "@/components/ui/paragraph";
import { viewAtom } from "@/state/viewAtom";

import { useAtomValue } from "jotai";
import { FC } from "react";
import { NumericMetricFormDialog } from "./numericMetricFormDialog";

interface NumericMetricFieldProps {
  metricId: string;
  touchpointId: string;
}

export const EmptyNumericMetric: FC<NumericMetricFieldProps> = ({ metricId, touchpointId }) => {
  const { presentationMode, editable } = useAtomValue(viewAtom);

  return (
    !presentationMode &&
    editable && (
      <NumericMetricFormDialog metricId={metricId} touchpointId={touchpointId}>
        <>
          <Paragraph variant="faded">No data yet...</Paragraph>
          <Paragraph variant="faded">Click here</Paragraph>
          <Paragraph variant="faded">to add data</Paragraph>
        </>
      </NumericMetricFormDialog>
    )
  );
};
