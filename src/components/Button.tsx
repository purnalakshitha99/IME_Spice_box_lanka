import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'ghost' | 'gold' | 'outline'

const variants: Record<Variant, string> = {
  primary:
    'bg-cinnamon text-cream hover:bg-cinnamon-light shadow-sm hover:shadow-md',
  secondary:
    'bg-forest text-cream hover:bg-forest-light shadow-sm',
  gold: 'bg-gold text-cinnamon hover:bg-gold-dark shadow-sm',
  outline:
    'border border-cinnamon/25 bg-transparent text-cinnamon hover:border-cinnamon hover:bg-cinnamon/5',
  ghost: 'bg-transparent text-cinnamon hover:bg-cinnamon/5',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
  to?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'primary',
  children,
  className = '',
  to,
  size = 'md',
  ...props
}: ButtonProps) {
  const sizes = {
    sm: 'px-3.5 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  }
  const cls = `inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`

  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    )
  }

  return (
    <button className={cls} {...props}>
      {children}
    </button>
  )
}
