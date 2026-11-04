import type { ReactNode } from "react"
import Header from "../../components/header"

interface ContainerProps {
  children: ReactNode
  narrow?: boolean
}

export default function Container({ children, narrow = false }: ContainerProps) {
  return (
    <div className="app-shell">
      <Header />
      <main className={narrow ? "page-narrow" : "page-content"}>{children}</main>
    </div>
  )
}
