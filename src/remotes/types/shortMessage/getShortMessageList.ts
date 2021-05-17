import Remote from 'beyond-remote'
import {remote,serialize,isSuccess} from '@/remotes'
import IGetShortMessageListResponse from './IGetShortMessageListResponse'
import IGetShortMessageListInput from '@/remotes/types/shortMessage/IGetShortMessageListInput'

export default function getShortMessageList(input : IGetShortMessageListInput) : Promise<IGetShortMessageListResponse> {
	const body = serialize({input})
	const caller = remote.create<IGetShortMessageListResponse>({
		url : 'sms/getSmsRecordForWeb',
		method : 'POST',
		body,
		remoter : getShortMessageList
	})
	return caller().then((res : IGetShortMessageListResponse)=>{
		if(isSuccess(res)){
			return res
		}else{
			Remote.trigger('fail',res)
			throw res
		}
	})
}
