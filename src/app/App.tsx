import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../widgets/Header'
import { useSessionStore } from '../store/session'

function App() {
  const restore = useSessionStore((state) => state.restore)

  useEffect(() => {
    restore()
  }, [restore])

  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default App
