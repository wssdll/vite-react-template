export default interface ISysUserLoginResult{

	/** Gets or sets the token.

            The token.  */
	token : string;

	mobile : string;

	username : string;

	/** 用户名.  */
	nickName : string;

	/** 工号.  */
	userCode : string;

	/** Is SuperUser  */
	isSuperUser : number;
}
