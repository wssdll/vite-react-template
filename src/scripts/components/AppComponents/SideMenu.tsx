import React from 'react'
import { Menu } from 'antd'
import {IMenu, MenuEnum} from '@/scripts/menus'
import PageLink from '@/scripts/components/commons/PageLink'
import {MenuProps} from 'antd/lib/menu'
import {SettingOutlined, BankOutlined, BarChartOutlined} from '@ant-design/icons'
import {Link} from "react-router-dom";


const {SubMenu} = Menu

interface ISideMenuProps extends MenuProps {
	menus: IMenu[]
}

const IconMap: { [key: number]: React.ReactElement } = {
	[MenuEnum.UserProfile]: <SettingOutlined/>,
	[MenuEnum.ShortMessageManage]: <BankOutlined />,
	[MenuEnum.PaymentManage]: <BarChartOutlined />,
}

const SideMenu = ({ menus ,...rest}: ISideMenuProps) => {
	menus = menus || []
	return (
		<Menu {...rest}>
			{menus.filter((item) => item && !item.disabled).map((firstItem: IMenu, i: number) => {
				if(firstItem.Page) {
					return MenuItem({menu : firstItem, key : i+''})
				} else if (firstItem.children) {
					return (
						<SubMenu
							icon={IconMap[firstItem.id]}
							title={firstItem.text}
							key={firstItem.id}>
							{parseMenus(firstItem.children,i+'')}
						</SubMenu>
					)
				}
			})}
		</Menu>
	)
}

const MenuItem = ({menu,key} : { menu : IMenu, key : string}) => {
	return (
		<Menu.Item key={key} icon={IconMap[menu.id]}>
			<Link title={menu.title} to={menu.path} >{menu.text}</Link>
		</Menu.Item>
	)
}

function parseMenus(subMenu: IMenu[],prefix : string) : React.ReactNode {
	return subMenu.filter((item: IMenu) => item && !item.disabled).map((menuItem: IMenu, i: number) => {
		if(menuItem.Page && !menuItem.hidden) {
			return MenuItem({menu : menuItem, key : prefix + i})
		} else if (menuItem.children) {
			return (
				<SubMenu title={menuItem.text} key={menuItem.text}>
					{parseMenus(menuItem.children,prefix + i)}
				</SubMenu>
			)
		}
	})
}

export default SideMenu
