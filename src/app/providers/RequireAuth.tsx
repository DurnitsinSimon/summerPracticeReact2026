import { Navigate, Outlet, useLocation, type Location } from 'react-router-dom'
import { useSessionStore } from '../../store/session'
import type { Role } from '../../mocks/db'

export type RequireAuthState = {
  from: Location
}

type RequireAuthProps = {
  role?: Role
}

function RequireAuth({ role }: RequireAuthProps) {
  const user = useSessionStore((state) => state.user)
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default RequireAuth
