import ISysMenuTree from '@/remotes/types/dto/admin/sysMenu/ISysMenuTree'
import {TreeNodeNormal} from 'antd/lib/tree/Tree'
import menus from '@/scripts/menus/source'
import {IMenu} from '@/scripts/menus'

// 所有菜单（ID:名称）权限
let permissionsMap : {[key : number] : string} = {}

// 功能权限
let operationPermissionsMap : {[key : number] : boolean} = {}

// 查看权限
let checkPermissionsMap : {[key : number] : boolean} = {}

// 区域不可用（ID）权限
let limitProvinceKeyMap : {[key : number] : boolean} = {}

// 所有菜单权限列表
let permissionsKeys : string[] = []

// 菜单树
let menusTree:TreeNodeNormal[]

// 菜单树（区域限制）
let locationLimitMenusTree:TreeNodeNormal[]

// 生成菜单权限
const generatePermissionsMap = (menus:ISysMenuTree[]) => {
	menus?.forEach(item => {
		if (item.children) {
			limitProvinceKeyMap[item.id] = !item.regionAction
			permissionsKeys.push(item.id+'')
			generatePermissionsMap(item.children)
		}
	})
}

// 生成菜单树
const generateTree = (list: IMenu[]):TreeNodeNormal[] => {
	const tree:TreeNodeNormal[] = []
	list.forEach(item => {
		permissionsMap[item.id] = item.text
		let treeNode:TreeNodeNormal = {
			title: item.text,
			key: item.id + '',
		}
		if (item.children && item.children.length > 0) {
			treeNode.children = generateTree(item.children)
		}

		tree.push(treeNode)
	})
	return tree
}

// 生成菜单树（区域限制）
const generateLocationLimitMenusTree = (list: IMenu[], parent?: TreeNodeNormal): TreeNodeNormal[] => {
	const tree:TreeNodeNormal[] = []
	list.forEach(item => {
		let disabled = limitProvinceKeyMap[item.id]
		if(disabled && parent){
			parent.disabled = true
		}

		let treeNode:TreeNodeNormal = {
			title: item.text,
			key: item.id + '',
			disabled,
		}
		if (item.children && item.children.length > 0) {
			treeNode.children = generateLocationLimitMenusTree(item.children,treeNode)
		}

		tree.push(treeNode)
	})
	return tree
}

// 获取菜单树
export const getMenusTree = (): TreeNodeNormal[] => {
	return menusTree ? menusTree : menusTree = generateTree(menus)
}

// 获取菜单树（区域限制）
export const getLocationLimitMenusTree = (): TreeNodeNormal[] => {
	return locationLimitMenusTree ? locationLimitMenusTree : locationLimitMenusTree = generateLocationLimitMenusTree(menus)
}

// 获取所有菜单权限，用于与角色列表中菜单ID匹配
export const getLocalPermissionsMap = ()=> ({...permissionsMap})

// 获取区域不可用权限，用于选择区域后，禁用权限Tree中对应的权限
export const getLimitProvinceKeyMap = ()=> ({...limitProvinceKeyMap})

// 获取所有菜单权限，用于默认展开权限Tree
export const getAllPermissionsKeys = ()=> ([...permissionsKeys])

// 判断是否有操作权限
export const hasOperationPermissions = (key: number) => {
	return operationPermissionsMap[key]
}

// 判断是否有查看权限
export const hasCheckPermissions = (key: number) => {
	return checkPermissionsMap[key]
}

