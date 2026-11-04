import { FiArrowUpRight, FiClock, FiStar, FiUsers } from "react-icons/fi"
import { Link } from "react-router"
import {
  getDifficultyLabel,
  getRecipeCategory,
  getRecipeDescription,
  type Recipe,
} from "../../types/recipe"

interface RecipeCardProps {
  recipe: Recipe
  outOfStock: boolean
}

export default function RecipeCard({ recipe, outOfStock }: RecipeCardProps) {
  const category = getRecipeCategory(recipe)
  const difficulty = recipe.difficulty.toLowerCase()

  return (
    <article className="recipe-card">
      <Link
        to={`/receita/${recipe.id}`}
        aria-label={`Ver detalhes de ${recipe.name}`}
      >
        <div className="recipe-card-image-wrap">
          <img
            className="recipe-card-image"
            src={recipe.image}
            alt={recipe.name}
            loading="lazy"
          />
          <span className="recipe-category">{category}</span>
          <span className={`stock-badge${outOfStock ? " out" : ""}`}>
            <span className="difficulty-dot" />
            {outOfStock ? "Fora de estoque" : "Disponível"}
          </span>
        </div>

        <div className="recipe-card-body">
          <div className="recipe-card-title-row">
            <h2 className="recipe-card-title">{recipe.name}</h2>
            <span className={`difficulty ${difficulty}`}>
              <span className="difficulty-dot" />
              {getDifficultyLabel(recipe.difficulty)}
            </span>
          </div>
          <p className="recipe-card-description">
            {getRecipeDescription(recipe) || "Receita especial da casa."}
          </p>
          <div className="recipe-meta">
            <span>
              <FiClock /> {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min
            </span>
            <span>
              <FiUsers /> {recipe.servings} porções
            </span>
          </div>
          <div className="recipe-card-footer">
            <span className="recipe-rating">
              <FiStar fill="currentColor" /> {recipe.rating.toFixed(1)}
            </span>
            <span className="text-link">
              Ver receita <FiArrowUpRight />
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
