import React from 'react'
import PageWrap from '@/scripts/components/commons/PageWrap'
import {Button, Card, Descriptions, Form, Input, message, Modal} from 'antd'
import PageLink from '@/scripts/components/commons/PageLink'
import pages from '@/scripts/components/pages'
import {useEffect, useState} from 'react'
import {ModalProps} from 'antd/es/modal'
import updateUserInfo from '@/remotes/types/user/updateUserInfo'
import IUpdateUserInfoInput from '@/remotes/types/user/IUpdateUserInfoInput'
import {storage} from 'beyond-lib'
import getRemain from "@/remotes/types/user/getRemain";
import {getLocalUser, setUser} from "@/scripts/stores/user";
// @ts-ignore
import md5 from 'blueimp-md5'
import styled from 'styled-components'

const Tips = styled.div`
  display: block;
  margin-top: 15px;
  margin-left: 10px;
  font-size: 12px;
  color: grey;
`

interface IFormValueType {
	oldPassword: string
	newPassword: string
	confirmPassword: string
}

interface IUserFormValueType {
	userName: string
}

const UserProfile = () => {

	useEffect(() => {
		remainCheck()
	}, [])

	const userInfo = getLocalUser()

	const [remain, setRemain] = useState<number>(0)

	const [form] = Form.useForm()
	const [passwordModal, setPasswordModal] = useState<ModalProps>()
	const [passwordModalVisible, setPasswordModalVisible] = useState<boolean>(false)

	const [userForm] = Form.useForm()
	const [userNameModal, setUserNameModal] = useState<ModalProps>()
	const [userNameModalVisible, setUserNameModalVisible] = useState<boolean>(false)

	const updatePassword = async () => {
		const fieldsValue = await form.validateFields()
		const {confirmPassword, newPassword, oldPassword} = fieldsValue as IFormValueType

		let parameters: IUpdateUserInfoInput = {
			confirmPassword: md5(confirmPassword),
			newPassword: md5(newPassword),
			oldPassword: md5(oldPassword)
		}

		let {result, errorMsg} = await updateUserInfo(parameters)
		if (result) {
			message.success('修改成功')
		} else {
			message.success(errorMsg || '修改失败')
		}
	}

	const updateUserName = async () => {
		const fieldsValue = await userForm.validateFields()
		const {userName} = fieldsValue as IUserFormValueType

		let parameters: IUpdateUserInfoInput = {userName}

		let {result, errorMsg} = await updateUserInfo(parameters)
		if (result) {
			setUser({...userInfo, username: userName})
			storage.setCookie('x-auth-userName', userName)
			message.success('修改成功')
		} else {
			message.success(errorMsg || '修改失败')
		}
	}

	const remainCheck = async () => {
		let {result} = await getRemain()
		setRemain(result)
	}

	const handleChangePassword = () => {
		setPasswordModalVisible(true)
		setPasswordModal({
			title: '修改密码',
			maskClosable: true,
			cancelText: '取消',
			okText: '确定',
			onOk: () => {
				updatePassword().then(()=>{
					form.resetFields()
					setPasswordModalVisible(false)
				})
			},
			onCancel: () => {
				form.resetFields()
				setPasswordModalVisible(false)
			}
		})
	}

	const handleChangeUserName = () => {
		setUserNameModalVisible(true)
		setUserNameModal({
			title: '修改用户名',
			maskClosable: true,
			cancelText: '取消',
			okText: '确定',
			onOk: () => {
				updateUserName().then(()=>{
					setUserNameModalVisible(false)
					location.reload()
				})
			},
			onCancel: () => {
				userForm.resetFields()
				setUserNameModalVisible(false)
			}
		})
	}

	return (
		<PageWrap>
			<Card>
				<Descriptions column={1} title="账号信息" style={{padding:10}}>
					<Descriptions.Item label="注册手机">{userInfo.mobile}</Descriptions.Item>
					<Descriptions.Item label="用户名">{userInfo.username}</Descriptions.Item>
					<Descriptions.Item label="短信余额">{remain} 条</Descriptions.Item>
				</Descriptions>
				<div style={{padding:10,paddingTop:0}}>
					<Button type="primary" className="mr-10" onClick={handleChangePassword}>修改密码</Button>
					<Button type="primary" className="mr-10" onClick={handleChangeUserName}>修改用户名</Button>
					<Button type="ghost" className="mr-10" onClick={()=>PageLink.to(pages.payment)}>充值</Button>
					<Button type="primary" className="mr-10" onClick={()=>PageLink.to(pages.paymentList)}>充值记录</Button>
				</div>
			</Card>

			<Modal
				visible={passwordModalVisible}
				{...passwordModal}
				footer={<>
					<Button type="primary" onClick={passwordModal?.onOk}>确定</Button>
					<Button onClick={passwordModal?.onCancel}>关闭</Button>
				</>}
			>
				<Form form={form}>
					<Form.Item
						name="oldPassword"
						label="原密码"
						rules={[{required: true, message: '请输入原密码'}]}
					>
						<Input.Password placeholder="请输入原密码" visibilityToggle/>
					</Form.Item>
					<Form.Item
						name="newPassword"
						label="新密码"
						rules={[
							{required: true, message: '请输入新密码'},
							{pattern: /^(?=.*\d)(?=.*[a-z])([^\s]){8,}$/, message: '请输入正确格式的密码'}]}
					>
						<Input.Password placeholder="请输入新密码" visibilityToggle maxLength={64}/>
					</Form.Item>
					<Form.Item
						className="mb-0"
						name="confirmPassword"
						label="确认新密码"
						rules={[{required: true, message: '请输入新密码'}, ({getFieldValue}) => ({
							validator(_, value) {
								if (!value || getFieldValue('newPassword') === value) {
									return Promise.resolve()
								}
								return Promise.reject(new Error('两次密码不一致!'))
							},
						})]}
					>
						<Input.Password placeholder="请输入新密码" visibilityToggle/>
					</Form.Item>
					<Tips>注意：密码必须是字母和数字的8位以上字符组合</Tips>
				</Form>
			</Modal>

			<Modal
				visible={userNameModalVisible}
				{...userNameModal}
				footer={<>
					<Button type="primary" onClick={userNameModal?.onOk}>确定</Button>
					<Button onClick={userNameModal?.onCancel}>关闭</Button>
				</>}
			>
				<Form
					form={userForm}
					initialValues={{
						userName:userInfo.username
					}}
				>
					<Form.Item
						name="userName"
						label="用户名"
						rules={[
							{required: true, message: '请输入用户名'},
							{pattern: /^([^\s]){0,8}$/, message: '请输入正确格式的用户名'}]}
					>
						<Input allowClear placeholder="请输入用户名，8个字以内" maxLength={8}/>
					</Form.Item>
				</Form>
			</Modal>
		</PageWrap>
	)
}

export default UserProfile
