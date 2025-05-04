import { useFieldContext } from "@/hooks/useForm";
import { cn } from "@/lib/utils";
import { FC } from "react";
import { Label } from "../ui/label";
import { Paragraph } from "../ui/paragraph";
import { Slider } from "../ui/slider";

interface SliderFieldProps {
  label?: string;
  max?: number;
  min?: number;
}

export const SliderField: FC<SliderFieldProps> = ({ label, max, min }) => {
  const field = useFieldContext<number>();

  return (
    <div className="flex flex-1 flex-col gap-1">
      <div className="flex items-center gap-2">
        {label && (
          <Label htmlFor={field.name} className="flex-1">
            {label} {field.state.value}
          </Label>
        )}
        <Slider
          id={field.name}
          value={[field.state.value]}
          max={max}
          min={min}
          step={1}
          onValueChange={(e) => {
            field.handleChange(e[0]);
          }}
          className={cn(field.state.meta.errors.length > 0 ? "border-red-500" : "", "flex-2")}
        />
      </div>
      {field.state.meta.errors.length > 0 && (
        <Paragraph size="small" className="self-end text-red-500">
          {field.state.meta.errors[0].message}
        </Paragraph>
      )}
    </div>
  );
};
