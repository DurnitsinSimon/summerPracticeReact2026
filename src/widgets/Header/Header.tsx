import { Link, useNavigate } from 'react-router-dom'
import { Badge, Button } from '../../ui'
import { useCartStore } from '../../store/cart'
import { useSessionStore } from '../../store/session'
import styles from './Header.module.css'

const roleLabel = {
  admin: 'Администратор',
  user: 'Покупатель',
} as const

function Header() {
  const user = useSessionStore((state) => state.user)
  const logout = useSessionStore((state) => state.logout)
  const cartCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0))
  const navigate = useNavigate()

  return (
    <header className={styles.header}>
      <div className={styles.leftGroup}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={styles.navButton}
          aria-label="Назад"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4 6 9l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => navigate(1)}
          className={styles.navButton}
          aria-label="Вперёд"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <Link to="/" className={styles.logo}>
          Shop
        </Link>
      </div>

      <nav className={styles.nav}>
        {user ? (
          <>
            <Link to="/cart" className={styles.cartLink}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M3 5h2l1.5 9h9L17 7H6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="8.5" cy="16.5" r="1" fill="currentColor" />
                <circle cx="14.5" cy="16.5" r="1" fill="currentColor" />
              </svg>
              {cartCount > 0 && <span className={styles.cartCount}>{cartCount}</span>}
            </Link>
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
