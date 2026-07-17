import { useState } from 'react'
import styles from './App.module.css'
import { Alert, Badge, Button, Dropdown, Input, Toggle } from './ui'

const sortOptions = [
  { value: 'popular', label: 'По популярности' },
  { value: 'price-asc', label: 'Сначала дешевле' },
  { value: 'price-desc', label: 'Сначала дороже' },
]

function App() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('popular')
  const [inStock, setInStock] = useState(true)
  const [subscribed, setSubscribed] = useState(false)
  const [showInfoAlert, setShowInfoAlert] = useState(true)
  const [showErrorAlert, setShowErrorAlert] = useState(true)

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>UI Kit</h1>

      <section className={styles.section}>
        <h2 className={styles.subheading}>Button</h2>
        <div className={styles.row}>
          <Button size="lg">Button</Button>
          <Button size="md">Button</Button>
          <Button size="sm">Button</Button>
        </div>
        <div className={styles.row}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>Badge</h2>
        <div className={styles.row}>
          <Badge label="Badge label" variant="neutral" onRemove={() => {}} />
          <Badge label="Badge label" variant="negative" onRemove={() => {}} />
          <Badge label="Badge label" variant="positive" onRemove={() => {}} />
          <Badge label="Badge label" disabled onRemove={() => {}} />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>Input</h2>
        <div className={styles.row}>
          <div className={styles.field}>
            <Input
              label="Name of field"
              placeholder="Description of input"
              caption="Caption"
              value={search}
              onChange={setSearch}
            />
          </div>
          <div className={styles.field}>
            <Input
              label="Name of field"
              placeholder="Description of input"
              error="Caption"
              value=""
              onChange={() => {}}
            />
          </div>
          <div className={styles.field}>
            <Input
              label="Name of field"
              placeholder="Description of input"
              caption="Caption"
              value=""
              onChange={() => {}}
              disabled
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>Toggle &amp; Dropdown</h2>
        <div className={styles.row}>
          <Toggle checked={inStock} onChange={setInStock} label="В наличии" />
          <Toggle checked={subscribed} onChange={setSubscribed} label="Подписка" />
          <Toggle checked={false} onChange={() => {}} disabled label="Недоступно" />
          <Dropdown options={sortOptions} value={sort} onChange={setSort} />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>Alert</h2>
        <div className={styles.column}>
          {showInfoAlert && (
            <Alert variant="info" title="Информация" onClose={() => setShowInfoAlert(false)}>
              Заказ передан в обработку.
            </Alert>
          )}
          <Alert variant="success" title="Готово">
            Товар добавлен в корзину.
          </Alert>
          <Alert variant="warning" title="Внимание">
            Осталось всего 2 единицы товара.
          </Alert>
          {showErrorAlert && (
            <Alert variant="error" title="Ошибка" onClose={() => setShowErrorAlert(false)}>
              Не удалось оформить заказ.
            </Alert>
          )}
        </div>
      </section>
    </div>
  )
}

export default App
