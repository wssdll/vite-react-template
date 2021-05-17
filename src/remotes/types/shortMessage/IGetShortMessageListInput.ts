import I__dateTimeTrans from "@/remotes/xingng/basetype/I__dateTimeTrans";
import ISort from "@/remotes/types/utility/common/ISort";
import ShortMessageEnum from "@/remotes/types/shortMessage/ShortMessageEnum";
export default interface IGetShortMessageListInput {

	asc?:boolean

	searchValue? : string;

	status? : ShortMessageEnum;

	/** 开始时间.  */
	fromDateTime? : I__dateTimeTrans;

	/** 结束时间.  */
	toDateTime? : I__dateTimeTrans;

	/** Gets or sets the current page.

            The current page.  */
	pageIndex : number;

	/** Gets or sets the size of the page.

            The size of the page.  */
	pageSize : number;

	/** Gets or sets the sorts.

            The sorts.  */
	sorts? : ISort[];
}
