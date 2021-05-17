import Remote from 'beyond-remote'
import {remote,serialize,isSuccess} from '@/remotes'
import IUpdateUserInfoResponse from './IUpdateUserInfoResponse'
import IUpdateUserInfoInput from '@/remotes/types/user/IUpdateUserInfoInput'

export default function updateUserInfo(input : IUpdateUserInfoInput) : Promise<IUpdateUserInfoResponse> {
	const body = serialize({input})
	const caller = remote.create<IUpdateUserInfoResponse>({
		url : 'user/update',
		method : 'POST',
		body,
		remoter : updateUserInfo
	})
	return caller().then((res : IUpdateUserInfoResponse)=>{
		if(isSuccess(res)){
			return res
		}else{
			Remote.trigger('fail',res)
			throw res
		}
	})
}
