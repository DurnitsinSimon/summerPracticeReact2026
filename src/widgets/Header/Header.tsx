import { Link } from 'react-router-dom'
import { Badge, Button } from '../../ui'
import { useSessionStore } from '../../store/session'
import styles from './Header.module.css'

const roleLabel = {
  admin: 'Администратор',
  user: 'Покупатель',
} as const

function Header() {
  const user = useSessionStore((state) => state.user)
  const logout = useSessionStore((state) => state.logout)

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        Shop
      </Link>

      <nav className={styles.nav}>
        {user ? (
          <>
            <Link to="/profile" className={styles.profileLink}>
              {user.name}
            </Link>
            <Badge label={roleLabel[user.role]} variant={user.role === 'admin' ? 'positive' : 'neutral'} />
            <Button variant="ghost" size="sm" onClick={logout}>
              Выйти
            </Button>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.link}>
              Войти
            </Link>
            <Link to="/register">
              <Button variant="secondary" size="sm">
                Регистрация
              </Button>
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}

export default Header
