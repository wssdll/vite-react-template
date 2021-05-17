import React, {useState, useEffect} from 'react'
import {Button, Checkbox, Form, Input, message} from 'antd'

import GlobalFooter from '@/scripts/components/commons/GlobalFooter'

import Remote from 'beyond-remote'
import redirectUrl from '@/scripts/utils/RedirectUrl'

import {
	UserOutlined,
	LockOutlined,
	CopyrightOutlined,
} from '@ant-design/icons'
import {FormProps} from 'antd/lib/form'
import {setUser} from '@/scripts/stores/user'

import styled from 'styled-components'

// @ts-ignore
import md5 from 'blueimp-md5'
import {sha256} from 'js-sha256'
import sysLogin from '@/remotes/types/login/sysLogin'
import ILoginHeader from '@/remotes/types/login/ILoginHeader'

import ISysUserLoginInput from '@/remotes/types/login/ISysUserLoginInput'

import storage from 'beyond-lib/lib/storage'
import './LoginApp.less'

import LoginLogo from '@/images/login-logo.png'


const StyledImg = styled.img`
  height: 84px;
  margin-right: 20px;
`

export const ContainerDiv = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;

  background: #f0f2f5;
  background-image: url(https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
`

const ContentDiv = styled.div`
  padding: 32px 0 24px;
  flex: 1 1;
`

const LangDiv = styled.div`
  height: 40px;
`

const TopDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 75px;
`

const HeaderDiv = styled.div`

`

const TitleDiv = styled.div`
  color: rgba(0, 0, 0, 0.85);
  font-weight: 600;
  font-size: 33px;
  margin-bottom: 4px;
`

const DescDiv = styled.div`
  color: rgba(0, 0, 0, 0.5);
  text-align: center;
`

const MainDiv = styled.div`
  width: 368px;
  margin: 0 auto;
`

const FooterDiv = styled.div`
  position: absolute;
  width: 100%;
  bottom: 0;
  margin: 32px 0 24px;
`


interface IFormValueType {
	mobile: string
	password: string
	remember: boolean
}

const LoginForm = (props: FormProps) => {
	const [form] = Form.useForm()
	const [updating, setUpdating] = useState<boolean>(false)

	useEffect(() => {
		Remote.on('fail', (e) => {
			message.error(e && e.data.errorMsg)
		})
	}, [])

	const onFinish = async (query: ISysUserLoginInput) => {
		const fieldsValue = await form.validateFields()
		const {mobile, password} = fieldsValue as IFormValueType

		let deviceId = md5(navigator.userAgent)
		let deviceName = navigator.appName
		let systemType = 'web'
		let timestamp = new Date().valueOf().toString()
		let systemVersion = navigator.platform
		let appVersion = '1.0'

		let encryptPassword = md5(password) + deviceId + systemType + systemVersion + timestamp

		let {validate, code, instanceId} = query

		let parameters = {
			code,
			validate,
			instanceId,
			mobile,
			password: sha256(encryptPassword.toUpperCase()),
		}

		let headers: ILoginHeader = {
			'X-DeviceId': deviceId,
			'X-DeviceName': deviceName,
			'X-SystemType': systemType,
			'X-Timestamp': timestamp,
			'X-SystemVersion': systemVersion,
			'X-AppVersion': appVersion
		}

		setUpdating(true)

		let {status, result, errorCode, errorMsg} = await sysLogin(parameters, headers)

		if (status) {
			let {token, username} = result
			setUser(result)

			storage.setCookie('x-auth-mobile', mobile)
			storage.setCookie('x-auth-userName', username)
			storage.setCookie('x-auth-token', token)
			storage.remove('pages')
			storage.remove('activePageId')
			redirectUrl('index.html', '/home/index')

		} else {
			message.error(errorMsg || '请求错误，请重试')
		}
		setUpdating(false)
	}

	return (
		<Form
			{...props}
			form={form}
			initialValues={{
				remember: true,
			}}
			onFinish={onFinish}
		>
			<Form.Item
				name="mobile"
				rules={[
					{required: true, message: '请输入手机号码',},
					{pattern: /^1\d{10}$/, message: '请输入正确格式的手机号'}
				]}
			>
				<Input size="large" prefix={<UserOutlined className="prefixIcon"/>} placeholder="请输入注册手机号"/>
			</Form.Item>

			<Form.Item
				name="password"
				rules={[{required: true, message: '请输入密码'}]}
			>
				<Input.Password size="large" prefix={<LockOutlined className="prefixIcon"/>} placeholder="请输入密码"
								visibilityToggle/>
			</Form.Item>

			<Form.Item name="remember" valuePropName="checked">
				<Checkbox>自动登录</Checkbox>
			</Form.Item>
			<Form.Item>
				<Button size="large"
						loading={updating}
						type="primary"
						htmlType="submit"
						style={{width: '100%'}}>
					登录
				</Button>
			</Form.Item>
		</Form>
	)
}

const LoginApp = () => {
	return (
		<ContainerDiv>
			<LangDiv/>
			<ContentDiv>
				<TopDiv>
					<StyledImg src={LoginLogo} alt="logo"/>
					<HeaderDiv>
						<TitleDiv>短信管理系统</TitleDiv>
						<DescDiv>web端短信管理系统</DescDiv>
					</HeaderDiv>
				</TopDiv>
				<MainDiv>
					<LoginForm/>
				</MainDiv>
			</ContentDiv>
			<FooterDiv>
				<GlobalFooter
					links={[]}
					copyright={<div>Copyright <CopyrightOutlined/> {app.year} Present</div>}
				/>
			</FooterDiv>
		</ContainerDiv>
	)
}

export default LoginApp
