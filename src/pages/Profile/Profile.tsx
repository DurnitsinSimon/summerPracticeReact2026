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

  // RequireAuth guarantees a user reaches this page; this only narrows the type.
  if (!user) return null

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
