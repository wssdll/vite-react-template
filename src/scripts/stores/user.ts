import ISysUserLoginResult from '@/remotes/types/login/ISysUserLoginResult'
import storage from 'beyond-lib/lib/storage'

export const getLocalUser: () => ISysUserLoginResult = () => storage.get('userInfo') || {}

export const getColumnsStateStore = () => {
	const userCode = getLocalUser().mobile
	return storage.get('columnsState')?.[userCode]
}

export const setColumnsStateStore = (value: { [key: string]: any }) => {
	const userCode = getLocalUser().mobile
	let store = storage.get('columnsState')
	if (store) {
		store[userCode] = {
			...store[userCode],
			...value
		}
	} else {
		store = {[userCode]: value}
	}
	storage.set('columnsState', store)
}

export const setUser = (result: ISysUserLoginResult) => {
	storage.set('userInfo', result)
}
