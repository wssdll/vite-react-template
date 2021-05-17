import IResponse from '@/remotes/types/dto/response/IResponse'
import EventBus, { IHandler } from '@/scripts/commons/EventBus';

const typeEvent = 'clearCache'


export interface IBaseStoreRemoter<U extends any[],T>{
	(...args : U) : Promise<T>
	clearCache : ()=> void
	onClearCache : (handler : IHandler<null>)=> ()=>void
}

export interface IStoreRemoter<U extends any[],T> extends IBaseStoreRemoter<U,T>{
	createFilter : <V>(filter :(data : T)=> V | PromiseLike<V>)=> IBaseStoreRemoter<U,V>
}

interface ICreateStore {
	<U extends any[],T>(remoter : (...args: U) => Promise<IResponse<T>>, options? : {cache : boolean} ) : IStoreRemoter<U,T>
	<U extends any[],T,R>(remoter : (...args: U) => Promise<IResponse<T>>,filter : (data : T)=> R | PromiseLike<R>,options? : {cache : boolean}) : IStoreRemoter<U,R>
}

export default (<U extends any[],T,R>(remoter :  (...args: U) => Promise<IResponse<T>>, filter? : ((data : T)=> R | PromiseLike<R>) | {cache : boolean}, options? : {cache : boolean})=>{
	let result : Promise<T | R>
	const defaultOptions = {cache : true}
	if(remoter){
		if(typeof filter !== 'function' && filter){
			options = {...defaultOptions,...filter}
		}else {
			options = {...defaultOptions,...options}
		}

		const eventBus = new EventBus()
		const storeRemoter = ((...args : U)=> {
			if(result && options.cache){
				return result
			}else{
				result = remoter.apply(null,args)
					.then<T | R>(res => typeof filter === 'function' ? filter(res.result) : res.result)
					.catch((error : Response | IResponse<T>) => {
						throw error
					})
			}
			return result
		}) as IStoreRemoter<U,T>

		storeRemoter.clearCache = ()=>{
			result = null
			eventBus.trigger(typeEvent)
		}
		storeRemoter.onClearCache = (handler)=> eventBus.on(typeEvent,handler)

		storeRemoter.createFilter = <V>(filter : (data : T)=> V | PromiseLike<V>)=> {
			const copy = ((...args : U)=> storeRemoter.apply(null,args).then(filter)) as IBaseStoreRemoter<U,V>
			copy.clearCache = storeRemoter.clearCache
			copy.onClearCache = storeRemoter.onClearCache
			return copy
		}
		return storeRemoter
	}
}) as ICreateStore

interface ICreateProxy {
	<U extends any[],T>(remoter : (...args: U) => Promise<IResponse<T>>) : (...args: U) => Promise<T>
	<U extends any[],T,R>(remoter : (...args: U) => Promise<IResponse<T>>,filter : (data : T)=> R | PromiseLike<R>) : (...args: U) => Promise<R>
}

export const createProxy : ICreateProxy = <U extends any[],T,R>(remoter : (...args: U) => Promise<IResponse<T>>, filter? : (data : T)=> R)=>{
	return ((...args : U)=> {
		return remoter.apply(null,args)
			.then(res => filter ? filter(res.result) : res.result)
			.catch((error : Response | IResponse<T>) => {
				throw error
			})
	})
}
