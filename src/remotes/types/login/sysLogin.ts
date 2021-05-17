import {remote,serialize} from '@/scripts/remotes'
import ISysLoginResponse from './ISysLoginResponse'
import ISysUserLoginInput from '@/remotes/types/login/ISysUserLoginInput'
import ILoginHeader from '@/remotes/types/login/ILoginHeader'
/** 系统用户登录. */
export default function sysLogin(input: ISysUserLoginInput, headers: ILoginHeader): Promise<ISysLoginResponse> {
	const body = serialize({input})
	const caller = remote.create<ISysLoginResponse>({
		url: 'user/login',
		method: 'POST',
		body,
		headers,
		remoter: sysLogin
	})
	return caller().then((res : ISysLoginResponse)=>{
		// if(isSuccess(res)){
			return res
		// }else{
		// 	Remote.trigger('fail',res)
		// 	throw res
		// }
	})
}
