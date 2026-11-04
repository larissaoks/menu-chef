import {
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { AuthContext } from "./authContextValue"
import type { AuthUser } from "../types/auth"
import { loginUser } from "../services/api"

const AUTH_STORAGE_KEY = "@menu-chef_user"

interface AuthProviderProps {
  children: ReactNode
}

function getStoredUser(): AuthUser | null {
  const storedUser = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!storedUser) return null

  try {
    const user: unknown = JSON.parse(storedUser)
    if (
      typeof user === "object" &&
      user !== null &&
      "id" in user &&
      typeof user.id === "number" &&
      "username" in user &&
      typeof user.username === "string" &&
      "email" in user &&
      typeof user.email === "string" &&
      "firstName" in user &&
      typeof user.firstName === "string" &&
      "lastName" in user &&
      typeof user.lastName === "string" &&
      "image" in user &&
      typeof user.image === "string" &&
      "accessToken" in user &&
      typeof user.accessToken === "string" &&
      "refreshToken" in user &&
      typeof user.refreshToken === "string"
    ) {
      return user as AuthUser
    }

    localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  } catch (error) {
    console.error("Não foi possível ler os dados de login salvos.", error)
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser)

  async function login(username: string, password: string) {
    const authenticatedUser = await loginUser({ username, password })
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authenticatedUser))
    setUser(authenticatedUser)
  }

  function logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, isAuthenticated: user !== null, login, logout }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
