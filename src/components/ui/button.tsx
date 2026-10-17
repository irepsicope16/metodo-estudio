import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-[14.5px] font-semibold transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer active:scale-[0.97]',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-[0_6px_16px_-6px_var(--color-primary)] hover:bg-primary-strong hover:shadow-[0_8px_18px_-5px_var(--color-primary)]',
        accent: 'bg-accent text-accent-foreground shadow-[0_6px_16px_-6px_var(--color-accent)] hover:bg-accent-strong hover:shadow-[0_8px_18px_-5px_var(--color-accent)]',
        secondary: 'bg-secondary text-secondary-foreground shadow-[0_6px_16px_-6px_var(--color-secondary)] hover:bg-secondary-strong',
        outline: 'border-[1.5px] bg-surface hover:bg-surface-2 text-foreground',
        ghost: 'hover:bg-surface-2 text-foreground',
        soft: 'bg-primary-soft text-primary-strong hover:bg-primary-soft/70',
        danger: 'bg-danger text-white hover:opacity-90',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-8 px-3 text-[13.5px]',
        lg: 'h-11 px-6 text-[15.5px]',
        icon: 'h-10 w-10',
        iconSm: 'h-8 w-8',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  },
)
Button.displayName = 'Button'
