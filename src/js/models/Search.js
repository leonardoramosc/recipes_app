import axios from 'axios';

export default class Search {
	constructor(query){
		this.query = query;
	}

	async getResults() {
		try {
			 const {data: {recipes}} = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
			 this.result = recipes;
		} catch(err) {
			console.log(err);
		}
	}
}