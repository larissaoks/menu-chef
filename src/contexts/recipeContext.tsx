import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { Recipe, RecipeStorage } from "../types/recipe"
import { RecipeContext } from "./recipeContextValue"

const RECIPE_STORAGE_KEY = "@menu-chef_recipes"

const emptyStorage: RecipeStorage = {
  created: [],
  updated: {},
  deleted: [],
  outOfStock: [],
}

interface RecipeProviderProps {
  children: ReactNode
}

function getStoredRecipes(): RecipeStorage {
  const storedRecipes = localStorage.getItem(RECIPE_STORAGE_KEY)
  if (!storedRecipes) return emptyStorage

  try {
    const parsedRecipes = JSON.parse(storedRecipes) as Partial<RecipeStorage>
    return {
      created: Array.isArray(parsedRecipes.created) ? parsedRecipes.created : [],
      updated: parsedRecipes.updated ?? {},
      deleted: Array.isArray(parsedRecipes.deleted) ? parsedRecipes.deleted : [],
      outOfStock: Array.isArray(parsedRecipes.outOfStock)
        ? parsedRecipes.outOfStock
        : [],
    }
  } catch (error) {
    console.error("Não foi possível ler as receitas salvas.", error)
    localStorage.removeItem(RECIPE_STORAGE_KEY)
    return emptyStorage
  }
}

export default function RecipeProvider({ children }: RecipeProviderProps) {
  const [storage, setStorage] = useState<RecipeStorage>(getStoredRecipes)

  useEffect(() => {
    localStorage.setItem(RECIPE_STORAGE_KEY, JSON.stringify(storage))
  }, [storage])

  function addRecipe(recipe: Recipe) {
    setStorage((current) => ({
      ...current,
      created: [...current.created, recipe],
      deleted: current.deleted.filter((id) => id !== recipe.id),
    }))
  }

  function editRecipe(recipe: Recipe) {
    setStorage((current) => ({
      ...current,
      updated: { ...current.updated, [recipe.id]: recipe },
      created: current.created.map((saved) =>
        saved.id === recipe.id ? recipe : saved,
      ),
    }))
  }

  function removeRecipe(id: number) {
    setStorage((current) => ({
      ...current,
      created: current.created.filter((recipe) => recipe.id !== id),
      updated: Object.fromEntries(
        Object.entries(current.updated).filter(([recipeId]) => Number(recipeId) !== id),
      ),
      deleted: [...new Set([...current.deleted, id])],
      outOfStock: current.outOfStock.filter((recipeId) => recipeId !== id),
    }))
  }

  function toggleStock(id: number) {
    setStorage((current) => ({
      ...current,
      outOfStock: current.outOfStock.includes(id)
        ? current.outOfStock.filter((recipeId) => recipeId !== id)
        : [...current.outOfStock, id],
    }))
  }

  const value = useMemo(
    () => ({ storage, addRecipe, editRecipe, removeRecipe, toggleStock }),
    [storage],
  )

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
}
