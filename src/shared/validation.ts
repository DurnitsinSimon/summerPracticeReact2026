const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isRequired(value: string): boolean {
  return value.trim().length > 0
}

export function isEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim())
}

export function minLength(value: string, length: number): boolean {
  return value.trim().length >= length
}
