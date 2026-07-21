import { useEffect, useState, type FormEvent } from 'react'
import { createProduct, deleteProduct, listProducts } from '../../api/products'
import type { Product } from '../../mocks/db'
import { useSessionStore } from '../../store/session'
import { isPositiveNumber, isRequired } from '../../shared/validation'
import { Alert, Badge, Button, Input } from '../../ui'
import styles from './Admin.module.css'

const priceFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

type FormErrors = Partial<{ title: string; price: string; category: string; description: string }>

function Admin() {
  const token = useSessionStore((state) => state.token)

  const [products, setProducts] = useState<Product[] | null>(null)
  const [listError, setListError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false

    listProducts()
      .then((data) => {
        if (!cancelled) setProducts(data)
      })
      .catch((err) => {
        if (!cancelled) setListError(err instanceof Error ? err.message : 'Не удалось загрузить товары')
      })

    return () => {
      cancelled = true
    }
  }, [])

  function validate(): FormErrors {
    const nextErrors: FormErrors = {}
    if (!isRequired(title)) nextErrors.title = 'Укажите название'
    if (!isPositiveNumber(price)) nextErrors.price = 'Укажите цену больше 0'
    if (!isRequired(category)) nextErrors.category = 'Укажите категорию'
    if (!isRequired(description)) nextErrors.description = 'Укажите описание'
    return nextErrors
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setActionError(null)

    const nextErrors = validate()
    setFormErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0 || !token) return

    setIsSubmitting(true)
    try {
      const product = await createProduct(token, {
        title,
        price: Number(price),
        category,
        description,
      })
      setProducts((prev) => (prev ? [...prev, product] : [product]))
      setTitle('')
      setPrice('')
      setCategory('')
      setDescription('')
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Не удалось добавить товар')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    if (!token) return
    setActionError(null)

    try {
      await deleteProduct(token, id)
      setProducts((prev) => prev?.filter((product) => product.id !== id) ?? null)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Не удалось удалить товар')
    }
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Управление товарами</h1>

      {actionError && <Alert variant="error">{actionError}</Alert>}

      {listError && <Alert variant="error">{listError}</Alert>}

      {!listError && !products && <p className={styles.loading}>Загружаем товары…</p>}

      {products && (
        <div className={styles.list}>
          {products.map((product) => (
            <div key={product.id} className={styles.row}>
              <div className={styles.info}>
                <span className={styles.category}>{product.category}</span>
                <span className={styles.title}>{product.title}</span>
              </div>
              {product.badge && <Badge label={product.badge.label} variant={product.badge.variant} icon={null} />}
              <span className={styles.price}>{priceFormatter.format(product.price)}</span>
              <Button variant="secondary" size="sm" onClick={() => handleDelete(product.id)}>
                Удалить
              </Button>
            </div>
          ))}
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <h2 className={styles.formHeading}>Добавить товар</h2>

        <div className={styles.formRow}>
          <Input label="Название" required value={title} onChange={setTitle} error={formErrors.title} />
          <Input label="Цена" required value={price} onChange={setPrice} error={formErrors.price} />
        </div>
        <div className={styles.formRow}>
          <Input label="Категория" required value={category} onChange={setCategory} error={formErrors.category} />
        </div>
        <Input
          label="Описание"
          required
          value={description}
          onChange={setDescription}
          error={formErrors.description}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Добавляем…' : 'Добавить товар'}
        </Button>
      </form>
    </div>
  )
}

export default Admin
