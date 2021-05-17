import PayWayEnum from '@/remotes/types/payment/PayWayEnum'

export default interface IGetPaymentListInput {

	bundleId:number;

	payWay:PayWayEnum;

}
