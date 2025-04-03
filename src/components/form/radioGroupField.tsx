import { useFieldContext } from "@/hooks/useForm";
import { FC } from "react";
import { Label } from "../ui/label";
import { Paragraph } from "../ui/paragraph";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface RadioFieldProps {
  label: string;
  items: {
    label: string;
    value: string;
  }[];
}

export const RadioGroupField: FC<RadioFieldProps> = ({ label, items }) => {
  const field = useFieldContext<string>();

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={field.name} className="pb-2">
        {label}
      </Label>
      <RadioGroup id={field.name} name={field.name} value={field.state.value} onValueChange={field.handleChange}>
        {items.map((item) => (
          <div key={`${field.name}-${item.value}`} className="flex items-center gap-2">
            <RadioGroupItem id={`${field.name}-${item.value}`} value={item.value} />
            <Label htmlFor={`${field.name}-${item.value}`} className="text-sm">
              {item.label}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {field.state.meta.errors.length > 0 && (
        <Paragraph size="small" className="self-end text-red-500">
          {field.state.meta.errors[0].message}
        </Paragraph>
      )}
    </div>
  );
};
