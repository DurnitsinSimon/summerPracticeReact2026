import { useEffect, useMemo, useState } from 'react'
import { listProducts } from '../../api/products'
import type { Product } from '../../mocks/db'
import { Alert, Badge, Button, Dropdown, Input, Toggle, type DropdownOption } from '../../ui'
import ProductCard from '../../widgets/ProductCard'
import styles from './Home.module.css'

type SortOption = 'popular' | 'price-asc' | 'price-desc'

const sortOptions: DropdownOption[] = [
  { value: 'popular', label: 'По популярности' },
  { value: 'price-asc', label: 'Сначала дешевле' },
  { value: 'price-desc', label: 'Сначала дороже' },
]

function Home() {
  const [products, setProducts] = useState<Product[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('popular')
  const [onlyBadged, setOnlyBadged] = useState(false)
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')

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

  const visibleProducts = useMemo(() => {
    if (!products) return null

    const query = search.trim().toLowerCase()
    const min = priceMin.trim() ? Number(priceMin) : null
    const max = priceMax.trim() ? Number(priceMax) : null

    const filtered = products.filter((product) => {
      if (selectedCategory && product.category !== selectedCategory) return false
      if (query && !product.title.toLowerCase().includes(query)) return false
      if (onlyBadged && !product.badge) return false
      if (min !== null && Number.isFinite(min) && product.price < min) return false
      if (max !== null && Number.isFinite(max) && product.price > max) return false
      return true
    })

    if (sort === 'price-asc') return [...filtered].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') return [...filtered].sort((a, b) => b.price - a.price)
    return filtered
  }, [products, selectedCategory, search, onlyBadged, priceMin, priceMax, sort])

  const isFiltered =
    search.trim() !== '' ||
    selectedCategory !== null ||
    onlyBadged ||
    priceMin.trim() !== '' ||
    priceMax.trim() !== '' ||
    sort !== 'popular'

  function resetFilters() {
    setSearch('')
    setSelectedCategory(null)
    setOnlyBadged(false)
    setPriceMin('')
    setPriceMax('')
    setSort('popular')
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Всё для дома, спорта и не только</h1>
        <p className={styles.heroSubtitle}>Подборка популярных товаров по честным ценам</p>
      </section>

      <section className={styles.section}>
        {products && (
          <div className={styles.filters}>
            <div className={styles.filterRow}>
              <div className={styles.searchField}>
                <Input label="Поиск" required value={search} onChange={setSearch} placeholder="Название товара" />
              </div>
              <Dropdown
                options={sortOptions}
                value={sort}
                onChange={(value) => setSort(value as SortOption)}
              />
            </div>

            <div className={styles.filterRow}>
              <div className={styles.priceField}>
                <Input label="Цена от" required type="number" value={priceMin} onChange={setPriceMin} placeholder="0" />
              </div>
              <div className={styles.priceField}>
                <Input
                  label="Цена до"
                  required
                  type="number"
                  value={priceMax}
                  onChange={setPriceMax}
                  placeholder="20000"
                />
              </div>
              <Toggle checked={onlyBadged} onChange={setOnlyBadged} label="Только со скидкой или новинки" />
              {isFiltered && (
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  Сбросить фильтры
                </Button>
              )}
            </div>

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
                    <Badge
                      label={category}
                      variant={selectedCategory === category ? 'positive' : 'neutral'}
                      icon={null}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {error && <Alert variant="error">{error}</Alert>}

        {!error && !products && <p className={styles.loading}>Загружаем товары…</p>}

        {visibleProducts && (
          <>
            <p className={styles.resultsCount}>
              Показано {visibleProducts.length} из {products?.length ?? 0}
            </p>

            {visibleProducts.length > 0 ? (
              <div className={styles.grid}>
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <Alert variant="info">Ничего не найдено — попробуйте изменить фильтры</Alert>
            )}
          </>
        )}
      </section>
    </div>
  )
}

export default Home
