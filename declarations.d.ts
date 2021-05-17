
interface Window  {
	store : any;
}

declare namespace app {
	export const apiBasePath : string;
	export const basePath : string;
	export const year : string;
}

type UnPick<T,U> = Pick<T,Exclude<keyof T,U>>

type ArrayOrNot<T> = T extends any ? (T[] | T) : any

type WithChildren<T> =  T & {children? : WithChildren<T>[]}

type MakeMap<T> = {[key : string] : T}
