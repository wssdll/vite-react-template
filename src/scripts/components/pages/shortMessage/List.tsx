import React, {useState, useEffect, useRef} from 'react'
import {Button, Input, Card, Divider, DatePicker, Select} from 'antd'
import PageWrap from '@/scripts/components/commons/PageWrap'
import {IPageProps} from '@/scripts/components/pages/loader'

import {defaultPagination, defaultTable, IProTableFormType} from '@/scripts/components/commons/default'
import DateTime, {getRange} from '@/scripts/utils/DateTime'
import ProTable, {ActionType, ProColumns, ColumnsState, ProTableProps} from '@ant-design/pro-table'
import {getColumnsStateStore, setColumnsStateStore} from '@/scripts/stores/user'
import {default as moment, Moment} from 'moment'

import Search from 'antd/es/input/Search'
import getShortMessageList from '@/remotes/types/shortMessage/getShortMessageList'
import IGetShortMessageListInput from '@/remotes/types/shortMessage/IGetShortMessageListInput'
import IShortMessageDTO from '@/remotes/types/shortMessage/IShortMessageDTO'
import ShortMessageEnum from '@/remotes/types/shortMessage/ShortMessageEnum'
import smsBatchExport from '@/remotes/types/shortMessage/smsBatchExport'
import {directDownload} from '@/scripts/utils/download'

const {RangePicker} = DatePicker

const shortMessageOptions = [
	{value: ShortMessageEnum.Sending, text: '发送中', label: '发送中'},
	{value: ShortMessageEnum.Success, text: '发送成功', label: '发送成功'},
	{value: ShortMessageEnum.Fail, text: '发送失败', label: '发送失败'}
]

interface IFormValueType extends IProTableFormType {
	[key: string]: any

	searchValue: string;
	status: ShortMessageEnum;
	fromDateTime: Moment[]
	toDateTime: Moment[]
}

interface IDataSource extends IShortMessageDTO {

}

interface ICardProps extends IPageProps<{ id?: string, serviceSiteCode?: string }> {

}

interface ICommonTableProps extends ProTableProps<IDataSource, IFormValueType>, ICardProps {

}

// let keywords = ''
// let clearSearch = false

const CommonShortMessageTable = (props:ICommonTableProps) => {

	const [query, setQuery] = useState<IGetShortMessageListInput>({
		toDateTime:moment().endOf('day').valueOf(),
		fromDateTime:moment().add(-6, 'day').startOf('day').valueOf(),
		pageIndex:1,
		pageSize:10
	})

	const actionRef = useRef<ActionType>()

	const [total, setTotal] = useState<number>(0)
	const [downloading, setDownloading] = useState<boolean>(false)

	const initColumnsState = getColumnsStateStore()?.[props.page.pageId]
	const [columnsState, setColumnsState] = useState<{ [key: string]: ColumnsState }>(initColumnsState)
	const [dataSource, setDataSource] = useState<IDataSource[]>([])
	// const [filteredDataSource, setFilteredDataSource] = useState<IDataSource[]>([])
	//

	useEffect(() => {
		// props.page.get((e : any)=>{
		// 	if(e.data === 'update'){
		// 		actionRef.current?.reload()
		// 	}
		// })
	}, [])


	const getList = async (q?: Partial<IGetShortMessageListInput>) => {
		try {
			let currentQuery = {...query, ...q}
			let {result} = await getShortMessageList({...currentQuery})
			let {itemCount: total, smsRecordList: rows} = result
			setQuery(currentQuery)
			setDataSource(rows)
			setTotal(total)

			return {
				data: rows.map((item, index) => ({...item, id: index})),
				success: true,
				total
			}
		} catch (e) {
			setDataSource([])
			return {
				data: [],
				success: true,
				total: 0
			}
		}
	}

	const batchExport = async () => {
		setDownloading(true)
		try {
			let {result} = await smsBatchExport(query)
			directDownload(result)
		} finally {
			setDownloading(false)
		}
	}

	const getTableList = (params: IFormValueType, sort: {[key: string]: 'ascend' | 'descend' }) => {

		let asc = false
		if(sort && sort.operateDates){
			asc = sort.operateDates === 'ascend'
		}

		let {current, searchValue, status, operateDates,_timestamp, ...rest} = params

		let [fromDateTime, toDateTime] = getRange(operateDates,'day')

		let currentQuery: IGetShortMessageListInput = {
			...query,
			...rest,
			asc,
			searchValue,
			status,
			fromDateTime,
			toDateTime,
			pageIndex: current,
		}
		return getList({...currentQuery})
	}

	const disabledDate = (current: Moment) => {
		return current && (current > moment().endOf('day') || current < moment().add(-6,'month').startOf('day'))
	}

	const columns: ProColumns<IDataSource>[] = [
		{
			title: '发送时间',
			dataIndex: 'operateDates',
			width: 180,
			order: 70,
			sorter: true,
			formItemProps: {
				rules: [
					{
						required: true,
						message: '此项为必填项',
					},
					{
						validator: (_rule, value: Moment[]) => value && moment(value[1]).add(-7, 'day').endOf('day').valueOf() >= moment(value[0]).endOf('day').valueOf() ? Promise.reject('不能超过7天') : Promise.resolve(),
					},
				],
			},
			initialValue: [moment().add(-6, 'day').startOf('day'), moment().endOf('day')],
			renderFormItem: () => {
				return <RangePicker
					allowClear={false}
					ranges={{
						'今天': [moment().startOf('day'), moment().endOf('day')],
						'本周': [moment().startOf('week').add(1,'day'), moment().endOf('week').add(1,'day')],
						'上周': [moment().add(-1,'week').startOf('week').add(1,'day'), moment().add(-1,'week').endOf('week').add(1,'day')],
					}}
					format="YYYY-MM-DD"
					disabledDate={disabledDate}
				/>
			},
			render: (_v, row) => (new DateTime(row.sendDate)).toDateSecondString(),
		}, {
			title: '发送状态',
			dataIndex: 'status',
			width:100,
			order: 60,
			renderFormItem: () => {
				return <Select
					allowClear
					placeholder="请选短信发送状态"
					options={shortMessageOptions}
				/>
			},
		}, {
			title: '接收手机号码',
			dataIndex: 'phoneNumber',
			width: 150,
			hideInSearch: true,
		}, {
			title: '手机号码/编号',
			dataIndex: 'searchValue',
			hideInTable: true,
			order: 50,
			formItemProps: {
				className:'form-search-value',
				rules: [
					{
						pattern: /^\d+$/,
						message: '请输入正确格式的手机号码/编号',
					},
				],
			},
			renderFormItem: () => {
				return <Input
					placeholder="请输入手机号码/号码后4位/编号"
					allowClear
				/>
			},
		}, {
			title: '编号',
			dataIndex: 'shelfNumber',
			hideInSearch:true,
			width:80,
		}, {
			title: '发送内容',
			dataIndex: 'content',
			hideInSearch:true,
			width:220,
		}, {
			title: '失败原因',
			dataIndex: 'failInfo',
			hideInSearch:true,
			width:150,
		}
	]

	const toolBar = [
		<span key="statistical">共 <span style={{color: '#FF9800', fontWeight: 'bold'}}>{total}</span> 条数据</span>,
		<Divider key="divider" type="vertical"/>,
		<Button key="export" disabled={dataSource.length === 0} onClick={batchExport} loading={downloading}>批量导出</Button>
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
			onColumnsStateChange={(map: any) => {
				setColumnsState(map)
				setColumnsStateStore({[props.page.pageId]: map})
			}}
			pagination={{
				...defaultPagination,
				total,
				current: query.pageIndex,
				pageSize: query.pageSize,
			}}
		/>
	)

}

const ShortMessageList = (props: ICardProps) => {
	return (
		<PageWrap>
			<Card>
				<CommonShortMessageTable
					id="ShortMessageList"
					{...props}
				/>
			</Card>
		</PageWrap>)
}

export default ShortMessageList
