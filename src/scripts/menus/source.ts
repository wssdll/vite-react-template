import {IMenu, MenuEnum} from '@/scripts/menus'
import pages from '@/scripts/components/pages'

const menus = [
	{
		id: MenuEnum.UserProfile,
		Page: pages.userProfile.id,
		path:'/userProfile',
		text: '个人中心',
	},{
		id: MenuEnum.ShortMessageManage,
		Page: pages.shortMessageManage.id,
		path:'/shortMessage',
		text: '短信管理',
	}, {
		id: MenuEnum.PaymentManage,
		text: '充值管理',
		children: [{
			id: MenuEnum.Payment,
			Page: pages.payment.id,
			path:'/payment',
			text: '充值',
		}, {
			id: MenuEnum.PaymentList,
			Page: pages.paymentList.id,
			path:'/paymentList',
			text: '充值记录',
		}]
	}
] as IMenu[]

export default menus
