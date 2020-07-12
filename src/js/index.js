import 'core-js';
import "regenerator-runtime";

import Search from './models/Search.js';
import Recipe from './models/Recipe.js';
import List from './models/list.js';
import Likes from './models/Likes.js';
import * as searchView from './views/searchViews.js';
import * as recipeViews from './views/recipeViews.js';
import * as listView from './views/listView.js';
import * as likesView from './views/likesView.js';
import { elements, elementsSelectors } from './views/base';

/** Global state of the app
* - Search object
* - Current recibe object
* - Shopping list object
* - Liked recipes
*/
const state = {};

const controlSearch = async () => {
	// Get the query from the view
	const query = searchView.getInput();

	if(query) {
		// crear Search object con la query y agregar al state
		state.search = new Search(query);

		// Preparar UI para los resultados
			// Clear the input
		searchView.clearInput();
			// Clear previous results
		searchView.clearPrevResults();
			// Render loader
		searchView.renderLoader(elements.results);

		// Buscar recetas
		try{
			await state.search.getResults();
			searchView.clearLoader();
			// Renderizar los resultados en UI
			searchView.renderResults(state.search.result, 1, 10);
		} catch(err){
			searchView.clearLoader();
			console.log(err);
			alert('Something went wrong :(');
		}
		
	}
}

/**
* RECIPE CONTROLLER
*/

const controlRecipe = async () => {
	// Get id
	const id = window.location.hash.replace('#', '');
	
	if(id){
		// preparar UI para renderizar recipe
		recipeViews.clearRecipe();
		searchView.renderLoader(elements.recipe);

		// resaltar receta seleccionada
		searchView.highlightSelected(id);

		// Crear recipe object
		state.recipe = new Recipe(id);
		// Obtener info del recipe del servidor

		try {
			await state.recipe.getRecipe();
			state.recipe.parseIngredients();

			// Calcular servings y time
			state.recipe.calcCookingTime();
			state.recipe.calcServings();

			// Render recipe
			searchView.clearLoader();

			/* verificar si ya se ha creado la instancia de likes para saber
			si se debe incluir el argumento que verificara si se le ha dado like a la receta
			para saber cual stilo se le aplicara al boton the like
			*/
			if(state.likes){
				recipeViews.renderRecipe(state.recipe, state.likes.isLiked(state.recipe.id));
			} else {
				recipeViews.renderRecipe(state.recipe);
			}

			
		} catch(err){
			console.log(err);
			alert('Something went wrong :(');
			searchView.clearLoader();
		}
		
	}
}





/**
* SHOPPING LIST CONTROLLER
*/

const controlList = () => {
	// Si no hay una lista en el state, entonces agregar una nueva
	if(!state.list) state.list = new List();

	// Agregar los ingredientes al modelo de la shopping list
	state.recipe.ingredients.forEach(ingredient => {
		const item = state.list.addItem(ingredient.count, ingredient.unit, ingredient.ingredient);
		// renderizar el item
		listView.renderItem(item)
	});
}


/**
* LIKES CONTROLLER
*/

const controlLikes = () => {
	// obtener el id de la receta actual
	const currentId = state.recipe.id;
	// Si no hay likes en el state, añadir una instancia de likes en el state
	if(!state.likes) state.likes = new Likes();

	// Si el usuario no ha dado like a la receta actual
	if(!state.likes.isLiked(currentId)){
		// agregar receta a los likes del state
		const newLike = state.likes.addLike(
			currentId, state.recipe.title, state.recipe.publisher, state.recipe.image
		);

		// Cambiar apariencia del boton de like
		likesView.toggleLikeButton(true);

		// Agregar receta al UI de likes
		likesView.addRecipe(state.recipe);

	// Si el usuario ya dio anteriormente like a la receta
	} else {
		// eliminar receta a los likes del state
		state.likes.deleteLike(currentId);

		// Cambiar apariencia del boton de like
		likesView.toggleLikeButton(false);

		// eliminar receta al UI de likes
		likesView.dislikeRecipe(currentId);
	}

	// Verificar si ya se ha creado la instacia de likes y si hay likes para desplegar el menu con los likes
	likesView.toggleLikesMenu(state.likes.getNumbLikes());

}


/*********************************************************************************************************************
******************************************** SETTING EVENTS LISTENERS ************************************************
**********************************************************************************************************************/

// Cuando la pagina cargue, crear likes y obtener los likes del localStorage
window.addEventListener('load', () => {
	// Agregar instancia de likes al state
	state.likes = new Likes();
	// Actualizar likes si hay data guardada en el localStorage
	state.likes.getStorageData();

	// Renderizar los likes
	state.likes.likes.forEach(recipe => {
		likesView.addRecipe(recipe);
	})

	// Si hay likes, desplegar el menu de likes cuando se haga hover
	likesView.toggleLikesMenu(state.likes.getNumbLikes());

	controlRecipe();
})

window.addEventListener('hashchange', controlRecipe);


elements.searchForm.addEventListener('submit', (e) => {
	e.preventDefault();
	controlSearch();
});

elements.resultsButtons.addEventListener('click', (e) => {
	const button = e.target.closest(elementsSelectors.pagesButton);
	if(button){
		const page = parseInt(button.dataset.gotopage, 10);
		searchView.clearPrevResults();
		searchView.renderResults(state.search.result, page, 10);
	}
	
});

// Handling delete and update shopping list items events
elements.shopping.addEventListener('click', e => {
	const id = e.target.closest('.shopping__item').dataset.itemid;

	if( e.target.matches('.shopping__delete, .shopping__delete *') ){
		// eliminar del modelo
		state.list.deleteItem(id);
		//eliminar de la vista
		listView.deleteItem(id);
	} else if( e.target.matches('.shopping__count--value') ) {
		if(e.target.value < 1){
			e.target.value = 1;
		}
		const countValue = e.target.value;
		state.list.updateCount(id, countValue);
	}
})


// CONTROLAR LOS CLICKS EN LOS BOTONES PRESENTES EN EL PANEL DEL RECIPE
elements.recipe.addEventListener('click', e => {
	// Verificar si el target coincide con btn-decrease incluyendo todos sus hijos
	if( e.target.matches('.btn-decrease, .btn-decrease *') ) {
		// disminuir servings solo si la cantidad es mayor a 1 para evitar que sea un numero negativo o 0
		if(state.recipe.servings > 1){
			state.recipe.updateServings('dec');
			recipeViews.updateServings(state.recipe);
		}
	} else if ( e.target.matches('.btn-increase, .btn-increase *') ) {
		// aumentar servings
		state.recipe.updateServings('inc');
		recipeViews.updateServings(state.recipe);
	} else if( e.target.matches('.recipe__btn--add, .recipe__btn--add *') ){
	  	controlList();
	} else if( e.target.matches('.recipe__love, .recipe__love *') ){
		controlLikes();
	}
});





