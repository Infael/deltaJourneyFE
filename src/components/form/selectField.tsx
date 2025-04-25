import { useFieldContext } from "@/hooks/useForm";
import { FC } from "react";
import { Label } from "../ui/label";
import { Paragraph } from "../ui/paragraph";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface SelectFieldProps {
  label?: string;
  items: {
    label: string;
    value: string;
  }[];
  defaultValue?: string;
}

export const SelectField: FC<SelectFieldProps> = ({ label, items, defaultValue }) => {
  const field = useFieldContext<string>();

  return (
    <div className="flex items-center gap-2">
      {label && (
        <Label className="flex-1" htmlFor={field.name}>
          {label}
        </Label>
      )}
      <Select
        value={field.state.value}
        onValueChange={field.handleChange}
        defaultValue={defaultValue ?? items[0].value}
      >
        <SelectTrigger id={field.name} className="w-full flex-2">
          <SelectValue defaultValue={field.state.value} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem key={`${field.name}-${item.value}`} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {field.state.meta.errors.length > 0 && (
        <Paragraph size="small" className="self-end text-red-500">
          {field.state.meta.errors[0].message}
        </Paragraph>
      )}
    </div>
  );
};
