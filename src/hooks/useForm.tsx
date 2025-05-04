import { RadioGroupField } from "@/components/form/radioGroupField";
import { SelectField } from "@/components/form/selectField";
import { SliderField } from "@/components/form/sliderField";
import { TextField } from "@/components/form/textField";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

export const { fieldContext, formContext, useFieldContext } = createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,

  fieldComponents: { TextField, RadioGroupField, SelectField, SliderField },
  formComponents: {},
});
