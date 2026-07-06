import { useState, useRef, useEffect } from 'react'
import type { DropdownProps } from './Dropdown.types'

export default function Dropdown({
  options,
  value,
  placeholder = 'Выберите значение',
  disabled = false,
  onChange,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((option) => option.value === value)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(optionValue: string) {
    onChange?.(optionValue)
    setIsOpen(false)
  }

  return (
    <div ref={rootRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {selectedOption ? selectedOption.label : placeholder}
      </button>
      {isOpen && (
        <ul role="listbox">
          {options.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}