import ResponseCode from '@/remotes/types/dto/response/ResponseCode'

export default interface IResponse<T = null>{
	status : number;
	errorCode? : ResponseCode;
	errorMsg? : string;
	result? : T;
}
