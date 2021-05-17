export default class Page<T> {
	id : T
	title : string

	constructor({id,title} : {id : T, title : string}){
		this.id = id
		this.title= title
	}

	toString(){
		return this.id
	}
}

export function parsePages<T extends string>(pages : {[key in T] : Page<T> | {title : string} }) : {[key in T] : Page<T>}  {
	let result = {} as  {[key in T] : Page<T>} 
	for(let k in pages){
		let page = pages[k]
		if(page instanceof Page){
			result[k] = page
		}else{
			result[k] = new Page({id : k , title : page.title })
		}
	}
	return result
}