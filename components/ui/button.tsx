import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent text-sm font-bold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px disabled:pointer-events-none disabled:opacity-55 aria-invalid:border-destructive aria-invalid:ring-destructive/25 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-[#07534b]",
        destructive:
          "bg-destructive text-white shadow-sm hover:bg-red-700 focus-visible:ring-destructive/30",
        outline:
          "border-border bg-transparent text-foreground hover:border-[#f4c430] hover:bg-white/8",
        secondary:
          "border-border bg-secondary text-secondary-foreground shadow-sm hover:bg-white",
        ghost:
          "text-foreground hover:bg-white/10 hover:text-white",
        link: "text-primary underline-offset-4 hover:underline",
        gold: "bg-[#f4c430] text-[#071512] shadow-sm hover:bg-[#ffda55]",
        live: "bg-[#d71920] text-white shadow-sm hover:bg-[#b91c1c]",
      },
      size: {
        default: "h-11 px-5 py-2.5 has-[>svg]:px-4",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 rounded-md px-3.5 has-[>svg]:px-3",
        lg: "h-12 rounded-md px-6 has-[>svg]:px-5",
        icon: "size-11",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
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
