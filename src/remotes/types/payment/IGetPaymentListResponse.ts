import IPageDTO from "@/remotes/types/dto/IPageDTO";
import IPaymentDTO from '@/remotes/types/payment/IPaymentDTO'
export default interface IGetPaymentListResponse {

	/** 0-失败 1-成功.  */
	status : number;

	/** 错误码.  */
	errorCode? : number;

	/** 错误信息.  */
	errorMsg? : string;

	/** Gets or sets the result.

            The result.  */
	result? : IPageDTO<IPaymentDTO[]>;
}
