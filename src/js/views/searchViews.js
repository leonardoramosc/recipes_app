import { elements, elementsSelectors } from './base.js';

// Get the input of the search field
export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
	elements.searchInput.value = "";
}

export const clearPrevResults = () => {
	elements.resultsContainer.innerHTML = "";
	elements.resultsButtons.innerHTML = '';
}

export const highlightSelected = id => {
	// seleccionar todas las recetas y eliminarles la clase que hace que esten resaltadas
	const resultsArr = Array.from(document.querySelectorAll('.results__link'));
	// Chequear que existan recetas en el overview de recetas
	if(resultsArr.length > 0){
		for(let result of resultsArr){
			result.classList.remove('results__link--active');
		}

		// Resaltar la receta seleccionada
		document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
	}
	
}

export const renderLoader = (parentEl) => {
	const loader = `
		<div class="loader">
			<svg>
				<use href="img/icons.svg#icon-cw"></use>
			</svg>
		</div>
	`

	parentEl.insertAdjacentHTML('beforeend', loader);
}

export const clearLoader = () => {
	const loader = document.querySelector(elementsSelectors.loader);

	loader.parentElement.removeChild(loader);
}

export const renderResults = (recipes, page=1, recipesPerPage=10) => {

	const start = (page - 1) * recipesPerPage;
	const end = page * recipesPerPage;

	recipes.slice(start, end).forEach(renderRecipe);

	renderButtons(page, recipes.length, recipesPerPage);
}


/**********************************************************************************************************
** HELPER FUNCTIONS */

const renderRecipe = recipe => {
	const markup = `
		<li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${limitRecipeTitle(recipe.title)}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
	`;

	// Insert recipe after de last child (beforeend)
	elements.resultsContainer.insertAdjacentHTML('beforeend', markup);
}

export const limitRecipeTitle = (title, maxLength = 17) => {

	if(title.length > maxLength) {
		const newTitle = [];

		title.split(' ').reduce( (acum, curr) => {
			if(acum + curr.length <= maxLength) {
				newTitle.push(curr);
			}
			return acum + curr.length;
		}, 0);

		return `${newTitle.join(' ')}...`;
	}
	return title;
}

const renderButtons = (page, numRecipes, recipesPerPage) => {
	const totalPages = Math.ceil(numRecipes / recipesPerPage);
	let buttons;

	if(page === 1 && totalPages > 1){
		buttons = getButton(page, 'next');
	} else if (page < totalPages && page > 1){
		buttons = getButton(page, 'prev') + getButton(page, 'next');
	} else if (page === totalPages && totalPages > 1) {
		buttons = getButton(page, 'prev');
	}

	elements.resultsButtons.insertAdjacentHTML('afterbegin', buttons);
	
}

const getButton = (page, type) => {
	return `
		<button class="btn-inline results__btn--${type}" data-goToPage="${type === 'prev' ? page-1 : page + 1}">
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
            </svg>
            <span>${type === 'prev' ? `Page: ${page-1}` : `Page: ${page+1}`}</span>
        </button>
	`;
}

/*
 				<button class="btn-inline results__btn--prev">
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-left"></use>
                    </svg>
                    <span>Page 1</span>
                </button>
                <button class="btn-inline results__btn--next">
                    <span>Page 3</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-right"></use>
                    </svg>
                </button>

*/