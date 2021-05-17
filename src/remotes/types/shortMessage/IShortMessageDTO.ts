import ShortMessageEnum from "@/remotes/types/shortMessage/ShortMessageEnum";

export default interface IShortMessageDTO {

	/** Gets or sets the SmsTemplateId.

            The SmsTemplateId.  */
	id : number;

	/** 状态.  */
	status? : ShortMessageEnum;

	/** 创建时间.  */
	sendDate? : number;

	phoneNumber? : number;

	shelfNumber? : number;

	content? : number;

}
