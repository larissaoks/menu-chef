import type { ChangeEvent, FormEvent } from "react"
import useForm from "../../hooks/useForm"
import type {
  Recipe,
  RecipeCategory,
  RecipeDifficulty,
  RecipeInput,
} from "../../types/recipe"

interface RecipeFormProps {
  initialRecipe?: Recipe
  onSubmit: (recipe: RecipeInput) => void
  isSubmitting: boolean
  submitLabel: string
}

interface FormValues {
  name: string
  category: RecipeCategory
  prepTimeMinutes: string
  cookTimeMinutes: string
  servings: string
  difficulty: RecipeDifficulty
  image: string
  cuisine: string
  ingredients: string
  instructions: string
}

const defaultImage =
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80"

function getInitialValues(recipe?: Recipe): FormValues {
  return {
    name: recipe?.name ?? "",
    category: recipe?.category ?? "Principais",
    prepTimeMinutes: String(recipe?.prepTimeMinutes ?? 15),
    cookTimeMinutes: String(recipe?.cookTimeMinutes ?? 25),
    servings: String(recipe?.servings ?? 2),
    difficulty: recipe?.difficulty ?? "Easy",
    image: recipe?.image ?? "",
    cuisine: recipe?.cuisine ?? "",
    ingredients: recipe?.ingredients.join("\n") ?? "",
    instructions: recipe?.instructions.join("\n") ?? "",
  }
}

interface FormFieldProps {
  label: string
  name: string
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  type?: string
  min?: number
  required?: boolean
}

function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  min,
  required = true,
}: FormFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        min={min}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  )
}

export default function RecipeForm({
  initialRecipe,
  onSubmit,
  isSubmitting,
  submitLabel,
}: RecipeFormProps) {
  const { values, handleChange } = useForm<FormValues>(getInitialValues(initialRecipe))

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const input: RecipeInput = {
      name: values.name.trim(),
      category: values.category,
      prepTimeMinutes: Number(values.prepTimeMinutes),
      cookTimeMinutes: Number(values.cookTimeMinutes),
      servings: Number(values.servings),
      difficulty: values.difficulty,
      image: values.image.trim() || defaultImage,
      cuisine: values.cuisine.trim() || "Da casa",
      ingredients: values.ingredients
        .split("\n")
        .map((ingredient) => ingredient.trim())
        .filter(Boolean),
      instructions: values.instructions
        .split("\n")
        .map((instruction) => instruction.trim())
        .filter(Boolean),
      caloriesPerServing: initialRecipe?.caloriesPerServing ?? 0,
      tags: [values.category.toLowerCase()],
      mealType: [],
    }

    onSubmit(input)
  }

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      <div className="form-field full">
        <label htmlFor="name">Nome do prato</label>
        <input
          id="name"
          name="name"
          value={values.name}
          onChange={handleChange}
          placeholder="Ex.: Risoto de cogumelos"
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="category">Categoria do cardápio</label>
        <select
          id="category"
          name="category"
          value={values.category}
          onChange={handleChange}
        >
          <option value="Entradas">Entradas</option>
          <option value="Principais">Principais</option>
          <option value="Sobremesas">Sobremesas</option>
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="difficulty">Nível de dificuldade</label>
        <select
          id="difficulty"
          name="difficulty"
          value={values.difficulty}
          onChange={handleChange}
        >
          <option value="Easy">Fácil</option>
          <option value="Medium">Médio</option>
          <option value="Hard">Difícil</option>
        </select>
      </div>

      <FormField
        label="Tempo de preparo (min)"
        name="prepTimeMinutes"
        type="number"
        min={0}
        value={values.prepTimeMinutes}
        onChange={handleChange}
      />
      <FormField
        label="Tempo de cocção (min)"
        name="cookTimeMinutes"
        type="number"
        min={0}
        value={values.cookTimeMinutes}
        onChange={handleChange}
      />
      <FormField
        label="Porções"
        name="servings"
        type="number"
        min={1}
        value={values.servings}
        onChange={handleChange}
      />
      <FormField
        label="Cozinha / estilo"
        name="cuisine"
        value={values.cuisine}
        onChange={handleChange}
        required={false}
      />

      <div className="form-field full">
        <label htmlFor="ingredients">Ingredientes</label>
        <textarea
          id="ingredients"
          name="ingredients"
          value={values.ingredients}
          onChange={handleChange}
          placeholder={"Um ingrediente por linha"}
          required
        />
        <span className="form-help">Digite um ingrediente por linha.</span>
      </div>

      <div className="form-field full">
        <label htmlFor="instructions">Modo de preparo</label>
        <textarea
          id="instructions"
          name="instructions"
          value={values.instructions}
          onChange={handleChange}
          placeholder={"Uma etapa por linha"}
          required
        />
        <span className="form-help">Digite uma etapa por linha.</span>
      </div>

      <div className="form-field full">
        <label htmlFor="image">Imagem do prato (URL)</label>
        <input
          id="image"
          name="image"
          type="url"
          value={values.image}
          onChange={handleChange}
          placeholder="https://..."
        />
      </div>

      <div className="form-actions">
        <button className="button-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : submitLabel}
        </button>
      </div>
    </form>
  )
}
