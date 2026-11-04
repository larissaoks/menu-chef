import { useMutation, useQuery } from "@tanstack/react-query"
import {
  FiArrowLeft,
  FiClock,
  FiEdit2,
  FiStar,
  FiTrash2,
  FiUsers,
} from "react-icons/fi"
import { Link, Navigate, useNavigate, useParams } from "react-router"
import { useState } from "react"
import RecipeForm from "../../components/recipeForm"
import Container from "../../templates/container"
import useRecipeStore from "../../hooks/useRecipeStore"
import {
  deleteRecipe,
  getRecipe,
  updateRecipe,
  updateRecipeAvailability,
} from "../../services/api"
import {
  getDifficultyLabel,
  getRecipeCategory,
  type Recipe,
  type RecipeInput,
} from "../../types/recipe"
import { toastError, toastSuccess } from "../../utils/toast"

interface UpdateVariables {
  recipe: Recipe
  input: RecipeInput
}

export default function RecipeDetail() {
  const { id } = useParams()
  const recipeId = Number(id)
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const { storage, editRecipe, removeRecipe, toggleStock } = useRecipeStore()
  const localRecipe = storage.created.find((recipe) => recipe.id === recipeId)
  const updatedRecipe = storage.updated[recipeId]
  const isDeleted = storage.deleted.includes(recipeId)

  const query = useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: ({ signal }) =>
      localRecipe ?? updatedRecipe ?? getRecipe(recipeId, signal),
    enabled: Number.isInteger(recipeId) && recipeId > 0 && !isDeleted,
    retry: 1,
  })

  const recipe = localRecipe ?? updatedRecipe ?? query.data
  const outOfStock = storage.outOfStock.includes(recipeId)

  const editMutation = useMutation({
    mutationFn: (variables: UpdateVariables) =>
      updateRecipe(variables.recipe.apiId ?? recipeId, variables.input),
    onSuccess: (_response, variables) => {
      const editedRecipe = { ...variables.recipe, ...variables.input }
      editRecipe(editedRecipe)
      setIsEditing(false)
      toastSuccess("Alterações salvas com sucesso!")
    },
    onError: () => {
      toastError("Não foi possível atualizar a receita. Tente novamente.")
    },
  })

  const stockMutation = useMutation({
    mutationFn: () =>
      updateRecipeAvailability(recipe?.apiId ?? recipeId, outOfStock),
    onSuccess: () => {
      toggleStock(recipeId)
      toastSuccess(
        outOfStock
          ? "Prato voltou a ficar disponível."
          : "Prato marcado como fora de estoque.",
      )
    },
    onError: () => {
      toastError("Não foi possível atualizar a disponibilidade do prato.")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteRecipe(recipe?.apiId ?? recipeId),
    onSuccess: () => {
      removeRecipe(recipeId)
      toastSuccess("Prato descontinuado do cardápio.")
      navigate("/", { replace: true })
    },
    onError: () => {
      toastError("Não foi possível excluir o prato. Tente novamente.")
    },
  })

  function handleEdit(input: RecipeInput) {
    if (!recipe) return
    editMutation.mutate({ recipe, input })
  }

  function handleDelete() {
    if (!window.confirm(`Deseja descontinuar "${recipe?.name}" do cardápio?`)) {
      return
    }
    deleteMutation.mutate()
  }

  if (!Number.isInteger(recipeId) || recipeId <= 0 || isDeleted) {
    return <Navigate to="/" replace />
  }

  if (query.isLoading) {
    return (
      <Container>
        <div className="status-message" role="status">
          Carregando detalhes da receita...
        </div>
      </Container>
    )
  }

  if (query.isError || !recipe) {
    return (
      <Container>
        <div className="status-message" role="alert">
          Não foi possível carregar esta receita.
          <button
            className="text-link"
            type="button"
            onClick={() => void query.refetch()}
          >
            Tentar novamente
          </button>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <Link to="/" className="detail-back">
        <FiArrowLeft /> Voltar ao cardápio
      </Link>

      {isEditing ? (
        <section className="form-panel">
          <p className="eyebrow">Atualize as informações</p>
          <div className="page-heading">
            <div>
              <h1>Editar prato</h1>
              <p>Altere o preparo, as porções ou outros detalhes.</p>
            </div>
          </div>
          <RecipeForm
            initialRecipe={recipe}
            onSubmit={handleEdit}
            isSubmitting={editMutation.isPending}
            submitLabel="Salvar alterações"
          />
          <div className="form-actions">
            <button
              className="button-secondary"
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={editMutation.isPending}
            >
              Cancelar edição
            </button>
          </div>
        </section>
      ) : (
        <article className="detail-layout">
          <img className="detail-image" src={recipe.image} alt={recipe.name} />

          <div className="detail-copy">
            <p className="eyebrow">
              {getRecipeCategory(recipe)} · {recipe.cuisine || "Da casa"}
            </p>
            <h1>{recipe.name}</h1>
            <p className="detail-description">
              Uma receita selecionada para compor o cardápio da sua casa.
            </p>

            <div className="recipe-meta">
              <span>
                <FiStar /> {recipe.rating.toFixed(1)} ({recipe.reviewCount}{" "}
                avaliações)
              </span>
              <span>{getDifficultyLabel(recipe.difficulty)}</span>
            </div>

            <div className="detail-stats">
              <div className="detail-stat">
                <strong>
                  <FiClock /> {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min
                </strong>
                <span>Tempo total</span>
              </div>
              <div className="detail-stat">
                <strong>
                  <FiUsers /> {recipe.servings}
                </strong>
                <span>Porções</span>
              </div>
              <div className="detail-stat">
                <strong>{recipe.caloriesPerServing}</strong>
                <span>kcal / porção</span>
              </div>
            </div>

            <div className="detail-actions">
              <button
                className="button-primary"
                type="button"
                onClick={() => setIsEditing(true)}
              >
                <FiEdit2 /> Editar prato
              </button>
              <button
                className="button-secondary"
                type="button"
                onClick={() => stockMutation.mutate()}
                disabled={stockMutation.isPending}
              >
                {stockMutation.isPending
                  ? "Atualizando..."
                  : outOfStock
                    ? "Marcar disponível"
                    : "Fora de estoque"}
              </button>
              <button
                className="button-danger"
                type="button"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                aria-label="Descontinuar prato"
                title="Descontinuar prato"
              >
                <FiTrash2 />
              </button>
            </div>

            <section className="detail-section">
              <h2>Ingredientes</h2>
              <ul>
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={`${ingredient}-${index}`}>{ingredient}</li>
                ))}
              </ul>
            </section>
          </div>

          <section className="detail-section detail-instructions">
            <h2>Modo de preparo</h2>
            <ol>
              {recipe.instructions.map((instruction, index) => (
                <li key={`${instruction}-${index}`}>{instruction}</li>
              ))}
            </ol>
          </section>
        </article>
      )}
    </Container>
  )
}
