import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Alert, Button, Input } from '../../ui'
import { useSessionStore } from '../../store/session'
import { isEmail, isRequired, minLength } from '../../shared/validation'
import type { RequireAuthState } from '../../app/providers/RequireAuth'
import styles from './Register.module.css'

type Errors = Partial<{ name: string; email: string; password: string; confirmPassword: string }>

function Register() {
  const register = useSessionStore((state) => state.register)
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as RequireAuthState | null)?.from?.pathname ?? '/'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validate(): Errors {
    const nextErrors: Errors = {}
    if (!isRequired(name)) nextErrors.name = 'Укажите имя'
    if (!isRequired(email)) nextErrors.email = 'Укажите email'
    else if (!isEmail(email)) nextErrors.email = 'Некорректный email'
    if (!isRequired(password)) nextErrors.password = 'Укажите пароль'
    else if (!minLength(password, 6)) nextErrors.password = 'Минимум 6 символов'
    if (confirmPassword !== password) nextErrors.confirmPassword = 'Пароли не совпадают'
    return nextErrors
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setServerError(null)

    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    try {
      await register(name, email, password)
      navigate(from, { replace: true })
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Не удалось зарегистрироваться')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <h1 className={styles.heading}>Регистрация</h1>

        {from !== '/' && <p className={styles.hint}>Войдите, чтобы продолжить</p>}

        {serverError && <Alert variant="error">{serverError}</Alert>}

        <Input
          label="Имя"
          required
          value={name}
          onChange={setName}
          placeholder="Ваше имя"
          error={errors.name}
        />
        <Input
          label="Email"
          required
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          error={errors.email}
        />
        <Input
          label="Пароль"
          required
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          error={errors.password}
        />
        <Input
          label="Повторите пароль"
          required
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="••••••••"
          error={errors.confirmPassword}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Регистрируем…' : 'Зарегистрироваться'}
        </Button>

        <p className={styles.switch}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </form>
    </div>
  )
}

export default Register
