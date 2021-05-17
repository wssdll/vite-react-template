import pages from '.'
import { load } from './loader'

export default {

	[pages.userProfile.id]: load(() => import('./userProfile/Main')),

	[pages.shortMessageManage.id]: load(() => import('./shortMessage/List')),

	[pages.payment.id]: load(() => import('./payment/Main')),

	[pages.paymentList.id]: load(() => import('./payment/List')),

}
