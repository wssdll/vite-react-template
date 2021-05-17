import React from 'react'
import {Input, Modal} from 'antd'
import {OperateMap} from '@/scripts/consts/operates'
import {TextAreaProps} from 'antd/lib/input/TextArea'

export function modalConfirm(key: string, cb: (remark: string) => void, container: boolean | string, inputProps?: TextAreaProps) {
	let remark: string

	let element: boolean | HTMLElement = false

	if(typeof container === 'string'){
		element = document.getElementById(container)
	}

	Modal.confirm({
		getContainer: element,
		title: OperateMap[key],
		content: <>
			<div className="mb-10">是否确定{OperateMap[key]}？</div>
			{(key === 'refuse' || key === 'batchRefuse' || key === 'forbidden') && (
				<Input.TextArea
					placeholder={`请输入${OperateMap[key]}的原因，可不填`}
					allowClear
					autoSize={{minRows: 2}}
					{...inputProps}
					onBlur={(e) => {
						remark = e.target.value
					}}/>)}
		</>,
		maskClosable: true,
		cancelText: '取消',
		okText: '确定',
		onOk: (close) => {
			close()
			cb(remark)
		},
	})
}
