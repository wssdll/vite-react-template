export default interface ISysMenuTree{
	children? : ISysMenuTree[];

	/** Gets or sets iD.  */
	id : number;

	/** Gets or sets 菜单名称.  */
	menuName? : string;

	/** Gets or sets 父菜单id.  */
	parentId : number;

	/** Gets or sets 菜单路由.  */
	menuUrl? : string;

	/** Gets or sets 菜单权限.  */
	roleMenuType : number;

	/** 区域操作.  */
	regionAction : number;
}