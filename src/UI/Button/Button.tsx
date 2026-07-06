import type { ButtonProps } from './Button.types'
import styles from './Button.module.css'

export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  onClick,
  type = 'button',
}: ButtonProps) {
  const className = `${styles.button} ${styles[size]}`

  return (
    <button type={type} className={className} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}