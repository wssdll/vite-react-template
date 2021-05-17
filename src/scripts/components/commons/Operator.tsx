import React from 'react'
import { Dropdown, Menu, Divider, Popconfirm } from 'antd'
import { hasOperationPermissions } from '@/scripts/stores/permissions'

import {
	DownOutlined,
} from '@ant-design/icons'
import {MenuEnum} from '@/scripts/menus'

//如果采用数组的形式添加 children ，则需要全部打平
export function childrenToPlainArray(children: React.ReactNode, newChildren: React.ReactNode[] = []) {
	if (Array.isArray(children)) {
		for (let child of children) {
			if (Array.isArray(child)) {
				childrenToPlainArray(child, newChildren)
			} else if (child) {
				newChildren.push(child)
			}
		}
	} else if (children) {
		newChildren.push(children)
	}
	return newChildren
}

export function childrenToPlainReactElementArray<T>(children: React.ReactNode) {
	return childrenToPlainArray(children).filter((child) => React.isValidElement(child)) as React.ReactElement<T>[]
}

export interface IOperatorProps {
	onClick: (params: { key: React.Key, data? : any }) => void
	max? : number
	moreText? : React.ReactNode
}

interface IOperatorItemProps {
	children: React.ReactNode
	enabled? : boolean
	confirm? : boolean
	confirmTitle? : React.ReactNode
	permissions? : MenuEnum
	data? : any
}

export const POPCONFIRM_DEFAULT_TITLE = '确认当前操作？'


const Item: React.SFC<IOperatorItemProps> = (_props: IOperatorItemProps) => null

export default class Operator extends React.Component<IOperatorProps, any> {

	static defaultProps =  {
		max : 99,
		moreText : '更多'
	}

	static Item = Item

	constructor(props: IOperatorProps) {
		super(props)
		this.state = {
			popconfirmVisible: false // 因 popconfirm 在 dropDrown 组件里的时候，若失去了点击元素，会自动消失，故手动控制显示隐藏
		}
	}

	handlerClick = (item: React.ReactElement<IOperatorItemProps>) => {
		if(!this.props.onClick) {
			this.setState({ popconfirmVisible: false })
			return
		}

		// 如果是有确认框的情况下，不关闭 popconfirm，反之关闭
		if (item.props.confirm) {
			this.props.onClick({ key: item.key, data: item.props.data })
		} else {
			this.setState({ popconfirmVisible: false }, () => {
				this.props.onClick({ key: item.key, data: item.props.data })
			})
		}
	}

	handleDropdownVisibleChange = (visible: boolean) => {
		this.setState({ popconfirmVisible: visible })
	}

	renderPopconfirm(item: React.ReactElement<IOperatorItemProps>) {
		let { confirmTitle, confirm, children } = item.props
		confirmTitle = confirmTitle || POPCONFIRM_DEFAULT_TITLE
		return confirm ? (
			<Popconfirm
				key={item.key}
				title={confirmTitle}
				onConfirm={this.handlerClick.bind(this, item)}>
					<a>{children}</a>
			</Popconfirm>
		) : <a key={item.key} onClick={this.handlerClick.bind(this, item)}>{children}</a>
	}

	public render() {
		let { popconfirmVisible } = this.state
		const items = childrenToPlainReactElementArray<IOperatorItemProps>(this.props.children).filter((item)=> {
			let result = item.props.enabled !== false
			if(result && item.props.permissions) {
				result = hasOperationPermissions(item.props.permissions)
			}
			return result
		})
		let max = Math.abs(this.props.max)
		let outItems = max === 0 ? items.slice(0) : items.slice(0, max - 1)
		let inMoreItems = max === 0 ? [] : items.slice(max - 1)

		let outOperators : JSX.Element[] = []
		let moreOperator : JSX.Element
		outItems.forEach((item, i) => {
			outOperators.push(this.renderPopconfirm(item))
			if((i === outItems.length - 1 && inMoreItems.length > 0) || i < outItems.length - 1) {
				outOperators.push(<Divider key={`$divider${i}`} style={{margin: '0 6px'}} type="vertical" />)
			}
		})

		if(inMoreItems.length > 0) {
			if(inMoreItems.length === 1) {
				let item = inMoreItems[0]
				moreOperator = this.renderPopconfirm(item)
			} else {
				let mores = inMoreItems.map((item)=> {
					let menuItem = this.renderPopconfirm(item)
					return <Menu.Item key={item.key}>{menuItem}</Menu.Item>
				})
				moreOperator = (
					<Dropdown
						overlay={<Menu>{mores}</Menu>}
						onVisibleChange={this.handleDropdownVisibleChange}
						visible={popconfirmVisible}
					>
						<a>{this.props.moreText}<DownOutlined style={{transform: 'scale(.83333333)'}}/></a>
					</Dropdown>
				)
			}
		}
		return (
			<span style={{wordBreak: 'keep-all'}}>
				{outOperators}
				{moreOperator}
			</span>
		)
	}
}
