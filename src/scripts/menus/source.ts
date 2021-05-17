import {IMenu, MenuEnum} from '@/scripts/menus'
import pages from '@/scripts/components/pages'

const menus = [
	{
		id: MenuEnum.UserProfile,
		Page: pages.userProfile.id,
		text: '个人中心',
	},{
		id: MenuEnum.ShortMessageManage,
		Page: pages.shortMessageManage.id,
		text: '短信管理',
	}, {
		id: MenuEnum.PaymentManage,
		text: '充值管理',
		children: [{
			id: MenuEnum.Payment,
			Page: pages.payment.id,
			text: '充值',
		}, {
			id: MenuEnum.PaymentList,
			Page: pages.paymentList.id,
			text: '充值记录',
		}]
	}
] as IMenu[]

export default menus
