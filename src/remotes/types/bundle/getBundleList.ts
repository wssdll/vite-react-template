import Remote from 'beyond-remote'
import {remote, isSuccess, serialize} from '@/remotes'
import IGetBundleListResponse from './IGetBundleListResponse'
import IGetBundleListInput from '@/remotes/types/bundle/IGetBundleListInput'

export default function getBundleList(input : IGetBundleListInput) : Promise<IGetBundleListResponse> {
	const body = serialize({input})
	const caller = remote.create<IGetBundleListResponse>({
		url : 'account/bundleList',
		method : 'POST',
		body,
		remoter : getBundleList
	})
	return caller().then((res : IGetBundleListResponse)=>{
		if(isSuccess(res)){
			return res
		}else{
			Remote.trigger('fail',res)
			throw res
		}
	})
}
