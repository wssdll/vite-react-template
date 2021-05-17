import IShortMessageDTO from '@/remotes/types/shortMessage/IShortMessageDTO'
export default interface IGetShortMessageListResponse {

	/** 0-失败 1-成功.  */
	status : number;

	/** 错误码.  */
	errorCode? : number;

	/** 错误信息.  */
	errorMsg? : string;

	/** Gets or sets the result.

            The result.  */
	result? : {
		itemCount: number
		pageCount: number
		pageIndex: number
		pageSize: number
		smsRecordList: IShortMessageDTO[]
	};
}
