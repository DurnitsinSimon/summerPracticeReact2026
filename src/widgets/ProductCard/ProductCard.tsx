import { Link } from 'react-router-dom'
import type { Product } from '../../mocks/db'
import { Badge } from '../../ui'
import styles from './ProductCard.module.css'

const priceFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

type ProductCardProps = {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/product/${product.id}`} className={styles.link}>
      <div className={styles.card}>
        <div className={styles.thumbnail}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M6 11 16 5l10 6v12l-10 6-10-6z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="M6 11 16 17l10-6M16 17v12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          {product.badge && (
            <span className={styles.badge}>
              <Badge label={product.badge.label} variant={product.badge.variant} icon={null} />
            </span>
          )}
        </div>
        <span className={styles.category}>{product.category}</span>
        <h3 className={styles.title}>{product.title}</h3>
        <span className={styles.price}>{priceFormatter.format(product.price)}</span>
      </div>
    </Link>
  )
}

export default ProductCard
