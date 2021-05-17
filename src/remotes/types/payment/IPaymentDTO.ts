import PaymentStateEnum from "@/remotes/types/payment/PaymentStateEnum";

export default interface IPaymentDTO{

	/** Gets or sets the SmsTemplateId.

            The SmsTemplateId.  */
	orderId : string;

	/** 状态.  */
	status? : PaymentStateEnum;

	/** 创建时间.  */
	createTime? : number;

	/** 短信量.  */
	smsNum? : number;

}
