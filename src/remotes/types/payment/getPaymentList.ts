import Remote from 'beyond-remote'
import {remote,serialize,isSuccess} from '@/remotes'
import IGetPaymentListResponse from './IGetPaymentListResponse'
import IGetPaymentListInput from '@/remotes/types/payment/IGetPaymentListInput'

export default function getPaymentList(input : IGetPaymentListInput) : Promise<IGetPaymentListResponse> {
	const body = serialize({input})
	const caller = remote.create<IGetPaymentListResponse>({
		url : 'account/rechargeList',
		method : 'POST',
		body,
		remoter : getPaymentList
	})
	return caller().then((res : IGetPaymentListResponse)=>{
		if(isSuccess(res)){
			return res
		}else{
			Remote.trigger('fail',res)
			throw res
		}
	})
}
