import React from 'react'
import {message, Layout, Menu, ConfigProvider, Modal, Dropdown, Avatar, Tabs} from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import Remote from 'beyond-remote'
import redirectUrl from '@/scripts/utils/RedirectUrl'
import pages, { PageId } from '@/scripts/components/pages'
import {IMenu, getPermissionMenus} from '@/scripts/menus'
import pageStore, { getPageInstanceProps, IPageInstance } from '@/scripts/stores/pageStore'
import loaders from './pages/loaders'
import ErrorPage from './pages/others/Error'

import SideMenu from '@/scripts/components/AppComponents/SideMenu'
import IResponse from '@/remotes/types/dto/response/IResponse'
import ResponseCode from '@/remotes/types/dto/response/ResponseCode'

import LoginLogo from '@/images/login-logo.png'

import storage from 'beyond-lib/lib/storage'

import '@/styles/style.less'

import {
	UserOutlined,
	MenuUnfoldOutlined,
	MenuFoldOutlined,
	LogoutOutlined,
	CopyrightOutlined
} from '@ant-design/icons'
import styled from 'styled-components'

import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout

const {TabPane} = Tabs


const HeaderMenu = styled(Menu)`
    color: #bfbfbf;
`

const CustomHeader = styled(Header)`
  display: flex;
  padding: 0;
  position: relative;
  justify-content: space-between;
`

const Trigger = styled.div`
  color: white !important;
  line-height: 64px !important;
  font-size: 18px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #696969 !important;
  }
`

const CustomFooter = styled(Footer)`
  margin: 32px 0 24px;
  padding: 0 16px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  text-align: center;
  user-select: none;
`

const User = styled.div`
  color: white;

  .user-action {
    cursor: pointer;
    padding: 0 12px;
    display: inline-block;
    height: 100%;
    color: inherit;

    .user-avatar {
      margin-right: 8px;
      background: #334454;

      > i {
        font-size: 24px !important;
      }
    }
  }
`

const Logo = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  font-size: 16px;
  color: white;
  white-space: nowrap;
  transition: all 0.3s;
  
  .logo-title{
    overflow: hidden;
    display: inline-flex;
    transition: opacity 0.3s;
  }
  
  .logo-desc{
    overflow: hidden;
    display: inline-flex;
    font-size: 12px;
    transition: opacity 0.3s;
  }
  
`


let defaultOpenMenus: string[] = []
const getMenus = (menus: IMenu[]) => {
	menus && menus.forEach(item => {
		if (item.children) {
			defaultOpenMenus.push(item.id + '')
			getMenus(item.children)
		}
	})
}



interface IAppState {
	menus : IMenu[]

	collapsed:boolean
}

interface IAppProps {
	menus : IMenu[]
	appType :  'sfa' | 'domain'
	defaultPageId? : PageId
}

export default class App extends React.Component<IAppProps, IAppState> {

	isActive: boolean

	// 页面是否为初始化状态，默认为false
	isInit: boolean = false

	off: ()=> void

	loadingOff : ()=>void

	constructor(props: IAppProps) {
		super(props)
		this.isActive = false
		this.state = {
			menus : [],
			collapsed:false
		}
		pageStore.init(props.appType,props.defaultPageId)
	}


	toggle = () => {
		this.setState({
			collapsed: !this.state.collapsed,
		})
	}

	componentDidMount() {
		this.initMessageDisplay()
		this.initMenus()
		this.off = pageStore.onUpdate(this.handlerUpdate)
	}

	componentWillUnmount() {
		this.off()
	}

	componentDidUpdate() {
		if (process.env.NODE_ENV !== 'production') {
			this.off()
			this.off = pageStore.onUpdate(this.handlerUpdate)
		}
	}

	redirectToLogin = ()=>{
		redirectUrl('login.html', '/home/login')
	}

	initMessageDisplay(){
		let displayError = false
		Remote.on('error', (e) => {
			if (e && e.response && !displayError) {
				displayError = true
				let title = '错误'
				let content: string
				let onOk : ()=>void
				// if (e.response.status === 403) {
				// 	// 状态为401或者403时，如果页面是未初始化的状态，则直接跳转。否则弹出提示
				// 	if (!this.isInit) {
				// 		this.redirectToLogin()
				// 		return
				// 	} else {
				// 		content = '当前登录信息已经失效，请重新登录'
				// 		onOk = this.redirectToLogin
				// 	}
				// } else if (e.response.status === 401) {
				// 	content = '无权限，请联系管理员'
				// } else if (e.response.status === 408) {
				// 	content = '操作失败，请重试'
				// } else {
					content = '系统错误，请刷新重试'
				// }
				Modal.error({
					title,
					content,
					onOk() {
						if(onOk){
							onOk()
						}
						displayError = false
					}
				})

			} else {
				message.error('请求失败，请检查网络')
			}
		})

		Remote.on('fail', (e) => {
			let data = (e && e.data ? e.data : {}) as IResponse<any>
			let content
			if (data.errorCode === ResponseCode.TokenError) {
				Modal.warn({
					title: '登录过期',
					content: '登录已过期，请重新登录',
					onOk: () => {
						this.redirectToLogin()
					}
				})
			} else {
				content = (data.errorMsg || '系统错误，请重试')
			}
			if(content){
				message.error(content)
			}
		})
	}

	initMenus(){
		const {appType,menus} = this.props
		if(appType === 'sfa'){

			let current = getPermissionMenus(menus)
			this.setState({menus: current})

			// let permissions : ISysMenuTree[] = getPermissions()
			// if(permissions){
			// 	// 主页面的API请求完成后，进入系统时置为true
			// 	this.isInit = true
			//
			// 	if(!permissions || permissions.length === 0){
			// 		Modal.info({
			// 			title : '提示',
			// 			content : '没有权限，请重新注销登录或者联系域管理员添加相应权限'
			// 		})
			// 	}else{
			// 		let current = getPermissionMenus(menus, permissions)
			// 		this.setState({menus: current})
			// 	}
			// }
			//
			// getAllPermissions()
		}else{
			this.setState({ menus})
		}
	}

	handlerUpdate = () => {
		this.setState({})
	}

	onMenuClick(event: any) {
		let {key} = event
		if (key === 'logout') {
			this.handleUserLogout()
		}
	}

	handleUserLogout() {
		storage.removeCookie('x-auth-mobile')
		storage.removeCookie('x-auth-userName')
		storage.removeCookie('x-auth-token')
		this.redirectToLogin()
	}

	handlerCloseTabPane = (key: React.MouseEvent | React.KeyboardEvent | string) => {
		if(typeof key === 'string'){
			pageStore.remove(key)
		}
	}

	handlerContextMenuClick = (page: IPageInstance<any>, event: any) => {
		let {key} = event
		if(process.env.NODE_ENV === 'development'){
			if(key === 'copy'){
				const input = document.createElement('input')
				document.body.appendChild(input)
				input.setAttribute('value', page.pageId)
				input.select()
				document.execCommand('copy')
				document.body.removeChild(input)

			}else if( key === 'removeAll'){
				pageStore.removeAll()
			}
		}
		if (key === 'current') {
			pageStore.remove(page)
		} else if (key === 'others') {
			pageStore.removeOthers(page)
		} else if (key === 'left') {
			pageStore.removeLeft(page)
		} else if (key === 'right') {
			pageStore.removeRight(page)
		} else if (key === 'refresh') {
			pageStore.refresh(page)
		}
	}

	renderRightClickMenus(pageInstance :  IPageInstance<any>,index : number){
		const isIndex = pageInstance.pageId === this.props.defaultPageId
		const isSecond = index === 1
		return (
			<Menu onClick={this.handlerContextMenuClick.bind(this, pageInstance)}>
				{process.env.NODE_ENV === 'development' && <Menu.Item key="copy">{pageInstance.pageId}</Menu.Item>}
				{process.env.NODE_ENV === 'development' && <Menu.Item key="removeAll">关闭所有</Menu.Item>}
				<Menu.Item key="refresh">刷新</Menu.Item>
				<Menu.Divider />
				{!isIndex && <Menu.Item key="current">关闭标签页</Menu.Item>}
				<Menu.Item key="others">关闭其它标签页</Menu.Item>
				{!isIndex && !isSecond && <Menu.Item key="left">关闭左侧标签页</Menu.Item>}
				{!isIndex && <Menu.Item key="right">关闭右侧标签页</Menu.Item>}

			</Menu>
		)
	}


	renderUserOperates(){
		return (
			<HeaderMenu onClick={this.onMenuClick.bind(this)}>
				<Menu.Item key="logout"><LogoutOutlined />退出登录</Menu.Item>
			</HeaderMenu>
		)
	}

	renderHeader() {
		return (
			<CustomHeader>
				<Trigger onClick={this.toggle}>
					{this.state.collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
				</Trigger>
				<User>
					<Dropdown overlay={this.renderUserOperates()}>
						<span className="user-action">
							<Avatar className="user-avatar" icon={<UserOutlined/>}/>
							<span>欢迎你，{storage.getCookie('x-auth-userName')}</span>
						</span>
					</Dropdown>
				</User>
			</CustomHeader>
		)
	}

	render() {
		const {menus} = this.state
		const pageInstances = menus ? pageStore.instances : []

		if (defaultOpenMenus.length === 0) {
			getMenus(menus)
		}

		const layout = <Layout
			style={{minHeight:'100%'}}>
			<Sider
				breakpoint="sm"
				theme="dark"
				width={256}
				className="ant-pro-sider-menu-sider"
				onCollapse={(collapsed:boolean)=>{
					this.setState({collapsed})
				}}
				trigger={null} collapsible collapsed={this.state.collapsed}>
				<Logo style={!this.state.collapsed ? {width: 200} : {width: 80}}>
					<div>
						<img
							style={!this.state.collapsed ? {height: '32px', marginRight: '8px'} : {height: '32px'}}
							src={LoginLogo}
							alt="logo"/>
						{<span style={!this.state.collapsed ? {opacity: 1} : {opacity: 0, width: 0}} className="logo-title">后台管理系统</span>}
					</div>
					<div style={!this.state.collapsed ? {opacity: 1} : {opacity: 0, width: 0, height: 0}} className="logo-desc">FDD Management System</div>
				</Logo>
				<SideMenu
					menus={menus}
					defaultOpenKeys={defaultOpenMenus}
					theme="dark"
					mode="inline"
				/>
			</Sider>

			<Layout className="site-layout">
				{this.renderHeader()}
				<Content
					style={{padding: 16,}}
				>

					<Tabs
						// destroyInactiveTabPane
						animated={false}
						hideAdd
						activeKey={pageStore.activeId}
						type="editable-card"
						onEdit={this.handlerCloseTabPane}
						onChange={(pageInstanceId) => pageStore.active(pageInstanceId)}
					>
						{pageInstances
							.filter((item) => pages[item.pageId])
							.map((pageInstance,i) => {
								const Component = loaders[pageInstance.pageId]
								const isHome = pageInstance.pageId === this.props.defaultPageId

								const tabTitle = (
									<Dropdown overlay={this.renderRightClickMenus(pageInstance,i)} trigger={['contextMenu']}>
										<span>{pageInstance.title}</span>
									</Dropdown>
								)

								return (
									<TabPane key={pageInstance.id} tab={tabTitle} closable={!isHome}>
										{Component ?  <Component page={getPageInstanceProps(pageInstance)} /> : <ErrorPage />}
									</TabPane>
								)
							})}
					</Tabs>
				</Content>
				<CustomFooter>
					<div className="ant-pro-global-footer-copyright">
						Copyright <CopyrightOutlined/> {app.year} Present
					</div>
				</CustomFooter>
			</Layout>
		</Layout>
		return (
			<>
				<ConfigProvider
					locale={zhCN}
					children={layout}
				/>
			</>
		)
	}
}
