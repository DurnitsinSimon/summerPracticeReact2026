export type InputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: 'text' | 'password' | 'email' | 'number'
  disabled?: boolean
  error?: string
  label?: string
}