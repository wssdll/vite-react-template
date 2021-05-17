import Remote from 'beyond-remote'
import {remote,isSuccess} from '@/remotes'
import IGetRemainResponse from './IGetRemainResponse'

export default function getRemain() : Promise<IGetRemainResponse> {
	const caller = remote.create<IGetRemainResponse>({
		url : 'account/remains',
		method : 'POST',

		remoter : getRemain
	})
	return caller().then((res : IGetRemainResponse)=>{
		if(isSuccess(res)){
			return res
		}else{
			Remote.trigger('fail',res)
			throw res
		}
	})
}
