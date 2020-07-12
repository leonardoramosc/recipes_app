import axios from 'axios';

export default class Recipe {
	constructor(id){
		this.id = id;
	}

	async getRecipe(){
		try {
			const {data:{recipe}} = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
			this.title = recipe.title;
			this.publisher = recipe.publisher;
			this.image = recipe.image_url;
			this.url = recipe.source_url;
			this.ingredients = recipe.ingredients;
		} catch(err){
			console.log(err);
			alert('Something went wrong');
		}
	}

	calcCookingTime(){
		//Especulando que por cada 3 ingrediente sean 15 minutos:
		//Obtener cuantas veces hay 3 ingredients
		const periods = Math.ceil(this.ingredients.length / 3);
		this.time = periods * 15;
	}

	calcServings(){
		this.servings = 4;
	}

	parseIngredients(){
		const unitsLong = ['tablespoons', 'tablespoon', 'ounce', 'ounces', 'teaspoons','teaspoon', 'cup', 'cups'];
		const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'cup'];
		const units = [...unitsShort, 'kg', 'g'];

		const newIngredients = this.ingredients.map((el) => {
			// 1) uniform units
			let ingredient = el.toLowerCase();
			unitsLong.forEach((unit, index) => {
				ingredient = ingredient.replace(unit, units[index]);
			})

			// 2) remove parentheses
			ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

			// 3) parse ingredients into count, unit and ingredient
			const arrIng = ingredient.split(' ');
			const unitIndex = arrIng.findIndex(el => unitsShort.includes(el));

			let objIng;
			if(unitIndex > -1) {
				// there is a unit
				const arrCount = arrIng.slice(0, unitIndex);

				let count;
				if(arrCount.length === 1) {
					count = eval(arrIng[0].replace('-', '+'));
				} else {
					count = eval(arrIng.slice(0, unitIndex).join('+'));
				}

				objIng = {
					count,
					unit: arrIng[unitIndex],
					ingredient: arrIng.slice(unitIndex + 1).join(' ')
				}

			} else if(parseInt(arrIng[0], 10)){
				// there is no unit, but the first element is a number
				objIng = {
					count: parseInt(arrIng[0], 10),
					unit: '',
					ingredient: arrIng.slice(1).join(' ')
				}
			} else if(unitIndex === -1){
				// there is no unit and no number in first position
				objIng = {
					count: 1,
					unit: '',
					ingredient
				}
			}

			return objIng;
		});
		this.ingredients = newIngredients;
	}

	updateServings(type){
		//servings
		const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1
		//ingredients
		this.ingredients.forEach(ing => {
			ing.count *= (newServings / this.servings);
		})

		this.servings = newServings;
	}
}

