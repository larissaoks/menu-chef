import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Navigate, Route, Routes } from "react-router"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import PrivateRoute from "./components/privateRoute"
import AuthProvider from "./contexts/authContext"
import RecipeProvider from "./contexts/recipeContext"
import RecipeCreate from "./pages/create"
import RecipeDetail from "./pages/detail"
import Home from "./pages/home"
import Login from "./pages/login"
import "./App.css"

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RecipeProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/receita/:id" element={<RecipeDetail />} />
                <Route path="/admin/nova" element={<RecipeCreate />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
          <ToastContainer position="bottom-right" autoClose={3000} />
        </RecipeProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
