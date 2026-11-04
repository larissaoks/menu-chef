export type RecipeCategory = "Entradas" | "Principais" | "Sobremesas"
export type RecipeDifficulty = "Easy" | "Medium" | "Hard"

export interface Recipe {
  id: number
  apiId?: number
  name: string
  ingredients: string[]
  instructions: string[]
  prepTimeMinutes: number
  cookTimeMinutes: number
  servings: number
  difficulty: RecipeDifficulty
  cuisine: string
  caloriesPerServing: number
  tags: string[]
  userId: number
  image: string
  rating: number
  reviewCount: number
  mealType: string[]
  category?: RecipeCategory
}

export type RecipeInput = Omit<
  Recipe,
  "id" | "apiId" | "rating" | "reviewCount" | "userId"
>

export interface RecipeListResponse {
  recipes: Recipe[]
  total: number
  skip: number
  limit: number
}

export interface RecipeStorage {
  created: Recipe[]
  updated: Record<number, Recipe>
  deleted: number[]
  outOfStock: number[]
}

export const recipeCategories: RecipeCategory[] = [
  "Entradas",
  "Principais",
  "Sobremesas",
]

export function getRecipeCategory(recipe: Recipe): RecipeCategory {
  if (recipe.category) return recipe.category

  const searchText = [...recipe.tags, ...recipe.mealType, recipe.name]
    .join(" ")
    .toLowerCase()

  if (/dessert|sweet|cake|cookie|pudding|ice cream|sobremesa/.test(searchText)) {
    return "Sobremesas"
  }

  if (/appetizer|starter|salad|soup|snack|entrada/.test(searchText)) {
    return "Entradas"
  }

  return "Principais"
}

export function getDifficultyLabel(difficulty: RecipeDifficulty): string {
  const labels: Record<RecipeDifficulty, string> = {
    Easy: "Fácil",
    Medium: "Médio",
    Hard: "Difícil",
  }

  return labels[difficulty]
}

export function getRecipeDescription(recipe: Recipe): string {
  return recipe.ingredients.slice(0, 4).join(", ")
}
