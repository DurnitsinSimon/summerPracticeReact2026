import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProduct } from '../../api/products'
import type { Product as ProductType } from '../../mocks/db'
import { Alert, Badge } from '../../ui'
import styles from './Product.module.css'

const priceFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

function Product() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<ProductType | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    getProduct(id)
      .then((data) => {
        if (!cancelled) setProduct(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Не удалось загрузить товар')
      })

    return () => {
      cancelled = true
    }
  }, [id])

  if (error) {
    return (
      <div className={styles.page}>
        <Alert variant="error">{error}</Alert>
        <Link to="/" className={styles.back}>
          Назад к товарам
        </Link>
      </div>
    )
  }

  if (!product) {
    return (
      <div className={styles.page}>
        <p className={styles.loading}>Загружаем товар…</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.back}>
        Назад к товарам
      </Link>

      <div className={styles.layout}>
        <div className={styles.thumbnail}>
          <svg width="64" height="64" viewBox="0 0 32 32" fill="none">
            <path
              d="M6 11 16 5l10 6v12l-10 6-10-6z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="M6 11 16 17l10-6M16 17v12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </div>

        <div className={styles.details}>
          <span className={styles.category}>{product.category}</span>
          <h1 className={styles.title}>{product.title}</h1>
          {product.badge && <Badge label={product.badge.label} variant={product.badge.variant} icon={null} />}
          <span className={styles.price}>{priceFormatter.format(product.price)}</span>
          <p className={styles.description}>{product.description}</p>
        </div>
      </div>
    </div>
  )
}

export default Product
