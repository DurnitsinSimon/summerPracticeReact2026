export type BadgeVariant = 'neutral' | 'negative' | 'positive'

export type BadgeProps = {
  label: string
  variant?: BadgeVariant
  disabled?: boolean
  icon?: React.ReactNode
  onRemove?: () => void
}
