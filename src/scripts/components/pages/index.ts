export interface IPage {
	id: PageId
	title: string
}

export type PageId = keyof typeof pages


const pages = {

	index: {
		id: 'index',
		title: '首页',

	},

	userProfile: {
		id: 'userProfile',
		title: '个人中心',

	},

	shortMessageManage: {
		id: 'shortMessageManage',
		title: '短信管理',

	},

	payment: {
		id: 'payment',
		title: '充值',

	},

	paymentList: {
		id: 'paymentList',
		title: '充值记录',

	},

}


export default pages as ({ [key in PageId]: IPage })
