import { useState, type FormEvent } from "react"
import { useMutation } from "@tanstack/react-query"
import { FiArrowRight } from "react-icons/fi"
import { Link, Navigate, useLocation, useNavigate } from "react-router"
import useAuth from "../../hooks/useAuth"

interface LoginLocationState {
  from?: {
    pathname?: string
  }
}

export default function Login() {
  const { isAuthenticated, login } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const destination =
    (location.state as LoginLocationState | null)?.from?.pathname ?? "/"
  const loginMutation = useMutation({
    mutationFn: () => login(username.trim(), password),
    onSuccess: () => navigate(destination, { replace: true }),
  })

  if (isAuthenticated) return <Navigate to="/" replace />

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    loginMutation.mutate()
  }

  return (
    <main className="login-page">
      <section className="login-visual">
        <Link to="/login" className="brand">
          <span className="brand-mark">✳</span>
          <span>menu do chef</span>
        </Link>
        <div className="login-visual-copy">
          <p className="eyebrow">Seu negócio, bem servido</p>
          <h2>Um cardápio especial começa com boas ideias.</h2>
          <p>
            Organize seus pratos, acompanhe o que está disponível e deixe a
            rotina da cozinha mais leve.
          </p>
        </div>
        <span className="login-visual-caption">
          O seu espaço para criar, organizar e servir.
        </span>
      </section>

      <section className="login-side">
        <div className="login-card">
          <Link to="/login" className="brand">
            <span className="brand-mark">✳</span>
            <span>menu do chef</span>
          </Link>
          <p className="eyebrow">Bem-vindo de volta</p>
          <h1>Acesse sua cozinha</h1>
          <p>Entre para cuidar do seu cardápio e das receitas da casa.</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="username">Usuário</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="Seu nome de usuário"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value)
                  loginMutation.reset()
                }}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Sua senha"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  loginMutation.reset()
                }}
                required
              />
            </div>
            {loginMutation.isError && (
              <p role="alert" className="login-error">
                Usuário ou senha inválidos. Confira seus dados e tente
                novamente.
              </p>
            )}
            <button
              type="submit"
              className="button-primary"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Validando acesso..." : "Entrar no painel"}
              {!loginMutation.isPending && <FiArrowRight />}
            </button>
          </form>

          <div className="login-note">
            <strong>Acesso para teste:</strong> usuário{" "}
            <code>emilys</code> e senha <code>emilyspass</code>. A autenticação
            é validada pela DummyJSON.
          </div>
        </div>
      </section>
    </main>
  )
}
