import BundleEnum from "@/remotes/types/bundle/BundleEnum"

export default interface IBundleDTO{

	id : number;

	createTime : string;

	currentPrice? : number;

	originalPrice? : number;

	slogan? : number;

	/** 短信量.  */
	smsNum? : number;

	status? : BundleEnum;

	tag? : string;

	title? : string;

	version? : number;

}
