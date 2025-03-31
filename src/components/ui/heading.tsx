import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const HeadingVariants = cva("", {
  variants: {
    level: {
      h1: "text-4xl leading-11 font-extrabold",
      h2: "text-3xl leading-9 font-extrabold",
      h3: "text-2xl leading-8 font-extrabold",
      h4: "text-xl leading-7 font-extrabold",
      h5: "text-lg leading-7 font-extrabold",
    },
  },
  defaultVariants: {
    level: "h1",
  },
});

function Heading({
  className,
  level,
  ...props
}: React.ComponentProps<"h1"> & {
  asChild?: boolean;
} & VariantProps<typeof HeadingVariants>) {
  const Tag = level ?? "h1";
  return <Tag className={cn(HeadingVariants({ level, className }))} {...props} />;
}

export { Heading, HeadingVariants };
