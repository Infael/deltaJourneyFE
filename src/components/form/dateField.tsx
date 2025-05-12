import { useFieldContext } from "@/hooks/useForm";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC } from "react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Label } from "../ui/label";
import { Paragraph } from "../ui/paragraph";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface DateFieldProps {
  label?: string;
}

export const DateField: FC<DateFieldProps> = ({ label }) => {
  const field = useFieldContext<Date>();

  console.log(field.state.meta.errors);

  return (
    <div className="flex flex-1 flex-col gap-1">
      <div className="flex items-center gap-2">
        {label && (
          <Label htmlFor={field.name} className="flex-1">
            {label}
          </Label>
        )}
        <Popover>
          <PopoverTrigger asChild id={field.name}>
            <Button variant="noShadow" className="font-base flex-2 justify-start text-left">
              <CalendarIcon />
              {field.state.value ? format(field.state.value, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="z-50 w-auto border-0! p-0">
            <Calendar
              mode="single"
              selected={field.state.value}
              onSelect={(value) => {
                if (!value) return;
                field.handleChange(value);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      {field.state.meta.errors.length > 0 && (
        <Paragraph size="small" className="self-end text-red-500">
          {field.state.meta.errors[0].message}
        </Paragraph>
      )}
    </div>
  );
};
