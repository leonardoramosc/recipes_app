import { elements } from './base';
import { limitRecipeTitle } from './searchViews';

export const toggleLikeButton = (isLiked) => {
	const iconString = isLiked ? 'icon-heart-outlined' : 'icon-heart';

	document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
}

export const addRecipe = (recipe) => {
	const markup = `
	<li>
        <a class="likes__link" href="#${recipe.id}">
            <figure class="likes__fig">
                <img src="${recipe.image}" alt="${recipe.title}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="likes__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
	`;
	elements.likes.insertAdjacentHTML('beforeend', markup);
}

export const dislikeRecipe = (id) => {
	const target = document.querySelector(`a[href="#${id}"]`).parentElement;

	elements.likes.removeChild(target);
}

export const toggleLikesMenu = numbLikes => {
	elements.likesPanel.style.visibility = numbLikes === 0 ? 'hidden' : 'visible';
}