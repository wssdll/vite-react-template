/**
 * 
 * let e = new EventBus
 * e.on('submit',(e)=>{})
 * e.off('submit')
 */

export interface IEvent<T>{
	type : string;
	data? : T;
}


export type IHandler<T> = (e : IEvent<T>)  => void

export default class EventBus {

	handlers : {[key :string] : IHandler<any>[] } = {}

	on(type : string, cb : IHandler<any>){
		if(type){
			this.handlers[type] = this.handlers[type] || []
			this.handlers[type].push(cb)
		}
		return ((_type,_cb)=>{  
			return ()=>this.off(_type,_cb) 
		})(type,cb)
	}

	off(type : string, cb : IHandler<any>){
		if(type && this.handlers[type]){
			if(cb){
				for(let i = 0,len = this.handlers[type].length; i < len; i++ ){
					if(this.handlers[type][i] === cb){
						this.handlers[type].splice(i,1)
						return
					}
				}
			}else{
				delete this.handlers[type]
			}
		}
	}

	trigger(type : string, data? : any){
		if(type && this.handlers[type]){
			this.handlers[type].forEach((cb)=>{
				if(typeof cb === 'function'){
					cb({type,data})
				}
			})
		}
	}
}