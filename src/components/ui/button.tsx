import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "bg-[var(--background-secondary)] text-[var(--foreground)] hover:bg-[var(--hover)] border border-[var(--border)] shadow-sm",
        destructive: "bg-[var(--accent-red)] text-white hover:bg-red-600 shadow-sm",
        outline: "border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--hover)] hover:border-[var(--border-hover)]",
        secondary: "bg-[var(--background-secondary)] text-[var(--foreground)] hover:bg-[var(--hover)] border border-[var(--border)]",
        ghost: "text-[var(--foreground-secondary)] hover:bg-[var(--hover)] hover:text-[var(--foreground)]",
        link: "text-[var(--primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm font-medium",
        sm: "h-8 px-3 py-1 text-xs font-medium",
        lg: "h-12 px-6 py-3 text-base font-medium",
        xl: "h-14 px-8 py-4 text-lg font-medium",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
