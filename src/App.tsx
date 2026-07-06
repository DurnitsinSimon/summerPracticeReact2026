import './App.css'
import styles from './App.module.css'
import Button from './UI/Button'

function App() {

  return (
    <>
       <div className={styles.page}>
      <h1 className={styles.heading}>Button</h1>

      <section className={styles.section}>
        <h2 className={styles.subheading}>Размеры</h2>
        <div className={styles.row}>
          <Button size="lg">Button</Button>
          <Button size="md">Button</Button>
          <Button size="sm">Button</Button>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>Состояния</h2>
        <div className={styles.row}>
          <Button size="md">Normal</Button>
          <Button size="md" disabled>Disabled</Button>
        </div>
        <p className={styles.hint}>
          Hover, focus и active проверяются наведением мыши и клавишей Tab.
        </p>
      </section>
    </div>
    </>
  )
}

export default App
