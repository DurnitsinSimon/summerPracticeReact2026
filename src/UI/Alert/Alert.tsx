import type { AlertProps } from './Alert.types'

export default function Alert({
  title,
  children,
  onClose,
}: AlertProps) {
  return (
    <div role="alert">
      {title && <strong>{title}</strong>}
      <div>{children}</div>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Закрыть">
          ×
        </button>
      )}
    </div>
  )
}