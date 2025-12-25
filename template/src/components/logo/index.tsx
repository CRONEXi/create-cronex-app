import { cn } from '@/utilities/ui'

export const Logo = ({ className }: { className?: string }) => {
  return <p className={cn('text-2xl font-bold', className)}>CRONEX</p>
}
