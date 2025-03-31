import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const ParagraphVariants = cva("", {
  variants: {
    variant: {
      default: "",
      faded: "text-gray-500",
    },
    size: {
      default: "text-base leading-6",
      small: "text-sm leading-5",
      micro: "text-xs leading-7",
      large: "text-lg leading-7",
      extraLarge: "text-xl leading-7",
      xxl: "text-2xl leading-8",
    },
    weight: {
      default: "font-normal",
      bold: "font-bold",
      extrabold: "font-extrabold",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
    weight: "default",
  },
});

function Paragraph({
  className,
  variant,
  size,
  weight,
  ...props
}: React.ComponentProps<"p"> & {
  asChild?: boolean;
} & VariantProps<typeof ParagraphVariants>) {
  return <p className={cn(ParagraphVariants({ variant, size, weight, className }))} {...props} />;
}

export { Paragraph, ParagraphVariants };
