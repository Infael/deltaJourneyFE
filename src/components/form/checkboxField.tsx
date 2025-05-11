import { useFieldContext } from "@/hooks/useForm";
import { cn } from "@/lib/utils";
import { FC } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Paragraph } from "../ui/paragraph";

interface TextFieldProps {
  label?: string;
}

export const CheckboxField: FC<TextFieldProps> = ({ label }) => {
  const field = useFieldContext<boolean>();

  return (
    <div className="flex flex-1 flex-col gap-1">
      <div className="flex items-center gap-2">
        {label && (
          <Label htmlFor={field.name} className="flex-1">
            {label}
          </Label>
        )}
        <Checkbox
          id={field.name}
          checked={field.state.value}
          onCheckedChange={(e) => {
            field.handleChange(Boolean(e));
          }}
          className={cn(field.state.meta.errors.length > 0 ? "border-red-500" : "")}
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
