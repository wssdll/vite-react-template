import Remote from 'beyond-remote'
import {remote,serialize,isSuccess} from '@/remotes'
import ICreatePaymentResponse from './ICreatePaymentResponse'
import ICreatePaymentInput from '@/remotes/types/payment/ICreatePaymentInput'

export default function createPayment(input : ICreatePaymentInput) : Promise<ICreatePaymentResponse> {
	const body = serialize({input})
	const caller = remote.create<ICreatePaymentResponse>({
		url : 'account/acquiring',
		method : 'POST',
		body,
		remoter : createPayment
	})
	return caller().then((res : ICreatePaymentResponse)=>{
		if(isSuccess(res)){
			return res
		}else{
			Remote.trigger('fail',res)
			throw res
		}
	})
}
