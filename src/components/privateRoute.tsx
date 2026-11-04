import { Navigate, Outlet, useLocation } from "react-router"
import useAuth from "../hooks/useAuth"

export default function PrivateRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
