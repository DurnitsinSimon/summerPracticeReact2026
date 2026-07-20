import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Alert, Button, Input } from '../../ui'
import { useSessionStore } from '../../store/session'
import { isEmail, isRequired } from '../../shared/validation'
import type { RequireAuthState } from '../../app/providers/RequireAuth'
import styles from './Login.module.css'

type Errors = Partial<{ email: string; password: string }>

function Login() {
  const login = useSessionStore((state) => state.login)
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as RequireAuthState | null)?.from?.pathname ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validate(): Errors {
    const nextErrors: Errors = {}
    if (!isRequired(email)) nextErrors.email = 'Укажите email'
    else if (!isEmail(email)) nextErrors.email = 'Некорректный email'
    if (!isRequired(password)) nextErrors.password = 'Укажите пароль'
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
      await login(email, password)
      navigate(from, { replace: true })
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Не удалось войти')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <h1 className={styles.heading}>Вход</h1>

        {from !== '/' && <p className={styles.hint}>Войдите, чтобы продолжить</p>}

        {serverError && <Alert variant="error">{serverError}</Alert>}

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

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Входим…' : 'Войти'}
        </Button>

        <p className={styles.hint}>
          Демо-доступ: admin@shop.dev / admin123
        </p>
        <p className={styles.switch}>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </form>
    </div>
  )
}

export default Login
