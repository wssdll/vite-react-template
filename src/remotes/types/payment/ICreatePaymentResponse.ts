import ICreatePaymentDTO from '@/remotes/types/payment/ICreatePaymentDTO'
export default interface ICreatePaymentResponse {

	/** 0-失败 1-成功.  */
	status : number;

	/** 错误码.  */
	errorCode? : number;

	/** 错误信息.  */
	errorMsg? : string;

	/** Gets or sets the result.

            The result.  */
	result? : ICreatePaymentDTO;
}
