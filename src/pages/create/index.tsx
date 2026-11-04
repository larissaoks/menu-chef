import { useMutation } from "@tanstack/react-query"
import { FiArrowLeft } from "react-icons/fi"
import { Link, useNavigate } from "react-router"
import RecipeForm from "../../components/recipeForm"
import Container from "../../templates/container"
import useRecipeStore from "../../hooks/useRecipeStore"
import { createRecipe } from "../../services/api"
import { toastError, toastSuccess } from "../../utils/toast"
import type { Recipe, RecipeInput } from "../../types/recipe"

export default function RecipeCreate() {
  const { addRecipe } = useRecipeStore()
  const navigate = useNavigate()
  const mutation = useMutation({
    mutationFn: createRecipe,
    onSuccess: (response, input) => {
      const recipe: Recipe = {
        ...input,
        id: Date.now(),
        apiId: response.id,
        rating: 5,
        reviewCount: 0,
        userId: 1,
      }

      addRecipe(recipe)
      toastSuccess("Receita adicionada ao cardápio!")
      navigate(`/receita/${recipe.id}`)
    },
    onError: () => {
      toastError("Não foi possível salvar a receita. Tente novamente.")
    },
  })

  function handleSubmit(input: RecipeInput) {
    mutation.mutate(input)
  }

  return (
    <Container narrow>
      <Link to="/" className="detail-back">
        <FiArrowLeft /> Voltar ao cardápio
      </Link>
      <section className="form-panel">
        <p className="eyebrow">Uma novidade na casa</p>
        <div className="page-heading">
          <div>
            <h1>Novo prato</h1>
            <p>Cadastre os detalhes da receita para incluir no seu menu.</p>
          </div>
        </div>
        <RecipeForm
          onSubmit={handleSubmit}
          isSubmitting={mutation.isPending}
          submitLabel="Adicionar ao cardápio"
        />
      </section>
    </Container>
  )
}
