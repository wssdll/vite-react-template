import IBundleDTO from '@/remotes/types/bundle/IBundleDTO'
import IPageDTO from "@/remotes/types/dto/IPageDTO";
export default interface IGetBundleListResponse {

	/** 0-失败 1-成功.  */
	status : number;

	/** 错误码.  */
	errorCode? : number;

	/** 错误信息.  */
	errorMsg? : string;

	/** Gets or sets the result.

            The result.  */
	result? : IPageDTO<IBundleDTO[]>;
}
