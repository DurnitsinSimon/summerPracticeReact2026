import type { BadgeProps } from './Badge.types'
import styles from './Badge.module.css'

const defaultIcon = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
  </svg>
)

export default function Badge({
  label,
  variant = 'neutral',
  disabled = false,
  icon = defaultIcon,
  onRemove,
}: BadgeProps) {
  const className = `${styles.badge} ${styles[variant]} ${disabled ? styles.disabled : ''}`

  return (
    <span className={className}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.label}>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          aria-label="Удалить"
          className={styles.remove}
        >
          ×
        </button>
      )}
    </span>
  )
}
