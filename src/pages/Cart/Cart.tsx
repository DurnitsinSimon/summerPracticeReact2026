import { Link } from 'react-router-dom'
import { useCartStore } from '../../store/cart'
import { useSessionStore } from '../../store/session'
import { Alert, Button } from '../../ui'
import styles from './Cart.module.css'

const priceFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

function Cart() {
  const user = useSessionStore((state) => state.user)
  const items = useCartStore((state) => state.items)
  const setQuantity = useCartStore((state) => state.setQuantity)
  const removeItem = useCartStore((state) => state.removeItem)

  if (!user) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <h1 className={styles.heading}>Корзина доступна только авторизованным пользователям</h1>
          <p className={styles.text}>Войдите или зарегистрируйтесь, чтобы добавлять товары в корзину.</p>
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

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <Alert variant="info">Корзина пуста</Alert>
        <Link to="/" className={styles.back}>
          Перейти к товарам
        </Link>
      </div>
    )
  }

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Корзина</h1>

      <div className={styles.list}>
        {items.map((item) => (
          <div key={item.product.id} className={styles.row}>
            <div className={styles.info}>
              <span className={styles.category}>{item.product.category}</span>
              <span className={styles.title}>{item.product.title}</span>
              <span className={styles.unitPrice}>{priceFormatter.format(item.product.price)}</span>
            </div>

            <div className={styles.quantity}>
              <button
                type="button"
                onClick={() => setQuantity(item.product.id, item.quantity - 1)}
                className={styles.stepButton}
                aria-label="Уменьшить количество"
              >
                −
              </button>
              <span className={styles.quantityValue}>{item.quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(item.product.id, item.quantity + 1)}
                className={styles.stepButton}
                aria-label="Увеличить количество"
              >
                +
              </button>
            </div>

            <span className={styles.lineTotal}>{priceFormatter.format(item.product.price * item.quantity)}</span>

            <button
              type="button"
              onClick={() => removeItem(item.product.id)}
              className={styles.remove}
              aria-label="Удалить из корзины"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className={styles.summary}>
        <span>Итого</span>
        <span className={styles.total}>{priceFormatter.format(total)}</span>
      </div>
    </div>
  )
}

export default Cart
