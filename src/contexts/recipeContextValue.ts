import { createContext } from "react"
import type { Recipe, RecipeStorage } from "../types/recipe"

export interface RecipeContextValue {
  storage: RecipeStorage
  addRecipe: (recipe: Recipe) => void
  editRecipe: (recipe: Recipe) => void
  removeRecipe: (id: number) => void
  toggleStock: (id: number) => void
}

export const RecipeContext = createContext<RecipeContextValue | null>(null)
