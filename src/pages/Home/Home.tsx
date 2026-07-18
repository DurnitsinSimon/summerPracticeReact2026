import { useEffect, useMemo, useState } from 'react'
import { listProducts } from '../../api/products'
import type { Product } from '../../mocks/db'
import { Alert, Badge, Button } from '../../ui'
import ProductCard from '../../widgets/ProductCard'
import styles from './Home.module.css'

function scrollToProducts() {
  document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })
}

function Home() {
  const [products, setProducts] = useState<Product[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    listProducts()
      .then((data) => {
        if (!cancelled) setProducts(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Не удалось загрузить товары')
      })

    return () => {
      cancelled = true
    }
  }, [])

  const categories = useMemo(
    () => Array.from(new Set(products?.map((product) => product.category) ?? [])),
    [products],
  )

  const visibleProducts = useMemo(
    () => (selectedCategory ? products?.filter((product) => product.category === selectedCategory) : products),
    [products, selectedCategory],
  )

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Всё для дома, спорта и не только</h1>
        <p className={styles.heroSubtitle}>Подборка популярных товаров по честным ценам</p>
        <Button onClick={scrollToProducts}>Смотреть товары</Button>
      </section>

      <section id="featured" className={styles.section}>
        {categories.length > 0 && (
          <div className={styles.chips}>
            <button type="button" onClick={() => setSelectedCategory(null)} className={styles.chipButton}>
              <Badge label="Все" variant={selectedCategory === null ? 'positive' : 'neutral'} icon={null} />
            </button>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={styles.chipButton}
              >
                <Badge label={category} variant={selectedCategory === category ? 'positive' : 'neutral'} icon={null} />
              </button>
            ))}
          </div>
        )}

        {error && <Alert variant="error">{error}</Alert>}

        {!error && !products && <p className={styles.loading}>Загружаем товары…</p>}

        {visibleProducts && (
          <div className={styles.grid}>
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home
