import axios from "axios"
import type {
  Recipe,
  RecipeInput,
  RecipeListResponse,
} from "../types/recipe"
import type { AuthUser, LoginCredentials } from "../types/auth"

export const api = axios.create({
  baseURL: "https://dummyjson.com",
})

export async function loginUser(
  credentials: LoginCredentials,
): Promise<AuthUser> {
  const response = await api.post<AuthUser>("/user/login", {
    ...credentials,
    expiresInMins: 60,
  })

  return response.data
}

export async function getRecipes(signal?: AbortSignal): Promise<Recipe[]> {
  const response = await api.get<RecipeListResponse>("/recipes?limit=100", {
    signal,
  })

  return response.data.recipes
}

export async function getRecipe(
  id: number,
  signal?: AbortSignal,
): Promise<Recipe> {
  const response = await api.get<Recipe>(`/recipes/${id}`, { signal })
  return response.data
}

export async function createRecipe(recipe: RecipeInput): Promise<Recipe> {
  const response = await api.post<Recipe>("/recipes/add", {
    ...recipe,
    userId: 1,
  })
  return response.data
}

export async function updateRecipe(
  id: number,
  recipe: RecipeInput,
): Promise<Recipe> {
  const response = await api.put<Recipe>(`/recipes/${id}`, recipe)
  return response.data
}

export async function updateRecipeAvailability(
  id: number,
  inStock: boolean,
): Promise<void> {
  await api.patch(`/recipes/${id}`, { inStock })
}

export async function deleteRecipe(id: number): Promise<void> {
  await api.delete(`/recipes/${id}`)
}
