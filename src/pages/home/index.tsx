import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { FiBookOpen, FiCheckCircle, FiPlus, FiSearch, FiUsers } from "react-icons/fi"
import { Link } from "react-router"
import RecipeCard from "../../components/recipeCard"
import Container from "../../templates/container"
import useRecipeStore from "../../hooks/useRecipeStore"
import { getRecipes } from "../../services/api"
import {
  getRecipeCategory,
  recipeCategories,
  type RecipeCategory,
  type RecipeDifficulty,
} from "../../types/recipe"

type CategoryFilter = "Todos" | RecipeCategory
type DifficultyFilter = "Todas" | RecipeDifficulty

const categories: CategoryFilter[] = ["Todos", ...recipeCategories]

export default function Home() {
  const { storage } = useRecipeStore()
  const [category, setCategory] = useState<CategoryFilter>("Todos")
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("Todas")
  const [search, setSearch] = useState("")

  const query = useQuery({
    queryKey: ["recipes"],
    queryFn: ({ signal }) => getRecipes(signal),
    retry: 1,
  })

  const recipes = useMemo(() => {
    const remoteRecipes = (query.data ?? [])
      .filter((recipe) => !storage.deleted.includes(recipe.id))
      .map((recipe) => storage.updated[recipe.id] ?? recipe)
    const remoteIds = new Set(remoteRecipes.map((recipe) => recipe.id))
    const localRecipes = storage.created.filter(
      (recipe) =>
        !storage.deleted.includes(recipe.id) && !remoteIds.has(recipe.id),
    )

    return [...localRecipes, ...remoteRecipes]
  }, [query.data, storage])

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesCategory =
      category === "Todos" || getRecipeCategory(recipe) === category
    const matchesDifficulty =
      difficulty === "Todas" || recipe.difficulty === difficulty
    const searchText = `${recipe.name} ${recipe.ingredients.join(" ")}`.toLowerCase()
    const matchesSearch = searchText.includes(search.trim().toLowerCase())

    return matchesCategory && matchesDifficulty && matchesSearch
  })

  const availableCount = recipes.filter(
    (recipe) => !storage.outOfStock.includes(recipe.id),
  ).length

  return (
    <Container>
      <section className="page-heading">
        <div>
          <p className="eyebrow">Sua cozinha em um só lugar</p>
          <h1>Meu cardápio</h1>
          <p>Organize suas receitas e mantenha seu menu sempre atualizado.</p>
        </div>
        <Link to="/admin/nova" className="button-primary">
          <FiPlus /> Adicionar prato
        </Link>
      </section>

      <section className="stats-grid" aria-label="Resumo do cardápio">
        <div className="stat-card">
          <span className="stat-icon"><FiBookOpen /></span>
          <div>
            <strong>{recipes.length}</strong>
            <span>Pratos no cardápio</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon"><FiCheckCircle /></span>
          <div>
            <strong>{availableCount}</strong>
            <span>Disponíveis hoje</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon"><FiUsers /></span>
          <div>
            <strong>{recipeCategories.length}</strong>
            <span>Categorias organizadas</span>
          </div>
        </div>
      </section>

      <section aria-label="Lista de receitas">
        <div className="recipe-toolbar">
          <div className="category-tabs" role="tablist" aria-label="Categorias">
            {categories.map((item) => (
              <button
                className={`category-tab${category === item ? " selected" : ""}`}
                key={item}
                type="button"
                role="tab"
                aria-selected={category === item}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <label className="search-control">
            <FiSearch aria-hidden="true" />
            <input
              type="search"
              placeholder="Buscar receita ou ingrediente..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Buscar receitas"
            />
          </label>
        </div>

        <div className="filter-line">
          <label>
            <span className="sr-only">Filtrar por dificuldade</span>
            <select
              value={difficulty}
              onChange={(event) =>
                setDifficulty(event.target.value as DifficultyFilter)
              }
              aria-label="Filtrar por dificuldade"
            >
              <option value="Todas">Todas as dificuldades</option>
              <option value="Easy">Fácil</option>
              <option value="Medium">Médio</option>
              <option value="Hard">Difícil</option>
            </select>
          </label>
        </div>

        {query.isLoading && (
          <div className="status-message" role="status">
            Carregando as receitas do cardápio...
          </div>
        )}

        {query.isError && (
          <div className="status-message" role="alert">
            Não foi possível carregar as receitas. Verifique sua conexão e tente
            novamente.
            <button
              className="text-link"
              type="button"
              onClick={() => void query.refetch()}
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!query.isLoading && !query.isError && filteredRecipes.length > 0 && (
          <div className="recipe-grid">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                outOfStock={storage.outOfStock.includes(recipe.id)}
              />
            ))}
          </div>
        )}

        {!query.isLoading &&
          !query.isError &&
          filteredRecipes.length === 0 && (
            <div className="empty-state">
              <h2>Nenhum prato encontrado</h2>
              <p>
                {recipes.length === 0
                  ? "Adicione a primeira receita ao seu cardápio."
                  : "Tente mudar os filtros ou a busca para encontrar uma receita."}
              </p>
              {recipes.length === 0 && (
                <Link to="/admin/nova" className="button-primary">
                  <FiPlus /> Cadastrar receita
                </Link>
              )}
            </div>
          )}
      </section>
    </Container>
  )
}
