import { useContext } from "react"
import { RecipeContext } from "../contexts/recipeContextValue"

export default function useRecipeStore() {
  const context = useContext(RecipeContext)
  if (!context) {
    throw new Error("useRecipeStore precisa ser usado dentro de RecipeProvider.")
  }
  return context
}
