import PaymentStateEnum from '@/remotes/types/payment/PaymentStateEnum'
import ISort from "@/remotes/types/utility/common/ISort";
import I__dateTimeTrans from "@/remotes/xingng/basetype/I__dateTimeTrans";
export default interface IGetPaymentListInput {

	order? : string;
	orderId? : string;

	status? : PaymentStateEnum;

	/** 开始时间.  */
	startDate? : I__dateTimeTrans;

	/** 结束时间.  */
	endDate? : I__dateTimeTrans;

	/** Gets or sets the current page.

            The current page.  */
	pageNumber? : number;

	/** Gets or sets the size of the page.

            The size of the page.  */
	pageSize? : number;

	/** Gets or sets the sorts.

            The sorts.  */
	sorts? : ISort[];
}
