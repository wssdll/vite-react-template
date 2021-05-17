import React, {useEffect} from 'react'
import {message, Layout, Menu, ConfigProvider, Modal, Dropdown, Avatar} from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import Remote from 'beyond-remote'
import redirectUrl from '@/scripts/utils/RedirectUrl'
import {PageId} from '@/scripts/components/pages'
import {IMenu, getPermissionMenus} from '@/scripts/menus'
import {triggerSideLink} from '@/scripts/stores/pageStore'
import {loaderList} from './pages/loaders'

import SideMenu from '@/scripts/components/AppComponents/SideMenu'
import IResponse from '@/remotes/types/dto/response/IResponse'
import ResponseCode from '@/remotes/types/dto/response/ResponseCode'

import Logo from '@/images/logo.svg'

import storage from 'beyond-lib/lib/storage'

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
	Redirect, withRouter, useLocation,
} from "react-router-dom";
import {RouteComponentProps} from "react-router";
import ErrorPage from "@/scripts/components/pages/others/Error";

const { Header, Content, Footer, Sider } = Layout

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

const LogoContainer = styled.div`
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

interface IAppProps extends RouteComponentProps{
	menus : IMenu[]
	appType :  'main'
	defaultPageId? : PageId
}

interface ISwitch extends RouteComponentProps {
	defaultPageId: string
}

const SwitchRouter = (props: ISwitch) => {
	let location = useLocation();
	useEffect(() => {
		let current = loaderList.find(item=>item.path === location.pathname)
		if(current){
			triggerSideLink(current.title)
		}
	}, [location])

	return <Switch>
		<Route exact path='/' render={() => (<Redirect to={props.defaultPageId}/>)}/>
		{loaderList.map(item => {
			return <Route key={item.id} path={item.path} component={item.Component}/>
		})}
		<Route component={ErrorPage}/>
	</Switch>
}

const LOCSwitch = withRouter(SwitchRouter)

export default class App extends React.Component<IAppProps, IAppState> {

	constructor(props: IAppProps) {
		super(props)
		this.state = {
			menus : [],
			collapsed:false
		}
	}

	toggle = () => {
		this.setState({
			collapsed: !this.state.collapsed,
		})
	}

	componentDidMount() {
		this.initMessageDisplay()
		this.initMenus()
	}

	redirectToLogin = ()=>{
		redirectUrl('login.html')
	}

	initMessageDisplay(){
		let displayError = false
		Remote.on('error', (e) => {
			if (e && e.response && !displayError) {
				displayError = true
				Modal.error({
					title:'错误',
					content:'系统错误，请刷新重试',
					onOk() {
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
		if(appType === 'main'){
			let current = getPermissionMenus(menus)
			this.setState({menus: current})
		}else{
			this.setState({ menus})
		}
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
				<LogoContainer style={!this.state.collapsed ? {width: 200} : {width: 80}}>
					<div>
						<img
							style={!this.state.collapsed ? {height: '32px', marginRight: '8px'} : {height: '32px'}}
							src={Logo}
							alt="logo"/>
						{<span style={!this.state.collapsed ? {opacity: 1} : {opacity: 0, width: 0}} className="logo-title">后台管理系统</span>}
					</div>
					<div style={!this.state.collapsed ? {opacity: 1} : {opacity: 0, width: 0, height: 0}} className="logo-desc">Management System</div>
				</LogoContainer>
				<SideMenu
					menus={menus}
					defaultOpenKeys={defaultOpenMenus}
					theme="dark"
					mode="inline"
				/>
			</Sider>

			<Layout className="site-layout">
				{this.renderHeader()}
				<Content style={{padding: 16}}>
					<LOCSwitch defaultPageId={this.props.defaultPageId}/>
				</Content>

				<CustomFooter>
					<div className="ant-pro-global-footer-copyright">
						Copyright <CopyrightOutlined/> {app.year} React
					</div>
				</CustomFooter>
			</Layout>
		</Layout>
		return (
			<Router>
				<ConfigProvider
					locale={zhCN}
					children={layout}
				/>
			</Router>
		)
	}
}
