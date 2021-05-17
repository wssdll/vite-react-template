import pages from '.'
import { load } from './loader'

const loader = {

	[pages.userProfile.id]: load(() => import('./userProfile/Main')),

	[pages.shortMessageManage.id]: load(() => import('./shortMessage/List')),

	[pages.payment.id]: load(() => import('./payment/Main')),

	[pages.paymentList.id]: load(() => import('./payment/List')),

}

export default loader

export const loaderList = [
	{
		id:[pages.userProfile.id],
		title:[pages.userProfile.title],
		path:'/userProfile',
		Component:load(() => import('./userProfile/Main')),
	}, {
		id:[pages.shortMessageManage.id],
		title:[pages.shortMessageManage.title],
		path:'/shortMessage',
		Component:load(() => import('./shortMessage/List')),
	}, {
		id:[pages.payment.id],
		title:[pages.payment.title],
		path:'/payment',
		Component:load(() => import('./payment/Main')),
	}, {
		id:[pages.paymentList.id],
		title:[pages.paymentList.title],
		path:'/paymentList',
		Component:load(() => import('./payment/List')),
	},

]
