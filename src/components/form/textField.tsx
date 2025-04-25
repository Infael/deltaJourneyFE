import { useFieldContext } from "@/hooks/useForm";
import { cn } from "@/lib/utils";
import { FC } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Paragraph } from "../ui/paragraph";

interface TextFieldProps {
  label?: string;
  placeholder?: string;
}

export const TextField: FC<TextFieldProps> = ({ label, placeholder }) => {
  const field = useFieldContext<string>();

  return (
    <div className="flex flex-1 flex-col gap-1">
      <div className="flex items-center gap-2">
        {label && (
          <Label htmlFor={field.name} className="flex-1">
            {label}
          </Label>
        )}
        <Input
          id={field.name}
          value={field.state.value}
          onChange={(e) => {
            field.handleChange(e.target.value);
          }}
          className={cn(field.state.meta.errors.length > 0 ? "border-red-500" : "", "flex-2")}
          placeholder={placeholder}
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
