import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 disabled:opacity-60 disabled:cursor-not-allowed gap-2',
  {
    variants: {
      variant: {
        primary: 'bg-brand-500 text-white hover:bg-brand-600 shadow-card',
        secondary:
          'bg-white text-slate-900 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm',
        ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
      },
      size: {
        sm: 'h-8 px-3',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-base'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Button({
  className,
  variant,
  size,
  asChild,
  leftIcon,
  rightIcon,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} {...props}>
      {leftIcon ? <span className="text-base">{leftIcon}</span> : null}
      {children}
      {rightIcon ? <span className="text-base">{rightIcon}</span> : null}
    </Comp>
  );
}

export default Button;
