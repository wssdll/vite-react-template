import Remote from 'beyond-remote'
import {remote,isSuccess} from '@/scripts/remotes'

import ISysLogoutResponse from './ISysLogoutResponse'
/** 系统用户退出登录. */
export default function sysLogout() : Promise<ISysLogoutResponse> {

	const caller = remote.create<ISysLogoutResponse>({
		url : 'sysuserlogin/syslogout',
		method : 'POST',

		remoter : sysLogout
	})
	return caller().then((res : ISysLogoutResponse)=>{
		if(isSuccess(res)){
			return res
		}else{
			Remote.trigger('fail',res)
			throw res
		}
	})
}
