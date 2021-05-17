/// cover
export default interface IPageDTO<T = null> {
	pageSize: number;
	totalNum: number;
	records: number;
	list?: T;
}
