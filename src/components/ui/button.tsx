import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding whitespace-nowrap transition-all outline-none select-none focus-visible:ring-3 focus-visible:ring-brand-primary/40 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-brand-primary text-text-on-brand hover:bg-primary-600",
        dark: "bg-grey-900 text-text-on-brand shadow-md hover:bg-grey-800",
        outline: "border-border-default bg-surface-default text-text-primary hover:bg-grey-100",
        ghost: "text-text-primary hover:bg-grey-100",
        link: "text-brand-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 gap-2 px-5 text-body-sm-semibold",
        sm: "h-8 gap-2 px-4 text-body-sm-semibold",
        lg: "h-12 gap-2 px-6 text-body-semibold",
        icon: "size-10",
        "icon-sm": "size-8",
      },
      shape: {
        pill: "rounded-4xl",
        /** Figma "Around / Button": 8px corners, used inside panels and forms. */
        rect: "rounded-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "pill",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  shape = "pill",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, shape, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
