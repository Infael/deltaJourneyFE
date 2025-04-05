import { useFieldContext } from "@/hooks/useForm";
import { FC } from "react";
import { Paragraph } from "../ui/paragraph";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface SelectFieldProps {
  items: {
    label: string;
    value: string;
  }[];
  defaultValue?: string;
}

export const SelectField: FC<SelectFieldProps> = ({ items, defaultValue }) => {
  const field = useFieldContext<string>();

  return (
    <div className="flex flex-col gap-1">
      <Select
        value={field.state.value}
        onValueChange={field.handleChange}
        defaultValue={defaultValue ?? items[0].value}
      >
        <SelectTrigger className="w-[180px]">
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
