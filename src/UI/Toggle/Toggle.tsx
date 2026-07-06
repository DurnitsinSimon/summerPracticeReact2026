import type { ToggleProps } from './Toggle.types'

export default function Toggle({
  checked,
  onChange,
  disabled = false,
  label,
}: ToggleProps) {
  return (
    <label>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      {label && <span>{label}</span>}
    </label>
  )
}