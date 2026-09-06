import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg text-[15px] font-medium tracking-[-0.005em] whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-blue-700/40 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary/85 text-primary-foreground outline outline-2 outline-white/10 -outline-offset-2 hover:bg-primary",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline:
          "border border-border bg-white text-foreground hover:border-neutral-400",
        secondary:
          "border border-border bg-white text-foreground hover:border-neutral-400",
        ghost: "hover:bg-neutral-100 hover:text-foreground",
        link: "text-blue-700 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 has-[>svg]:px-5",
        xs: "h-7 gap-1 px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 px-4 text-sm has-[>svg]:px-3",
        lg: "h-12 px-7 has-[>svg]:px-5",
        icon: "size-11",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
