import Remote from 'beyond-remote'
import {remote,serialize,isSuccess} from '@/remotes'
import ISmsBatchExportResponse from './ISmsBatchExportResponse'
import IGetShortMessageListInput from '@/remotes/types/shortMessage/IGetShortMessageListInput'

export default function smsBatchExport(input : IGetShortMessageListInput) : Promise<ISmsBatchExportResponse> {
	const body = serialize({input})
	const caller = remote.create<ISmsBatchExportResponse>({
		url : 'sms/batchExportToExcel',
		method : 'POST',
		body,
		remoter : smsBatchExport
	})
	return caller().then((res : ISmsBatchExportResponse)=>{
		if(isSuccess(res)){
			return res
		}else{
			Remote.trigger('fail',res)
			throw res
		}
	})
}
