import { PageId } from '@/scripts/components/pages'
import ISysMenuTree from '@/remotes/types/dto/admin/sysMenu/ISysMenuTree'

export enum MenuEnum {
	UserProfile = 2,
	ShortMessageManage,
	PaymentManage,
	Payment,
	PaymentList,
}

export interface IMenu {
	id: MenuEnum
	text : string;
	Page? : PageId;
	children? : IMenu[];
	disabled? : boolean;
	params? : object
	title? : string
	hidden? : string
	path? : string
}

let permissionsMap : {[key : number] : boolean} = {}

const getMenus = (menus: ISysMenuTree[]) => {
	menus?.forEach(item => {
		permissionsMap[item.id] = true
	})
}

export function getPermissionMenus(menus : IMenu[]=[], permissions? : ISysMenuTree[] ) : IMenu[]{
	if(permissions && permissions.length > 0){
		getMenus(permissions)
		getInPermissionMenusCount(permissionsMap,menus)
	}
	return menus
}

function getInPermissionMenusCount(permissionsMap :  {[key : number] : boolean},menus : IMenu[], parent? : IMenu){
	let count = menus.length
	menus.forEach((item)=>{
		if((item.children && getInPermissionMenusCount(permissionsMap,item.children,item) === 0)
			|| (item.Page && !permissionsMap[item.id])
			|| (!item.Page && item.children == null)
		){
			item.disabled = true
			count--
		}
	})
	if(count === 0 && parent){
		parent.disabled = true
	}
	return count
}
