export default class Likes {
	constructor(){
		this.likes = [];
	}

	addLike(id, title, publisher, image){
		const like = { id, title, publisher, image };
		this.likes.push(like);

		// Actualizar localStorage
		this.setStorageData();

		return like;
	}

	deleteLike(id){
		// Obtener el index el like que deseamos eliminar
		const targetLikeIndex = this.likes.findIndex(el => el.id === id);

		// Extraer el elemento que queremos eliminar
		this.likes.splice(targetLikeIndex, 1);

		// Actualizar localStorage
		this.setStorageData();
	}

	isLiked(id){
		return this.likes.findIndex(like => like.id === id) !== -1;
	}

	getNumbLikes(){
		return this.likes.length;
	}

	setStorageData(){
		localStorage.setItem('likes', JSON.stringify(this.likes));
	}

	getStorageData(){
		const storage = JSON.parse(localStorage.getItem('likes'));

		if(storage) this.likes = storage;
	}

}