import OrderBy from '@/remotes/types/utility/common/enums/OrderBy'
export default interface ISort{

	/** Gets or sets the sort key.

            The sort key.  */
	sortKey? : string;

	/** Gets or sets the sort dir.

            The sort dir.  */
	sortDir : OrderBy;
}
