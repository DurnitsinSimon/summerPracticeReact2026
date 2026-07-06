export type AlertVariant = 'info' | 'success' | 'warning' | 'error'

export type AlertProps = {
  variant?: AlertVariant
  title?: string
  children: React.ReactNode
  onClose?: () => void
}