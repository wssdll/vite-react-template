import * as moment from 'moment'
import { LabeledValue } from 'antd/lib/select'

export function parseRes(res: any) {
	return typeof res === 'string' ? JSON.parse(res) : res
}

export function scrollTop(value: number) {
	if (typeof document !== 'undefined') {
		value = value || 0
		document.documentElement.scrollTop = value
		document.body.scrollTop = value
	}
}

export function getYearMonthDay(date: Date) {
	let year = date.getFullYear().toString()
	let month = (date.getMonth() + 1).toString()
	let day = date.getDate().toString()

	if (month.length === 1) {
		month = '0' + month
	}
	if (day.length === 1) {
		day = '0' + day
	}

	return [year, month, day].join('-')
}

export function formatTimeWithoutSec(date: Date) {
	let year = date.getFullYear().toString()
	let month = (date.getMonth() + 1).toString()
	let day = date.getDate().toString()
	let hour = date.getHours().toString()
	let minute = date.getMinutes().toString()

	if (month.length === 1) {
		month = '0' + month
	}
	if (day.length === 1) {
		day = '0' + day
	}
	if (hour.length === 1) {
		hour = '0' + hour
	}
	if (minute.length === 1) {
		minute = '0' + minute
	}

	return [year, month, day].join('-') + ' ' + [hour, minute].join(':')
}

export function convertDateToFomateDate(timestamp: number) {
	return new Date(timestamp)
}

export function toArray(obj : {length : number}) : any[] {
	return Array.prototype.slice.call(obj,0)
}

export function  arrayIsEmpty<T>(arr : T[]){
	return !arr || arr.length === 0
}

export function isLikeNumber(num: string | number) {
	if(num === 0){
		return true
	}
	if(typeof num === 'string'){
		// 处理 +'' 为 0 的情况
		num = num.trim()
	}
	if(!num){
		return false
	}
	num = +num
	return num === num
}

export function isNumber(num: any) : num is number {
	return typeof num === 'number' && num === num
}

export function isPositiveNumber(num: any) : num is number {
	return isNumber(num) && num > 0
}

export function formatterNumber(value : any) : string{

	let number = +value
	if(number !== number){
		number = 0
	}
	let formatStr = number.toFixed(2)
	let dotIndex = formatStr.indexOf('.')
	let positive = formatStr.slice(0,dotIndex).replace(/\B(?=(\d{3})+(?!\d))/g,',')
	return positive + formatStr.slice(dotIndex)
}

interface IOptions {
	text: string;
	value: any;
}

export function array2Map(array: IOptions[]) {
	const map: { [key: string]: string } = {}
	if (Array.isArray(array)) {
		array.forEach((item) => map[item.value] = item.text)
	}
	return map
}

function isObject(obj: any) {
	return obj && Object.prototype.toString.call(obj) === '[object Object]'
}

export function isEmptyObject(obj: any){
	for(let _key in obj){
		return false
	}
	return true
}

export function deepEqual(obj1: any, obj2: any) {
	if (obj1 === obj2) {
		return true
	}
	if (!obj1 || !obj2) {
		return false
	}
	for (let key in obj1) {
		let v1 = obj1[key]
		let v2 = obj2[key]
		if (isObject(v1) && isObject(v2)) {
			if (!deepEqual(v1, v2)) {
				return false
			}
		} else if (v1 !== v2) {
			return false
		}
	}
	for (let key in obj2) {
		if (!Object.prototype.hasOwnProperty.call(obj1, key)) {
			return false
		}
	}
	return true
}

export function mm2px(mm: number) {
	return mm ? Math.floor(mm * (96 / 25.4)) - 1 : 0 // 96 为 每英寸对应的像素点，1 为偏差值
}

export function formFilter(data: any) {
	if (data) {
		let result: typeof data = {}
		for (let k in data) {
			if (data[k] != null) {
				result[k] = data[k]
			}
		}
		return result
	} else {
		return data
	}
}

export function getLastDays(lastDays = 30, includeToday = true){
	let offset : number
	if(includeToday){
		lastDays--
		offset = 0
	}else{
		offset = 1
	}
	return {start:moment().subtract(lastDays, 'days').startOf('date') , end:moment().subtract(offset, 'days').endOf('date')}
}

export function getUUID(len: number = 32, radix?: number) {
	let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
	let uuid = [], i
	radix = radix || chars.length
	if (len) {
		for (i = 0; i < len; i++) {
			uuid[i] = chars[0 | Math.random() * radix]
		}
	} else {
		let r
		uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
		uuid[14] = '4'
		for (i = 0; i < 36; i++) {
			if (!uuid[i]) {
				r = 0 | Math.random() * 16
				uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
			}
		}
	}
	return uuid.join('')
}

export function isLabeledValue(value : any) : value is LabeledValue{
	return value && value.key != null
}

export function listToTree<T extends {id? : string; parentId? :string; children? : T[]}>(list : T[], callbackfn?: (node: T) => T) {
	list = list.map((item)=> ({...item}) )
	let maps: { [key: string]: T } = {}
	list.forEach((item) => maps[item.id] = item)
	list.forEach((item) => {
		let parent = item.parentId ? maps[item.parentId] : null
		if (parent) {
			parent.children = parent.children || []
			parent.children.push(item)
			if (callbackfn) {
				parent = callbackfn(parent)
			}
		}
	})
	return list.filter((item) => !item.parentId)
}

export function join(first : string | number,second : string | number){
	first = first != null ? (first + '') : ''
	second = second != null ? (second + '') : ''
	const divider = first && second ? '/' : ''
	return `${first}${divider}${second}`
}

type ListToMapKey<T> = keyof T | ((data : T,index : number)=> string | number)

type ListToMapValue<T,S> = (keyof T) | ((data : T,index : number)=> S) | boolean

export interface IListToMap {
	<T>(list : T[], key : ListToMapKey<T>) : MakeMap<T>
	<T,S>(list : T[], key : ListToMapKey<T>,value : (data : T,index : number)=> S) : MakeMap<S>
	<T,S extends keyof T>(list : T[], key : ListToMapKey<T>,value : S) : MakeMap<T[S]>
	<T,S extends boolean>(list : T[], key : ListToMapKey<T>,value : S) : MakeMap<S>
}


export const listToMap : IListToMap = <T,S>(list : T[], key : ListToMapKey<T>, value? : ListToMapValue<T,S>): MakeMap<S>=>{
	const result : MakeMap<S> = {}
	if(list){
		list.forEach((item,index)=>{
			let fieldKey = typeof key === 'function' ? key(item,index) : item[key] as any
			if(typeof value === 'function'){
				result[fieldKey] = value(item,index)
			}else if(typeof value === 'string'){
				result[fieldKey] = item[value] as any
			}else if(typeof value === 'boolean'){
				result[fieldKey] = value as any
			}else{
				result[fieldKey] = item as any
			}
		})
	}
	return result
}

interface IAddressInputValue {
	province: string;
	city: string;
	district: string;
	addressDetail: string;
}

export function getAddressText(address: IAddressInputValue) {
	if (!address) {
		return
	}
	let { province, city, district, addressDetail } = address
	province = province == null ? '' : province
	city = city == null ? '' : city
	district = district == null ? '' : district
	addressDetail = addressDetail == null ? '' : addressDetail
	return `${province}${city}${district}${addressDetail}`
}


export function scrollTo(target : number){
	document.documentElement.scrollTop = target

	// if(!window.requestAnimationFrame){
	// 	return
	// }

	// const current = document.documentElement.scrollTop
	// if(current > target){

	// 	const gap = 15
	// 	let next = current
	// 	let run = ()=>{
	// 		next = next === target ? null : Math.max(next - gap,target)
	// 		if(next != null){
	// 			document.documentElement.scrollTop = next
	// 			window.requestAnimationFrame(run)
	// 		}
	// 	}
	// 	run()
	// }else{
	// 	document.documentElement.scrollTop = target
	// }
}


export function removeRepeats(strs : string[]){
	const maps = listToMap(strs,(str)=>str)
	return Object.keys(maps)
}

export function pickPropertiesIfExists<T extends {},K extends keyof T>(obj : T,...args : K[]){
	const result = {} as Required<{ [P in K]: T[P]; }>
	args.forEach((key)=> {
		if(key in obj){
			result[key] = obj[key]
		}
	})
	return result
}

export function pickProperties<T extends {},K extends keyof T>(obj : T,...args : K[]){
	const result = {} as Required<{ [P in K]: T[P]; }>
	args.forEach((key)=> result[key] = obj[key] )
	return result
}

export function round(value : number){
	if(!isNumber(value)){
		return value
	}
	if(value >= 0){
		return Math.round(value)
	}else{
		return -Math.round(-value)
	}
}
