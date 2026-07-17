import { useId } from 'react'
import type { InputProps } from './Input.types'
import styles from './Input.module.css'

export default function Input({
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  error,
  caption,
  label,
  required = false,
  leadingIcon,
  trailingIcon,
}: InputProps) {
  const id = useId()
  const fieldClassName = `${styles.field} ${error ? styles.errorField : ''} ${disabled ? styles.disabledField : ''}`

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {!required && <span className={styles.optional}> (Optional)</span>}
        </label>
      )}

      <div className={fieldClassName}>
        {leadingIcon && <span className={styles.icon}>{leadingIcon}</span>}
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className={styles.input}
        />
        {trailingIcon && <span className={styles.icon}>{trailingIcon}</span>}
      </div>

      {(error || caption) && (
        <span className={`${styles.caption} ${error ? styles.errorCaption : ''}`}>
          {error || caption}
        </span>
      )}
    </div>
  )
}
