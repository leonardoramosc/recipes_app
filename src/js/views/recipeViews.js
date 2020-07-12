import {elements} from './base';
import {Fraction} from 'fractional'; 

const formatCount = count => {
	if(count){
        
        if(count%0.25 !== 0){
            return count.toFixed(2);
        }
		// separar el entero y el decimal. ejemplo: 1.5 -> 1 es int y 5 es dec
		const [int, dec] = count.toString().split('.').map(el => parseInt(el, 10));

		// si no hay decimal, entonces devuelve el mismo numero que se recibio
		if(!dec) return count;

		// Si no hay entero, es decir, por ejemplo: 0.5, convertir ese numero en una fraccion 
		// luego retornar el numerador de la fraccion y el denominador con el siguiente formato: 1/2
		if(int === 0){
			// convertir el numero en una fraccion
			const fr = new Fraction(count);

			return `${fr.numerator}/${fr.denominator}`;
		} else {
			// en caso de que la cantidad (count) sea por ejemplo: 1.5 su fraccion deberia representarse asi: 1 1/2
			// por lo tanto, obtener la fraccion del decimal, en este caso seria 0.5 (1.5 - 1)
			const fr = new Fraction(count - int);
			// retornar el entero junto con la fraccion del decimal => 1 1/2
			return `${int} ${fr.numerator}/${fr.denominator}`;
		}

	}
	return '?';
};

const createIngredient = (ingredient) => {

	return `
	<li class="recipe__item">
        <svg class="recipe__icon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__count">${formatCount(ingredient.count)}</div>
        <div class="recipe__ingredient">
            <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.ingredient}
        </div>
    </li>
	`;

}

export const clearRecipe = () => {
	elements.recipe.innerHTML = '';
}
export const renderRecipe = (recipe, isLiked) => {
	const markup = `
		<figure class="recipe__fig">
                <img src="${recipe.image}" alt="${recipe.title}" class="recipe__img">
                <h1 class="recipe__title">
                    <span>${recipe.title}</span>
                </h1>
            </figure>
            <div class="recipe__details">
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="img/icons.svg#icon-stopwatch"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
                    <span class="recipe__info-text"> minutes</span>
                </div>
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="img/icons.svg#icon-man"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
                    <span class="recipe__info-text"> servings</span>

                    <div class="recipe__info-buttons">
                        <button class="btn-tiny btn-decrease">
                            <svg>
                                <use href="img/icons.svg#icon-circle-with-minus"></use>
                            </svg>
                        </button>
                        <button class="btn-tiny btn-increase">
                            <svg>
                                <use href="img/icons.svg#icon-circle-with-plus"></use>
                            </svg>
                        </button>
                    </div>

                </div>
                <button class="recipe__love">
                    <svg class="header__likes">
                        <use href="img/icons.svg#${isLiked ? 'icon-heart-outlined' : 'icon-heart'}"></use>
                    </svg>
                </button>
            </div>



            <div class="recipe__ingredients">
                <ul class="recipe__ingredient-list">
                	${recipe.ingredients.map(el => createIngredient(el)).join('')}
                   
                </ul>

                <button class="btn-small recipe__btn recipe__btn--add">
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-shopping-cart"></use>
                    </svg>
                    <span>Add to shopping list</span>
                </button>
            </div>

            <div class="recipe__directions">
                <h2 class="heading-2">How to cook it</h2>
                <p class="recipe__directions-text">
                    This recipe was carefully designed and tested by
                    <span class="recipe__by">${recipe.publisher}</span>. Please check out directions at their website.
                </p>
                <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
                    <span>Directions</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-right"></use>
                    </svg>

                </a>
            </div>
	`;

	elements.recipe.insertAdjacentHTML('afterbegin', markup);
}

export const updateServings = (recipe) => {
    //update servings
    document.querySelector('.recipe__info-data--people').textContent = recipe.servings;

    //update ingredients
    // Seleccionar todos los elementos que representen la cantidad de ingredientes
    const countIng = Array.from(document.querySelectorAll('.recipe__count'));

    countIng.forEach((el, i) => {
        /* Actualizar la cantidad de ingredientes, obteniendo la cantidad de ingredientes de la receta
            los cuales ya han sido previamente actualizados en el modelo. */
        el.textContent = formatCount(recipe.ingredients[i].count);
    })
}