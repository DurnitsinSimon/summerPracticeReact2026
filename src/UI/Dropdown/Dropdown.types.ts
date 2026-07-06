export type DropdownOption = {
  value: string
  label: string
}

export type DropdownProps = {
  options: DropdownOption[]
  value?: string
  placeholder?: string
  disabled?: boolean
  onChange?: (value: string) => void
}