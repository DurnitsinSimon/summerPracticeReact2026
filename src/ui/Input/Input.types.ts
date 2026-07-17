export type InputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: 'text' | 'password' | 'email' | 'number'
  disabled?: boolean
  error?: string
  caption?: string
  label?: string
  required?: boolean
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
}
