import type { InputProps } from './Input.types'

export default function Input({
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  error,
  label,
}: InputProps) {
  return (
    <div>
      {label && <label>{label}</label>}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
      {error && <span>{error}</span>}
    </div>
  )
}