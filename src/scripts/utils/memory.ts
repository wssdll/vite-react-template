/**
 * 
 * @param obj 判断是否为普通对象
 */
function isPlainObject(obj : unknown) : obj is MakeMap<{}> {
	let prototype = Object.getPrototypeOf(obj)
	if(obj && typeof obj === 'object' && (prototype === null || prototype === Object.prototype)){
		return true
	}
	return false
}

/**
 * 
 * @param obj 将obj处理为规范的参数字符串
 */
function serialize(obj : unknown) : string{
	if(obj == null){
		return ''
	}else if(Array.isArray(obj)){
		const items = obj.map((item)=> serialize(item) )
		return `[${items.join(',')}]`
	}else if(isPlainObject(obj)) {
		const keys = Object.keys(obj)
		keys.sort()
		//key：参数名，serialize(obj[key])：参数的值
		const items = keys.map((key)=> `${key}=${serialize(obj[key])}`)
		return `{${items.join('&')}}`
	}else if(typeof obj === 'object' && typeof obj.valueOf === 'function'){
		return serialize(obj.valueOf())
	}else{
		return obj+''
	}
}

/**
 * 
 * @param fn 序列化了参数作为key，存到了result这个对象里
 */
export default function memory<T extends (...args : any[])=> any>(fn :  T) : T{
	const results : MakeMap<ReturnType<T>> = {}
	function newFn(this : unknown, ...args : any[]) : ReturnType<T>{
		//args：发送给后台的参数，serialize：将args处理成key，key为字符串，是一个参数字符串
		const key = serialize(args)
		//将新的key存到results对象中
		if(!(key in results)){
			results[key] = fn.apply(this,args)
		}
		return results[key]
	}
	return newFn as T
}