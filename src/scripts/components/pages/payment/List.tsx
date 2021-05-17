import React, {useState, useEffect, useRef} from 'react'
import {Input, Card, Divider, DatePicker, Select} from 'antd'
import PageWrap from '@/scripts/components/commons/PageWrap'
import {IPageProps} from '@/scripts/components/pages/loader'

import {defaultPagination, defaultTable, IProTableFormType} from '@/scripts/components/commons/default'
import DateTime, {getRange} from '@/scripts/utils/DateTime'
import ProTable, {ActionType, ProColumns, ColumnsState, ProTableProps} from '@ant-design/pro-table'
import {getColumnsStateStore, setColumnsStateStore} from '@/scripts/stores/user'
import {default as moment, Moment} from 'moment'

import Search from 'antd/es/input/Search'
import getPaymentList from '@/remotes/types/payment/getPaymentList'
import IGetPaymentListInput from '@/remotes/types/payment/IGetPaymentListInput'
import IPaymentDTO from '@/remotes/types/payment/IPaymentDTO'
import PaymentStateEnum from '@/remotes/types/payment/PaymentStateEnum'

const {RangePicker} = DatePicker

const paymentStateMap: { [key: number]: string } = {
	[PaymentStateEnum.NoPay]: '未支付',
	[PaymentStateEnum.Success]: '支付成功',
	[PaymentStateEnum.Fail]: '支付失败',
}

const paymentOptions = [
	{value: PaymentStateEnum.NoPay, text: '未支付', label: '未支付'},
	{value: PaymentStateEnum.Success, text: '支付成功', label: '支付成功'},
	{value: PaymentStateEnum.Fail, text: '支付失败', label: '支付失败'}
]

interface IFormValueType extends IProTableFormType {
	[key: string]: any

	status: PaymentStateEnum;
	startDate: Moment[]
	endDate: Moment[]
}

interface IDataSource extends IPaymentDTO {

}

interface ICardProps extends IPageProps<{ id?: string, serviceSiteCode?: string }> {

}

interface ICommonTableProps extends ProTableProps<IDataSource, IFormValueType>, ICardProps {

}

// let keywords = ''
// let clearSearch = false

const CommonPaymentTable = (props:ICommonTableProps) => {

	const [query, setQuery] = useState<IGetPaymentListInput>({
		startDate:moment().startOf('month').valueOf(),
		endDate:moment().endOf('day').valueOf(),
		pageNumber:1,
		pageSize:10
	})

	const actionRef = useRef<ActionType>()

	const [total, setTotal] = useState<number>(0)

	const initColumnsState = getColumnsStateStore()?.[props.page.pageId]
	const [columnsState, setColumnsState] = useState<{ [key: string]: ColumnsState }>(initColumnsState)
	// const [dataSource, setDataSource] = useState<IDataSource[]>([])
	// const [filteredDataSource, setFilteredDataSource] = useState<IDataSource[]>([])
	//

	useEffect(() => {
		// props.page.get((e : any)=>{
		// 	if(e.data === 'update'){
		// 		actionRef.current?.reload()
		// 	}
		// })
	}, [])


	const getList = async (q?: Partial<IGetPaymentListInput>) => {
		try {
			let currentQuery = {...query, ...q}
			let {result} = await getPaymentList({...currentQuery})
			let {totalNum: total, list:rows} = result
			setQuery(currentQuery)
			// setDataSource(rows)
			setTotal(total)

			return {
				data: rows,
				success: true,
				total
			}
		} catch (e) {
			// setDataSource([])
			return {
				data: [],
				success: true,
				total: 0
			}
		}
	}

	const getTableList = (params: IFormValueType, sort: {[key: string]: 'ascend' | 'descend' }) => {

		// if (keywords) {
		// 	return new Promise((resolve) => {
		// 		resolve({
		// 			data: filteredDataSource,
		// 			success: true,
		// 			total
		// 		})
		// 	}) as Promise<RequestData<any>>
		// }
		//
		// if(clearSearch){
		// 	clearSearch = false
		// 	return new Promise((resolve) => {
		// 		resolve({
		// 			data: dataSource,
		// 			success: true,
		// 			total
		// 		})
		// 	}) as Promise<RequestData<any>>
		// }

		let order = 'DESC'
		if (sort && sort.operateDates) {
			order = sort.operateDates === 'ascend' ? 'ASC' : 'DESC'
		}

		let {current,operateDates,status,orderId,_timestamp, ...rest} = params

		let [startDate, endDate] = getRange(operateDates,'day')

		let currentQuery: IGetPaymentListInput = {
			...query,
			...rest,
			order,
			orderId,
			status,
			startDate,
			endDate,
			pageNumber: current,
		}
		return getList({...currentQuery})
	}

	const disabledDate = (current: Moment) => {
		return current && (current > moment().endOf('day') || current < moment().add(-6,'month').startOf('day'))
	}

	const columns: ProColumns<IDataSource>[] = [
		{
			title: '订单号',
			dataIndex: 'orderId',
			width: 220,
			order: 30,
			formItemProps: {
				rules: [
					{
						pattern: /^\w+$/,
						message: '请输入正确格式的订单号',
					},
				],
			},
			renderFormItem: () => {
				return <Input
					placeholder="请输入订单号"
					allowClear
				/>
			},
		}, {
			title: '创建时间',
			dataIndex: 'operateDates',
			width: 180,
			order: 50,
			sorter: true,
			formItemProps: {
				rules: [
					{
						required: true,
						message: '此项为必填项',
					},
				],
			},
			initialValue:[moment().startOf('month'),moment().endOf('day')],
			renderFormItem: () => {
				return <RangePicker
					allowClear={false}
					ranges={{
						'今天': [moment().startOf('day'), moment().endOf('day')],
						'本周': [moment().startOf('week').add(1,'day'), moment().endOf('week').add(1,'day')],
						'上周': [moment().add(-1,'week').startOf('week').add(1,'day'), moment().add(-1,'week').endOf('week').add(1,'day')],
						'本月': [moment().startOf('month'), moment().endOf('month')],
					}}
					format="YYYY-MM-DD"
					disabledDate={disabledDate}
				/>
			},
			render: (_v, row) => (new DateTime(row.createTime)).toDateSecondString(),
		}, {
			title: '支付状态',
			dataIndex: 'status',
			width:100,
			order: 40,
			renderFormItem: () => {
				return <Select
					allowClear
					placeholder="请选择支付状态"
					options={paymentOptions}
				/>
			},
			render: (_v, row) => paymentStateMap[row.status]
		}, {
			title: '短信量',
			dataIndex: 'smsNum',
			hideInSearch:true,
			width:80,
		}, {
			title: '备注',
			dataIndex: 'errMsg',
			hideInSearch:true,
			width:220,
		}
	]

	const toolBar = [
		<span key="statistical">共 <span style={{color: '#FF9800', fontWeight: 'bold'}}>{total}</span> 条数据</span>,
	]

	toolBar.push(<Divider key="divider1" type="vertical"/>,
		<Search key="search" allowClear disabled placeholder="关键词搜索（暂无，请使用Ctrl+F）"
				// onSearch={(value) => {
				// 	if (!value) {
				// 		clearSearch = true
				// 	}
				// 	keywords = value
				// 	setFilteredDataSource(dataSource.filter((item => item.orderId.indexOf(keywords) > -1)))
				// 	actionRef.current?.reload()
				// }}
				style={{width: 300}}
		/>)

	return (
		<>
			<ProTable<IDataSource, IFormValueType>
				{...defaultTable}
				rowKey="id"
				form={{
					ignoreRules: false,
				}}
				headerTitle={toolBar}
				request={getTableList}
				actionRef={actionRef}
				tableAlertRender={false}
				columns={columns}
				columnsStateMap={columnsState}
				onColumnsStateChange={(map) => {
					setColumnsState(map)
					setColumnsStateStore( {[props.page.pageId]: map})
				}}
				pagination={{
					...defaultPagination,
					total,
					current: query.pageNumber,
					pageSize: query.pageSize,
				}}
			/>
		</>
	)

}

const PaymentList = (props: ICardProps) => {
	return (
		<PageWrap>
			<Card>
				<CommonPaymentTable
					id="PaymentList"
					{...props}
				/>
			</Card>
		</PageWrap>)
}

export default PaymentList
