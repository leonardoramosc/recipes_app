import uniqid from 'uniqid';

export default class List {
	constructor(){
		this.items = [];
	}

	addItem(count, unit, ingredient){
		const item = {
			id: uniqid(),
			count,
			unit,
			ingredient
		};

		this.items.push(item);
		return item;
	}

	deleteItem(id){
		// Obtener el index el item que deseamos eliminar
		const targetItemIndex = this.items.findIndex(el => el.id === id);

		// Extraer el elemento que queremos eliminar
		this.items.splice(targetItemIndex, 1);
	}

	updateCount(id, newCount){
		// Encontrar el elemento al que queremos actualizar la cantidad y actualizar su cantidad
		this.items.find(el => el.id === id).count = newCount;
	}
}