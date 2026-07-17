import { Link } from 'react-router-dom'
import { Badge, Button } from '../../ui'
import { useSessionStore } from '../../store/session'
import styles from './Profile.module.css'

const roleLabel = {
  admin: 'Администратор',
  user: 'Покупатель',
} as const

function Profile() {
  const user = useSessionStore((state) => state.user)
  const logout = useSessionStore((state) => state.logout)

  if (!user) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <h1 className={styles.heading}>Вы не авторизованы</h1>
          <p className={styles.text}>Войдите или зарегистрируйтесь, чтобы увидеть профиль.</p>
          <div className={styles.actions}>
            <Link to="/login">
              <Button>Войти</Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary">Регистрация</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.heading}>{user.name}</h1>
        <p className={styles.text}>{user.email}</p>
        <Badge label={roleLabel[user.role]} variant={user.role === 'admin' ? 'positive' : 'neutral'} />
        <div className={styles.actions}>
          <Button variant="secondary" onClick={logout}>
            Выйти
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Profile
