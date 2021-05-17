import { Select, Spin } from 'antd'
import {OptionProps, SelectProps, LabeledValue, SelectValue, RefSelectProps} from 'antd/lib/select'
import React from 'react'
import { IBaseStoreRemoter } from '@/scripts/commons/createStore'
import delay from 'beyond-remote/lib/delay'
const { Option, OptGroup } = Select

const SEARCH_TIMEOUT = 0.2

export type ISelectProps<T> = Partial<UnPick<IBaseSelectProps<T>, 'remoter'>>

export type BaseSelectValue<T> = T | T[] | SelectValue

export interface IGroup<T> {
	key : string
	label : React.ReactNode
	children : T[]
}

export interface IBaseSelectProps<T> extends UnPick<SelectProps<SelectValue>, 'onChange' | 'value' | 'defaultValue'> {
	dataSource?: T[]
	dataSourceFilter?: (dataSource: T[]) => T[]
	optionsFilter?: (options : React.ReactElement<OptionProps>[]) => React.ReactElement<OptionProps>[]
	onChange?: (data: BaseSelectValue<IGroup<T> | T>, options: React.ReactElement<OptionProps> | React.ReactElement<OptionProps>[]) => void
	value?: BaseSelectValue<T>
	defaultValue?: BaseSelectValue<T>
	//首次获取数据的时候触发，参数是原始数据,remoter变更后会重新触发
	onLoad?: (filterDataSource: T[],dataSource: T[]) => void
	//首次获取数据的时候触发，参数是 SelectValue[],remoter变更后会重新触发
	onInit?: (values : Array<string | number | LabeledValue | T>,filterDataSource: T[], dataSource: T[]) => void
	searchFilter?: (value: string) => Promise<T[]>
	renderChildren?: (dataSource: T[]) => React.ReactNode
	remoter: IBaseStoreRemoter<[], T[]>
	valueFilter? : boolean
	optionProps : (data: IGroup<T> | T) => OptionProps & {key? : React.Key}
	customOptionProps? : (data: IGroup<T> | T) => OptionProps & {key? : React.Key}
	groupKey?: ((data : T)=> React.Key) | keyof T
	groupLabel?:  ((data : T)=> React.ReactNode) | keyof T
	groupsFilter? : (groups : Array<IGroup<T> | T>)=> Array<IGroup<T> | T>
	refSelect? : (select : RefSelectProps)=>void
	SelectComponent? : typeof Select
}

interface IBaseSelectState<T> {
	dataSource: T[];
	loading?: boolean;
}

export default class BaseSelect<T> extends React.Component<IBaseSelectProps<T>, IBaseSelectState<T>> {

	select: typeof Select

	keyToDataSourceMap : {[key : string] : IGroup<T> | T} = null

	load = false

	off : ()=>void

	static defaultProps = {
		showSearch: true,
		labelInValue: true,
	}

	constructor(props: IBaseSelectProps<T>) {
		super(props)
		this.state = {
			dataSource: [],
			loading: false
		}
	}


	componentWillUnmount() {
		if(this.off){
			this.off()
			this.off = null
		}
		this.load = false
		this.keyToDataSourceMap = null
	}

	componentDidUpdate(prevProps : IBaseSelectProps<T>) {
		const {remoter : nextRemoter} = this.props
		if(nextRemoter !== prevProps.remoter){
			if(nextRemoter){
				this.load = false
				this.getDataSource()
			}else{
				this.setState({dataSource : []})
			}
		}
	}

	getDataSource = async ()=> {
		const { remoter } = this.props
		if (remoter) {
			this.setState({ loading: true,dataSource : [] })
			try {
				let dataSource = await remoter()
				dataSource = dataSource || []
				this.setState({ dataSource, loading: false },this.onLoad)
			} catch{
				this.setState({ loading: false })
			}
		}
	}

	onSearch = delay((value: string) => {
		if (value && this.props.searchFilter) {
			this.setState({ loading: true })
			this.props.searchFilter(value)
			.then((dataSource) => {
				this.setState({ loading: false, dataSource })
			})
			.catch(() => {
				this.setState({ loading: false })
			})
		} else {
			this.getDataSource()
		}
	}, SEARCH_TIMEOUT)

	onLoad = () => {
		if(!this.state.loading && !this.load){
			const {onLoad,onInit,labelInValue,valueFilter,dataSourceFilter} = this.props
			const dataSource = (this.state.dataSource || []).slice(0)
			const filterDataSource = dataSourceFilter ? dataSourceFilter(dataSource) : dataSource
			this.load = true
			onLoad && onLoad(filterDataSource.slice(0),dataSource.slice(0))
			if(onInit){
				let values :  Array<string | number | LabeledValue | T>
				if(valueFilter && labelInValue){
					values = filterDataSource.slice(0)
				}else {
					const data = filterDataSource.map((item)=> this.toOpotionProps(item))
					values = labelInValue ? data.map((item)=>({key : item.value, label : item.children}) as LabeledValue) : data.map((item)=> item.value)
				}
				onInit(values,filterDataSource.slice(0),dataSource.slice(0))
			}
		}
	}

	onChange = (_value: SelectValue, options: any) => {
		const { onChange, labelInValue,valueFilter } = this.props
		if (onChange) {
			let value: BaseSelectValue<IGroup<T> | T>
			if (labelInValue && valueFilter && this.keyToDataSourceMap) {
				if (Array.isArray(options)) {
					const keys = options.map((option) => option.key)
					value = keys.filter((key)=> key in this.keyToDataSourceMap).map((key)=> this.keyToDataSourceMap[key] )
				} else if(options) {
					value = this.keyToDataSourceMap[options.key]
				}
			} else {
				value = _value
			}
			return onChange(value, options)
		}
	}

	// onFocus = () => {
	// 	// if(!this.load){
	// 	// }
	// 	this.getDataSource()
	// 	this.props.onFocus && this.props.onFocus()
	// }

	onDropdownVisibleChange = (open : boolean)=>{
		if(open){
			this.getDataSource()
		}
		this.props.onDropdownVisibleChange && this.props.onDropdownVisibleChange(open)
	}

	getGroupKeyAndLabel(item : T){
		const result: LabeledValue = {key: null, label: null, value: null}
		const {groupKey,groupLabel} = this.props
		if(groupKey && groupLabel){
			result.key = typeof groupKey === 'function' ? groupKey(item) : item[groupKey] as any
			result.label = typeof groupLabel === 'function' ? groupLabel(item) : item[groupLabel] as any
		}
		return result
	}

	toOpotionProps = (data : IGroup<T> | T)=>{
		const { optionProps,customOptionProps} = this.props
		const customProps = customOptionProps ? customOptionProps(data) : null
		const props = optionProps ? optionProps(data) : null
		return {...props,...customProps}
	}

	renderOption = (data: IGroup<T> | T) => {
		data = data || {} as T
		const {labelInValue,valueFilter } = this.props
		const props = this.toOpotionProps(data)
		const key = props.key != null ? props.key : props.value+''
		if(labelInValue && valueFilter && this.keyToDataSourceMap){
			this.keyToDataSourceMap[key] = data
		}
		return <Option {...props} key={key} />
	}

	renderOptions(dataSource : T[]) : React.ReactElement<any>[]{
		const {groupsFilter,groupKey,groupLabel} = this.props
		dataSource = dataSource || []
		if(groupKey != null && groupLabel != null){
			let groups : Array<IGroup<T> | T> = []
			const indexToGroupsMaps : { [key: string]: number } = {}
			dataSource.forEach(item => {
				const {key,label} = this.getGroupKeyAndLabel(item)
				if(key != null && label != null){
					indexToGroupsMaps[key] = indexToGroupsMaps[key] != null ? indexToGroupsMaps[key] : groups.length
					const index = indexToGroupsMaps[key]
					groups[index] = groups[index] || {key,label,children : []} as IGroup<T>
					(groups[index] as IGroup<T>).children.push(item)
				}else{
					groups.push(item)
				}
			})

			if(groupsFilter){
				groups = groupsFilter(groups)
			}
			if(groups.length > 1){
				return (groups || []).map((group)=>{
					if('children' in group){
						const {key,label} = group
						return (
							<OptGroup key={`$$Group_${key}`} label={label}>
								{group.children.map(this.renderOption)}
							</OptGroup>
						)
					}else{
						return this.renderOption(group)
					}
				})
			}else if(groups[0]){
				const group = groups[0]
				return 'children' in group ? group.children.map(this.renderOption) : groups.map(this.renderOption)
			}
		}else{
			return dataSource.map(this.renderOption)
		}
	}

	valueToSelectValue(value : BaseSelectValue<T>) : SelectValue {
		if(value == null){
			return void(0)
		}
		const {labelInValue,valueFilter} = this.props
		if(labelInValue && valueFilter){
			if(Array.isArray(value)){
				return (value as T[]).map((item)=> this.toOpotionProps(item)).filter((item)=> item.value !== void(0) ).map((item)=> ({key : item.value, label : item.children})) as LabeledValue[]
			}else{
				const props = this.toOpotionProps(value as T)
				return props.value !== void(0) ? {key : props.value, label : props.children} as LabeledValue : void(0)
			}
		}else{
			return value as SelectValue
		}
	}

	addValueToToDataSourceMap(){
		if(this.keyToDataSourceMap && this.props.value){
			const values = (Array.isArray(this.props.value) ? this.props.value : [this.props.value]) as T[]
			values.forEach((value)=>{
				const props = this.toOpotionProps(value)
				const key = props.key != null ? props.key : props.value
				if(key != null && key+''){
					this.keyToDataSourceMap[key] = value
				}
			})

		}
	}

	render() {
		const { dataSourceFilter,optionsFilter, optionProps, onChange, value, defaultValue, valueFilter, remoter,
				onLoad, searchFilter, renderChildren, groupKey,groupLabel,groupsFilter,refSelect,SelectComponent,
				...rests } = this.props
		let { loading} = this.state
		let dataSource = this.props.dataSource || this.state.dataSource
		dataSource = dataSourceFilter ? dataSourceFilter(dataSource) : dataSource
		let children: React.ReactNode
		if (this.props.children) {
			children = this.props.children
		} else if (renderChildren) {
			children = renderChildren(dataSource)
		} else {
			this.keyToDataSourceMap = rests.labelInValue && valueFilter ? {} : null
			this.addValueToToDataSourceMap()
			children = this.renderOptions(dataSource)
		}
		if(optionsFilter){
			children = optionsFilter(children as  React.ReactElement<OptionProps>[])
		}
		const props: SelectProps<SelectValue> = { ...rests }
		if ('value' in this.props) {
			props.value = this.valueToSelectValue(value)
		}
		if ('defaultValue' in this.props) {
			props.defaultValue = this.valueToSelectValue(defaultValue)
		}
		const selectProps : SelectProps<SelectValue> = {
			onSearch : searchFilter ? this.onSearch : void (0),
			filterOption : searchFilter ? void(0) : true,
			optionFilterProp : 'children',
			notFoundContent : loading ? <Spin size="small" /> : <span>暂无数据</span>,
			onChange : this.onChange,
			dropdownMatchSelectWidth : false,
			...props,
			onDropdownVisibleChange : this.onDropdownVisibleChange
		}

		if(!SelectComponent){
			return (
				<Select {...selectProps} ref={(select) => refSelect && refSelect(select)} >{children}</Select>
			)
		}else{
			return (
				<SelectComponent {...selectProps} ref={(select) => refSelect && refSelect(select)}>{children}</SelectComponent>
			)
		}
	}
}
