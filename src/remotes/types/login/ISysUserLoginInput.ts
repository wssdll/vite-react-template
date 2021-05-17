export default interface ISysUserLoginInput{

	/** 手机号或用户编号.  */
	mobile? : string;

	/** 密文密码.  */
	password? : string;

	instanceId? : string;

	validate? : string;

	code? : string;
}
