import React from 'react'
import PageWrap from '@/scripts/components/commons/PageWrap'
import {Button, Card, Image, message, Modal, Result, Spin, Steps} from 'antd'
import styled from 'styled-components'
import {useEffect, useState} from 'react'
import getBundleList from '@/remotes/types/bundle/getBundleList'
import IBundleDTO from '@/remotes/types/bundle/IBundleDTO'
import IGetBundleListInput from '@/remotes/types/bundle/IGetBundleListInput'

import {
	CheckOutlined,
	PayCircleOutlined,
	FileSearchOutlined,
	MessageOutlined, AlipayCircleOutlined, WechatOutlined} from '@ant-design/icons'
import {getLocalUser} from '@/scripts/stores/user'
import PayWayEnum from '@/remotes/types/payment/PayWayEnum'
import createPayment from '@/remotes/types/payment/createPayment'
import ICreatePaymentDTO from '@/remotes/types/payment/ICreatePaymentDTO'
import getPaymentList from '@/remotes/types/payment/getPaymentList'
import PaymentStateEnum from '@/remotes/types/payment/PaymentStateEnum'
import pages from '@/scripts/components/pages'
import PageLink from '@/scripts/components/commons/PageLink'
import Calculate from '@/scripts/utils/Calculate'


const { Step } = Steps

const CustomSteps = styled(Steps)`
  .ant-steps-item-finish .ant-steps-item-title {
    color: #1890ff !important;
  }

  .ant-steps-item-active .ant-steps-item-title {
    color: #1890ff !important;
  }
`

const PlanSet = styled.div`
  display: flex;
  padding: 10px;
  flex-wrap: wrap;
  justify-content: space-evenly;
`

const PlanCard = styled(Card)`
  &.ant-card{
    width: 275px;
    margin: 15px 10px;
    border-color: transparent;
  }

  &.checked {
    .ant-card-body {
      transition: 0.3s all;
      border-color: #1890ff;
	  
      //background: #1890ff;
      //color: white;  
    }

    .card-checker{
	  color: #1890ff;
	  
      &:before{
        background: #1890ff;
      }
	}
    //.card-current-price{
    //  transition: 0.3s color;
    //  color: #fff;
    //}
    //
    //.card-count {
    //  transition: 0.3s color;
    //  color: #fff;
    //}
	//
	//.card-original-price{
    //  transition: 0.3s color;
    //  color: #efefef;
    //}
	//
	//.card-slogan{
    //  transition: 0.3s color;
    //  color: #efefef;
    //}
  }
  
  .ant-card-body {
    display: flex;
    padding: 12px;
    background: #f8f8f8;
    border-radius: 4px;
    border: 2px dashed transparent;

    cursor: pointer;
  }

  .anticon-message {
    padding: 4px;
    font-size: 28px;
    padding-right: 12px;
  }

  .card-title {
    font-size: 16px;
    font-weight: bold;
  }
  
  .card-current-price{
    color: #1890ff;
    font-size: 22px;
    font-weight: bold;
  }

  .card-original-price {
    margin-left: 10px;
    vertical-align: super;
    font-size: 13px;
    text-decoration: line-through;
    color: #666;
  }
  
  .card-slogan {
    font-size: 12px;
    color: #795548;
  }

  .card-count {
    position: absolute;
    top: 4px;
    right: 10px;
    font-family: fantasy;
    color: #3f74a6;
    font-size: 16px;
  }
  
  .card-checker {
    position: absolute;
    overflow: hidden;
    line-height: 1;
    top: 0;
    right: 0;
    width: 35px;
    height: 35px;
    border-radius: 4px;
    color: transparent;
    transition: 0.3s color;
	
	.anticon-check{
      position: absolute;
      color: white;
      right: 4px;
      top: 4px;
      font-size: 12px;
	}
	&:before{
      content: '';
      display: block;
      position: absolute;
      width: 200%;
      height: 200%;
      transform: rotate(36deg);
      left: 0;
      top: -50px;
	}
  }

  .card-tag {
    position: absolute;
    bottom: 5px;
    right: 5px;
    background: #1890ff;
    color: white;
    padding: 2px 4px;
    font-size: 12px;
	border-radius: 4px;
  }
  
`

const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .order-header {
	width: 80%;
    margin-bottom: 15px;
	
	.order-username{
	  margin-right: 10px;
	}
  }

  .order-plan-info {
    width: 80%;

    .order-plan-header {
      margin-bottom: 15px;
      font-size: 14px;
      display: flex;
      align-items: center;
	  color: #888;

      .order-plan-icon {
        margin-right: 10px;
        font-size: 18px;
      }
	  .order-plan-result{
		color: black;
	  }
    }

    .order-plan-content {
      margin-left: 30px;
      margin-bottom: 15px;

      .order-plan-detail {
        width: 270px;
        border: 1px solid #cbcbcb;
        padding: 10px 15px;
        border-radius: 4px;
        margin-bottom: 15px;

        .order-plan-icon {
          margin-right: 10px;
        }

        .detail-title {
          margin-right: 20px;
          font-weight: bold;
        }

        .detail-current-price {
          margin-right: 10px;
          font-weight: bold;
          color: red;
        }

        .detail-origin-price {
          font-size: 12px;
          text-decoration: line-through;
          color: #666;
        }
      }

      .order-plan-count {
        border-left: 2px solid red;
        padding-left: 14px;
      }

      .order-plan-count-title {
        font-weight: bold;
        margin-right: 10px;
      }
	  .order-plan-count-price{
        font-weight: bold;
		color: red;
      }
	}
  }
  
  //.order-count {
  //  .ant-descriptions-item-label {
  //    line-height: 34px;
  //  }
	//
	//.ant-descriptions-item-content {
  //    color: red;
  //    font-weight: bold;
  //    font-size: 22px;
  //  }
  //}
  
  //.order-title{
  //  .ant-descriptions-item-content {
  //    font-weight: bold;
  //  }
  //}
`

// const CurrentPrice = styled.span`
//   color: red;
//   font-weight: bold;
// `
//
// const OriginalPrice = styled.span`
//   margin-left: 5px;
//   text-decoration: line-through;
//   font-size: 12px;
//   color: #8b8b8b;
// `

const PaymentCard = styled.div`
  display: flex;
  margin-left: 22px;
  position: relative;

  .mask{
	display: none;
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.5);
    z-index: 1;
  }
  
  &.disabled {
	.mask{
	  display: block;
	}
  }
`

const PaymentElem = styled.div`
  margin-left: 6px;
  margin-right: 12px;
  margin-bottom: 24px;
  border: 2px solid transparent;
  border-radius: 8px;
  
  .payment-container{
    position: relative;
    display: flex;
    align-items: center;
    border: 1px solid #d9d9d9;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
  }
  
  .payment-icon {
    .anticon {
      font-size: 26px;
      margin-right: 6px;
    }
  }

  .alipay{
    color: #1890ff;
  }
  
  .wechat{
    color: green;
  }

  .card-checker {
    position: absolute;
    line-height: 1;
    top: 8px;
    right: 8px;
    font-size: 18px;
    color: transparent;

    transition: 0.3s color;
  }
  
  &.checked {
    transition: 0.3s all;
    border-color: #1890ff;
    color: #1890ff;

	.payment-container{
      transition: 0.3s all;
      border-color: transparent;
    }
	
    .card-checker{
      color: #1890ff;
    }
	
    //color: white;
    //
    //&.alipay{
    //  background: #1890ff;
    //  border-color: #1890ff;
    //}
	//.alipay{
    //  color: white;
    //}
	//
    //&.wechat{
    //  background: green;
    //  border-color: green;
    //}
    //.wechat{
    //  color: white;
    //}
  }
`

const PaymentInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  .info-header{
	color: #888;
  }
  
  .info-code {
    margin-right: 16px;
  }
  
  .order-code{
    padding-bottom: 20px;
  }
`

const FinalStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .finish-confirm{
	margin-top: -8px;
  }
  
  .finish-button{
	padding: 0;
    color: #66abec;
  }
  
  .problem{
    font-size: 12px;
    margin-top: 5px;
    text-decoration: underline;
    color: #66abec;
  }
`

interface IPayment {
	title:string,
	icon: React.ReactNode,
	type: PayWayEnum,
	className: string,
	checked: boolean,
}

const initPaymentList:IPayment[] = [
	{
		title: '支付宝扫码',
		icon:<AlipayCircleOutlined />,
		className:'alipay',
		type: PayWayEnum.AliQR,
		checked: false,
	}, {
		title: '微信扫码',
		icon:<WechatOutlined />,
		className:'wechat',
		type: PayWayEnum.WechatQR,
		checked: false,
	}
]

interface IPlanDTO extends IBundleDTO {
	checked:boolean
}

const Payment = () => {
	const userInfo = getLocalUser()

	const [query, setQuery] = useState<IGetBundleListInput>({
		pageNumber:1,
		pageSize:10
	})

	useEffect(() => {
		getBundle()
	}, [])

	const [step, setStep] = useState(0)
	const [planList, setPlanList] = useState<IPlanDTO[]>([])
	const [selectedPlan, setSelectedPlan] = useState<IPlanDTO>()

	const [paymentList, setPaymentList] = useState<IPayment[]>(initPaymentList)
	const [selectedPayment, setSelectedPayment] = useState<IPayment>()

	const [payOrder, setPayOrder] = useState<ICreatePaymentDTO>({})

	const [payLoading, setPayLoading] = useState<boolean>(false)
	const [confirmLoading, setConfirmLoading] = useState<boolean>(false)

	const getBundle = async (q?: Partial<IGetBundleListInput>) => {
		let currentQuery = {...query, ...q}
		let {result} = await getBundleList({...currentQuery})
		let {list: rows} = result
		setQuery(currentQuery)

		let list = rows.map(item=>({...item,checked:false}))

		setPlanList(list)
	}

	const getPaymentCode = async () => {
		setPayLoading(true)
		try {
			let {result} = await createPayment({
				bundleId: selectedPlan.id,
				payWay: selectedPayment.type,
			})
			setPayOrder(result)
		} finally {
			setPayLoading(false)
		}
	}

	const onCheck = (index: number) => {
		let newList = planList.map((item, i) => {
			return {
				...item,
				checked: index === i
			}
		})
		setPlanList(newList)
		setSelectedPlan(newList[index])
	}

	const onPaymentCheck = (index: number) => {
		let newList = paymentList.map((item, i) => {
			return {
				...item,
				checked: index === i
			}
		})
		setPaymentList(newList)
		setSelectedPayment(newList[index])
	}

	const onStepChange = (step:number) => {

		switch (step){
			case 0:
				break
			case 1:
				if(!selectedPlan){
					message.warn('请选择套餐！')
					return
				}
				break
			case 2:
				if(!selectedPayment){
					message.warn('请选择支付方式！')
					return
				}
				getPaymentCode()
				break
		}

		setStep(step)
	}

	const confirmPayment = async () => {
		setConfirmLoading(true)
		try {
			let {result} = await getPaymentList({orderId: payOrder.orderId})
			let {list} = result
			if(Array.isArray(list) && list.length > 0){
				let record = list.find(item=>item.orderId === payOrder.orderId)
				if (!record) {
					message.error('未获取到数据，请重试')
				} else if (record.status === PaymentStateEnum.Success) {
					setStep(3)
					onCheck(-1)
					onPaymentCheck(-1)
				} else if (record.status === PaymentStateEnum.NoPay) {
					message.warn('支付未完成，请重试')
				} else if (record.status === PaymentStateEnum.Fail) {
					message.warn('支付失败，请联系客服')
				}
			}else{
				message.error('请求出错，请重试')
			}
		} finally {
			setConfirmLoading(false)
		}
	}

	return (
		<PageWrap>
			<Card style={{paddingBottom:25}}>
				<CustomSteps
					size="small"
					progressDot
					current={step}
					// onChange={onStepChange}
					style={{padding:10}}>
					<Step disabled={step >= 2} title="请选择通讯套餐" />
					<Step disabled={step >= 2} title="确认订单" />
					<Step disabled={step !== 1} title="支付" />
				</CustomSteps>
				{step === 0 && <PlanSet>
					{planList.map((item, index) => {
						return <PlanCard
							key={item.id}
							onClick={()=>onCheck(index)}
							className={item.checked ? 'checked' : void 0}
						>
							<MessageOutlined/>
							<div>
								<span className="card-title">{item.title}</span>
								<div>
									<span className="card-current-price">¥{new Calculate(item.currentPrice).toMoney()}</span>
									<span className="card-original-price">¥{new Calculate(item.originalPrice).toMoney()}</span>
								</div>

								<span className="card-slogan">{item.slogan}</span>
								<span className="card-checker"><CheckOutlined /></span>
								{/*<span className="card-count">{item.smsNum}</span>*/}
								{item.tag && <span className="card-tag">{item.tag}</span>}
							</div>
						</PlanCard>
					})}
				</PlanSet>}
				{(step === 1 || step === 2) && (
					<OrderInfo>
						<div className="order-header">
							<span className="order-username">{userInfo.username}</span>
							<span>{userInfo.mobile}</span>
						</div>

						<div className="order-plan-info">
							<div className="order-plan-header">
								<FileSearchOutlined className="order-plan-icon"/>
								<span>套餐信息</span>
							</div>
							<div className="order-plan-content">
								<div className="order-plan-detail">
									<MessageOutlined className="order-plan-icon"/>
									<span className="detail-title">{selectedPlan.title}</span>
									<span className="detail-current-price">{new Calculate(selectedPlan.currentPrice).toMoney()} 元</span>
									<span className="detail-origin-price">{new Calculate(selectedPlan.originalPrice).toMoney()} 元</span>
								</div>
								<div className="order-plan-count">
									<span className="order-plan-count-title">总计</span>
									<span className="order-plan-count-price">{new Calculate(selectedPlan.currentPrice).toMoney()} 元</span>
								</div>
							</div>
						</div>

						<div className="order-plan-info">
							{step === 1 &&<div className="order-plan-header">
								<PayCircleOutlined className="order-plan-icon"/>
								<span>请选择支付方式</span>
							</div>}
							{step === 1 && <PaymentCard>
								{paymentList.map((item,index) => {
									return <PaymentElem
										key={item.type}
										onClick={() => onPaymentCheck(index)}
										className={item.className + (item.checked ? ' checked' : '')}
									>
										<div className="payment-container">
											<span className={item.className + ' payment-icon'}>{item.icon}</span>
											<span>{item.title}</span>
										</div>
									</PaymentElem>
								})}
							</PaymentCard>}
							{step === 2 && <div className="order-plan-header">
                                <PayCircleOutlined className="order-plan-icon"/>
								<span>支付方式：</span>
								<span  className="order-plan-result">{selectedPayment.title}</span>
							</div>}
						</div>
					</OrderInfo>
				)}
				{step === 2 && (
					<PaymentInfo>
						<div className="info-header">
							<span className="info-code">订单号：{payOrder.orderId}</span>
							<span className="info-price">金额：{selectedPlan.currentPrice}</span>
						</div>
						<Spin spinning={payLoading}>
							<Image
								width={200}
								height={200}
								preview={false}
								src={payOrder.payStr}
								fallback="data:image/png;base64,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"
							/>
						</Spin>
					</PaymentInfo>
				)}
				{step === 3 && (
					<Result
						status="success"
						title="支付成功！"
						extra={[
							<Button type="primary" key="console" onClick={()=>PageLink.to(pages.paymentList)}>
								查看支付记录
							</Button>,
							<Button key="buy" onClick={()=>setStep(0)}>再次购买</Button>,
						]}
					/>
				)}
				<div className="steps-action text-center">
					{step === 1 && (
						<Button style={{margin: '0 8px'}} onClick={() => onStepChange(step - 1)}>
							上一步
						</Button>
					)}
					{step < 2 && (
						<Button type="primary" onClick={() => onStepChange(step + 1)}>
							下一步
						</Button>
					)}
					{step === 2 && (
						<FinalStep>
							<div className="finish-confirm">
								我已完成支付，
								<Button className="finish-button" loading={confirmLoading} type="link" onClick={confirmPayment}>
									请点我
								</Button>
							</div>
							<a className="problem" onClick={() => Modal.info({
								title: '提示',
								content: <span>请加客服QQ群：279260176</span>
							})}>支付遇到问题？</a>
						</FinalStep>
					)}
				</div>
			</Card>
		</PageWrap>
	)
}

export default Payment
