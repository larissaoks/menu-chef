import { FiLogOut, FiPlus, FiBookOpen } from "react-icons/fi"
import { Link, NavLink, useNavigate } from "react-router"
import useAuth from "../../hooks/useAuth"

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <header className="topbar">
      <Link to="/" className="brand" aria-label="Menu do Chef - início">
        <span className="brand-mark">✳</span>
        <span>menu do chef</span>
      </Link>

      <nav className="topbar-nav" aria-label="Navegação principal">
        <NavLink to="/" end>
          <FiBookOpen aria-hidden="true" /> Meu cardápio
        </NavLink>
        <NavLink to="/admin/nova">
          <FiPlus aria-hidden="true" /> Nova receita
        </NavLink>
      </nav>

      <div className="user-control">
        <span className="user-email">{user?.email}</span>
        <span className="avatar" aria-hidden="true">
          {user?.firstName.slice(0, 2).toUpperCase()}
        </span>
        <button
          className="logout-button"
          type="button"
          onClick={handleLogout}
          aria-label="Sair da conta"
          title="Sair"
        >
          <FiLogOut />
        </button>
      </div>
    </header>
  )
}
