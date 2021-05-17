import Remote from 'beyond-remote'
import DateTime from '@/scripts/utils/DateTime'
import * as storage from 'beyond-lib/lib/storage'
import IResponse from '@/remotes/types/dto/response/IResponse'
const token = storage.getCookie('x-auth-token')

interface ILoginInfo {
	uid : string;
	rid : string;
	name : string;
	token : string;
	exp : string;
	iss : string;
	aud : string;
}

export const getToken =  ()=>  token

export const apiBasePath = process.env.NODE_ENV === "production" ? 'http://8.136.213.50:8080' : app.apiBasePath// + '/admin'

export function getHeaders(contentType? : string) : any {
	let headers : HeadersInit = {
		Authorization: token
	}
	if(contentType){
		headers['content-type'] = contentType
	}
	return headers
}


export const remote = new Remote({
	basePath: apiBasePath,
	method: 'post',
	requestJSON: false,
	headers: getHeaders('application/json'),
	timeout : 600
})

export function isSuccess(data : IResponse<any>){
	return data && data.status
}

export function serialize(data: { [key: string]: any }) {
	if (data) {
		for (let key in data) {
			if (data[key] == null) {
				continue
			}
			return JSON.stringify(data[key])
		}
	}
}

export function toJSONStringify(values : any){
	return JSON.stringify(values,function(key,value){

		if(process.env.NODE_ENV !== 'production'){
			if(key === 'orderDate' || key === 'deliveryDate' || key === 'deliveryStartDate' || key === 'deliveryEndDate'){
				console.log(new Date(value))
			}
		}

		if(typeof value === 'string'){
			value = value.trim()
		}
		if(value == null){
			return void(0)
		}else if(value._isADateTimeObject === true && value.toParam){
			return value.toParam()
		}else if(Object.prototype.toString.call(value) === '[object Date]'){
			return DateTime.toParam(value)
		}else if(value && typeof value === 'string' && this[key] && this[key]._isAMomentObject){
			return DateTime.toParam(value)
		}else{
			return value
		}

	})
}
